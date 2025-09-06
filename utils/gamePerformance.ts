import { Card } from '../types/game';
import { CustomDeck } from '../types/deck';
import { CustomScoringCondition } from '../types/scoring-formulas';
import { customScoringEngine } from './customScoringEngine';

interface CompiledDeck extends CustomDeck {
  compiledConditions?: Map<string, Function>;
}

interface PerformanceMetrics {
  deckLoadTime: number;
  scoringExecutionTime: number;
  lastMeasurement: Date;
  averageFrameTime: number;
}

export class GamePerformanceOptimizer {
  private compiledDecks: Map<string, CompiledDeck> = new Map();
  private scoringCache: Map<string, number> = new Map();
  private metrics: PerformanceMetrics = {
    deckLoadTime: 0,
    scoringExecutionTime: 0,
    lastMeasurement: new Date(),
    averageFrameTime: 0
  };
  private frameTimeBuffer: number[] = [];
  private maxCacheSize = 500;
  private maxFrameTimeBufferSize = 60;

  constructor() {
    this.startPerformanceMonitoring();
  }

  // Precompile scoring formulas during deck load
  async precompileDeck(deck: CustomDeck): Promise<CompiledDeck> {
    const startTime = performance.now();
    const cacheKey = `deck_${deck.id}_${deck.metadata.modified}`;
    
    // Check if already compiled
    if (this.compiledDecks.has(cacheKey)) {
      return this.compiledDecks.get(cacheKey)!;
    }

    const compiledDeck: CompiledDeck = { ...deck, compiledConditions: new Map() };
    
    // Compile all custom scoring conditions
    if (deck.customScoringConditions && deck.customScoringConditions.length > 0) {
      const compiledConditions = await customScoringEngine.precompileConditions(
        deck.customScoringConditions
      );
      
      compiledConditions.forEach(condition => {
        compiledDeck.compiledConditions!.set(condition.id, condition.compiledFormula);
      });
    }

    this.compiledDecks.set(cacheKey, compiledDeck);
    this.metrics.deckLoadTime = performance.now() - startTime;
    
    // Clean up old compiled decks if cache gets too large
    if (this.compiledDecks.size > 10) {
      const keysToDelete = Array.from(this.compiledDecks.keys()).slice(0, 5);
      keysToDelete.forEach(key => this.compiledDecks.delete(key));
    }

    return compiledDeck;
  }

  // Cache scoring results for identical board states
  getCachedScore(boardHash: string): number | null {
    return this.scoringCache.get(boardHash) || null;
  }

  setCachedScore(boardHash: string, score: number): void {
    this.scoringCache.set(boardHash, score);
    
    // Implement LRU cache eviction
    if (this.scoringCache.size > this.maxCacheSize) {
      const firstKey = this.scoringCache.keys().next().value;
      if (firstKey !== undefined) {
        this.scoringCache.delete(firstKey);
      }
    }
  }

  // Generate a hash for the board state
  hashBoardState(board: Card[]): string {
    // Create a deterministic hash of the board state
    const sortedCards = [...board].sort((a, b) => {
      if (a.x !== b.x) return a.x - b.x;
      if (a.y !== b.y) return a.y - b.y;
      return a.id.localeCompare(b.id);
    });
    
    return sortedCards
      .map(card => `${card.id}_${card.x}_${card.y}_${card.rotation}`)
      .join('|');
  }

  // Batch scoring calculations for better performance
  async batchCalculateScores(
    boards: Card[][],
    conditions: CustomScoringCondition[]
  ): Promise<number[]> {
    const startTime = performance.now();
    
    // Process in parallel but limit concurrency
    const batchSize = 5;
    const results: number[] = [];
    
    for (let i = 0; i < boards.length; i += batchSize) {
      const batch = boards.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (board) => {
          const boardHash = this.hashBoardState(board);
          const cached = this.getCachedScore(boardHash);
          
          if (cached !== null) {
            return cached;
          }
          
          // Calculate score
          const scores = await customScoringEngine.evaluateAllConditions(conditions, board);
          const total = scores.reduce((sum, score) => sum + score.points, 0);
          
          this.setCachedScore(boardHash, total);
          return total;
        })
      );
      
      results.push(...batchResults);
    }
    
    this.metrics.scoringExecutionTime = performance.now() - startTime;
    return results;
  }

  // Performance monitoring
  private startPerformanceMonitoring(): void {
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      let lastFrameTime = performance.now();
      
      const measureFrame = () => {
        const currentTime = performance.now();
        const frameTime = currentTime - lastFrameTime;
        
        this.frameTimeBuffer.push(frameTime);
        if (this.frameTimeBuffer.length > this.maxFrameTimeBufferSize) {
          this.frameTimeBuffer.shift();
        }
        
        this.metrics.averageFrameTime = 
          this.frameTimeBuffer.reduce((sum, time) => sum + time, 0) / 
          this.frameTimeBuffer.length;
        
        lastFrameTime = currentTime;
        requestAnimationFrame(measureFrame);
      };
      
      requestAnimationFrame(measureFrame);
    }
  }

  // Get performance metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Check if performance is degraded
  isPerformanceDegraded(): boolean {
    // Consider performance degraded if average frame time > 20ms (50fps)
    return this.metrics.averageFrameTime > 20;
  }

  // Optimize for mobile devices
  getMobileOptimizations(): {
    reducedAnimations: boolean;
    limitedParallelScoring: boolean;
    simplifiedRendering: boolean;
  } {
    const isMobile = typeof window !== 'undefined' && 
                     ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const isLowPerformance = this.isPerformanceDegraded();
    
    return {
      reducedAnimations: isMobile || isLowPerformance,
      limitedParallelScoring: isMobile,
      simplifiedRendering: isMobile && isLowPerformance
    };
  }

  // Clear all caches
  clearCaches(): void {
    this.compiledDecks.clear();
    this.scoringCache.clear();
    customScoringEngine.clearCache();
  }

  // Preload and warm up caches
  async warmUpCaches(decks: CustomDeck[]): Promise<void> {
    // Precompile all decks
    await Promise.all(decks.map(deck => this.precompileDeck(deck)));
    
    // Warm up the scoring engine
    if (decks.length > 0 && decks[0].customScoringConditions) {
      const testBoard: Card[] = [{
        id: 'test',
        x: 0,
        y: 0,
        rotation: 0,
        cells: [[
          { type: 'residential', roads: [] },
          { type: 'commercial', roads: [] }
        ], [
          { type: 'industrial', roads: [] },
          { type: 'park', roads: [] }
        ]]
      }];
      
      await customScoringEngine.evaluateAllConditions(
        decks[0].customScoringConditions,
        testBoard
      );
    }
  }
}

// Singleton instance
export const gamePerformanceOptimizer = new GamePerformanceOptimizer();

// Error recovery system
export class CustomDeckErrorHandler {
  private notificationCallback?: (message: string, type: 'error' | 'warning' | 'info') => void;

  constructor(notificationCallback?: (message: string, type: 'error' | 'warning' | 'info') => void) {
    this.notificationCallback = notificationCallback;
  }

  handleScoringError(error: Error, conditionName: string): number {
    console.error(`Scoring error in ${conditionName}:`, error);
    
    this.notificationCallback?.(
      `Custom scoring rule "${conditionName}" encountered an error and was disabled`,
      'warning'
    );
    
    // Return 0 points as fallback
    return 0;
  }

  handleDeckLoadError(deck: CustomDeck, error: Error): void {
    console.error(`Failed to load custom deck "${deck.name}":`, error);
    
    this.notificationCallback?.(
      `Custom deck "${deck.name}" could not be loaded. Please check the deck configuration.`,
      'error'
    );
  }

  validateDeckBeforeGame(deck: CustomDeck): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate basic structure
    if (!deck.baseCards || deck.baseCards.length === 0) {
      errors.push('Deck must contain at least one card');
    }
    
    // Validate custom scoring conditions
    if (deck.customScoringConditions) {
      deck.customScoringConditions.forEach(condition => {
        if (!condition.formula || condition.formula.trim() === '') {
          errors.push(`Scoring condition "${condition.name}" has no formula`);
        }
        
        // Basic formula validation
        try {
          new Function('context', `return ${condition.formula}`);
        } catch (e) {
          errors.push(`Invalid formula in "${condition.name}": ${e}`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Mobile-specific optimizations
export interface MobileOptimizationConfig {
  enableTouchGestures: boolean;
  reducedParticleEffects: boolean;
  simplifiedScoringAnimations: boolean;
  cacheSizeLimit: number;
  offlineMode: boolean;
}

export function getMobileOptimizationConfig(): MobileOptimizationConfig {
  const isMobile = typeof window !== 'undefined' && 
                   ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const isSlowDevice = typeof navigator !== 'undefined' && 
                       navigator.hardwareConcurrency <= 2;
  
  return {
    enableTouchGestures: isMobile,
    reducedParticleEffects: isMobile || isSlowDevice,
    simplifiedScoringAnimations: isMobile && isSlowDevice,
    cacheSizeLimit: isMobile ? 100 : 500,
    offlineMode: typeof navigator !== 'undefined' && !navigator.onLine
  };
}