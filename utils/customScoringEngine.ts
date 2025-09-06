import { Card } from '../types/game';
import { ScoringCondition, ScoreResult, ScoringDetail, ConditionScore } from '../types/scoring';
import { getAllTiles, getAllRoadSegments, findClusters, findRoadNetworks } from './scoring';
import { CustomScoringCondition } from '../types/scoring-formulas';

interface ScoringContext {
  tiles: ReturnType<typeof getAllTiles>;
  roadSegments: ReturnType<typeof getAllRoadSegments>;
  clusters: ReturnType<typeof findClusters>;
  roadNetworks: ReturnType<typeof findRoadNetworks>;
  board: Card[];
}

interface CompiledCondition {
  id: string;
  name: string;
  description: string;
  targetContribution: number;
  compiledFormula: Function;
  originalFormula: string;
}

export class CustomScoringEngine {
  private compiledConditions: Map<string, CompiledCondition> = new Map();
  private scoreCache: Map<string, number> = new Map();
  private maxExecutionTime = 50; // 50ms max per condition

  constructor() {}

  private hashBoard(board: Card[]): string {
    // Create a simple hash of the board state for caching
    return board.map(card => `${card.id}_${card.x}_${card.y}_${card.rotation}`).join('|');
  }

  private createScoringContext(board: Card[]): ScoringContext {
    return {
      tiles: getAllTiles(board),
      roadSegments: getAllRoadSegments(board),
      clusters: findClusters(board),
      roadNetworks: findRoadNetworks(board),
      board
    };
  }

  async compileCondition(condition: CustomScoringCondition): Promise<CompiledCondition> {
    const cacheKey = `compile_${condition.id}_${condition.formula}`;
    
    if (this.compiledConditions.has(cacheKey)) {
      return this.compiledConditions.get(cacheKey)!;
    }

    try {
      // Create a safe sandbox for formula execution
      const compiledFormula = this.createSafeFormula(condition.formula);
      
      const compiled: CompiledCondition = {
        id: condition.id,
        name: condition.name,
        description: condition.description,
        targetContribution: condition.targetContribution || 0,
        compiledFormula,
        originalFormula: condition.formula
      };

      this.compiledConditions.set(cacheKey, compiled);
      return compiled;
    } catch (error) {
      console.error(`Failed to compile condition ${condition.name}:`, error);
      throw error;
    }
  }

  private createSafeFormula(formula: string): Function {
    // Parse and create a safe execution environment for custom formulas
    // This is a simplified version - in production, you'd want more robust sandboxing
    
    try {
      // Basic formula parsing - supports common patterns
      const safeFormula = new Function('context', `
        const { tiles, roadSegments, clusters, roadNetworks, board } = context;
        
        // Helper functions available to formulas
        const countTiles = (type) => tiles.filter(t => t.type === type).length;
        const countAdjacent = (type1, type2) => {
          let count = 0;
          const type1Tiles = tiles.filter(t => t.type === type1);
          const type2Tiles = tiles.filter(t => t.type === type2);
          
          for (const t1 of type1Tiles) {
            for (const t2 of type2Tiles) {
              const dx = Math.abs(t1.x - t2.x);
              const dy = Math.abs(t1.y - t2.y);
              if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                count++;
                break;
              }
            }
          }
          return count;
        };
        
        const largestCluster = (type) => {
          const typeClusters = clusters.filter(c => c.type === type);
          if (typeClusters.length === 0) return 0;
          return Math.max(...typeClusters.map(c => c.size));
        };
        
        const longestRoad = () => {
          if (roadNetworks.length === 0) return 0;
          return Math.max(...roadNetworks.map(n => n.size));
        };
        
        // Execute the user's formula
        return ${formula};
      `);
      
      return safeFormula;
    } catch (error) {
      console.error('Formula compilation error:', error);
      throw new Error(`Invalid formula syntax: ${error}`);
    }
  }

  async evaluateCondition(
    condition: CustomScoringCondition | CompiledCondition,
    board: Card[]
  ): Promise<ConditionScore> {
    const boardHash = this.hashBoard(board);
    const cacheKey = `${condition.id}_${boardHash}`;
    
    // Check cache first
    if (this.scoreCache.has(cacheKey)) {
      return {
        condition: this.convertToScoringCondition(condition),
        points: this.scoreCache.get(cacheKey)!,
        fromCache: true
      };
    }

    const startTime = performance.now();
    
    try {
      // Compile if needed
      const compiled = 'compiledFormula' in condition 
        ? condition as CompiledCondition
        : await this.compileCondition(condition as CustomScoringCondition);

      // Create context and execute
      const context = this.createScoringContext(board);
      const points = await this.executeWithTimeout(compiled.compiledFormula, context);
      
      const executionTime = performance.now() - startTime;
      
      // Cache the result
      this.scoreCache.set(cacheKey, points);
      
      // Clear old cache entries if cache gets too large
      if (this.scoreCache.size > 1000) {
        const entriesToDelete = Array.from(this.scoreCache.keys()).slice(0, 500);
        entriesToDelete.forEach(key => this.scoreCache.delete(key));
      }

      return {
        condition: this.convertToScoringCondition(compiled),
        points,
        executionTime
      };
    } catch (error) {
      console.warn(`Error evaluating condition ${condition.name}:`, error);
      return {
        condition: this.convertToScoringCondition(condition),
        points: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async executeWithTimeout(
    formula: Function,
    context: ScoringContext
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Formula execution timeout'));
      }, this.maxExecutionTime);

      try {
        const result = formula(context);
        clearTimeout(timeout);
        
        // Ensure result is a valid number
        const points = Math.max(0, Math.floor(Number(result) || 0));
        resolve(points);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  private convertToScoringCondition(
    condition: CustomScoringCondition | CompiledCondition
  ): ScoringCondition {
    return {
      id: condition.id,
      name: condition.name,
      description: condition.description,
      targetContribution: condition.targetContribution || 0,
      evaluate: (board: Card[]) => {
        // Synchronous evaluation for compatibility
        const context = this.createScoringContext(board);
        try {
          if ('compiledFormula' in condition && typeof condition.compiledFormula === 'function') {
            return condition.compiledFormula(context);
          } else {
            // Fallback to simple evaluation
            return 0;
          }
        } catch {
          return 0;
        }
      },
      evaluateWithDetails: (board: Card[]): ScoringDetail => {
        const context = this.createScoringContext(board);
        try {
          let points = 0;
          if ('compiledFormula' in condition && typeof condition.compiledFormula === 'function') {
            points = condition.compiledFormula(context);
          }
          
          // Try to determine relevant tiles based on the formula
          // This is a simplified version - could be enhanced
          const relevantTiles: Array<{ x: number; y: number }> = [];
          
          return {
            points,
            relevantTiles,
            description: `${condition.name}: ${points} points`
          };
        } catch {
          return {
            points: 0,
            relevantTiles: [],
            description: `${condition.name}: Error evaluating`
          };
        }
      }
    };
  }

  async evaluateAllConditions(
    conditions: CustomScoringCondition[],
    board: Card[]
  ): Promise<ConditionScore[]> {
    // Evaluate conditions in parallel for better performance
    const results = await Promise.all(
      conditions.map(condition => this.evaluateCondition(condition, board))
    );
    
    return results;
  }

  clearCache(): void {
    this.scoreCache.clear();
  }

  precompileConditions(conditions: CustomScoringCondition[]): Promise<CompiledCondition[]> {
    return Promise.all(conditions.map(c => this.compileCondition(c)));
  }
}

// Singleton instance
export const customScoringEngine = new CustomScoringEngine();