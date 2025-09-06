import type { ScoringResult } from '../types/scoring-formulas';
import type { GameState } from '../types/game';

class ScoringSandbox {
  private worker: Worker | null = null;
  private requestId = 0;
  private pendingRequests = new Map<number, {
    resolve: (result: ScoringResult) => void;
    reject: (error: Error) => void;
  }>();

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    try {
      // Use Vite's Web Worker syntax
      this.worker = new Worker(
        new URL('./scoring-worker.ts', import.meta.url),
        { type: 'module' }
      );
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
    } catch (error) {
      console.error('Failed to initialize scoring worker:', error);
    }
  }

  private handleWorkerMessage(event: MessageEvent) {
    const { id, result, error } = event.data;
    const request = this.pendingRequests.get(id);
    
    if (request) {
      this.pendingRequests.delete(id);
      
      if (error) {
        request.reject(new Error(error));
      } else {
        request.resolve(result);
      }
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error);
    
    // Reject all pending requests
    for (const request of this.pendingRequests.values()) {
      request.reject(new Error('Worker error: ' + error.message));
    }
    this.pendingRequests.clear();
    
    // Attempt to reinitialize worker
    this.terminate();
    setTimeout(() => this.initializeWorker(), 1000);
  }

  async executeFormula(compiledJS: string, gameState: GameState): Promise<ScoringResult> {
    if (!this.worker) {
      throw new Error('Worker not available');
    }

    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      
      // Set up request tracking
      this.pendingRequests.set(id, { resolve, reject });
      
      // Set up timeout (backup in case worker doesn't respond)
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('Request timeout'));
      }, 200); // 200ms total timeout including worker initialization
      
      // Clean up timeout when request completes
      const originalResolve = resolve;
      const originalReject = reject;
      
      const wrappedResolve = (result: ScoringResult) => {
        clearTimeout(timeoutId);
        originalResolve(result);
      };
      
      const wrappedReject = (error: Error) => {
        clearTimeout(timeoutId);
        originalReject(error);
      };
      
      this.pendingRequests.set(id, { 
        resolve: wrappedResolve, 
        reject: wrappedReject 
      });
      
      // Send execution request to worker
      this.worker!.postMessage({
        id,
        formula: compiledJS,
        gameState: this.sanitizeGameState(gameState),
      });
    });
  }

  private sanitizeGameState(gameState: GameState): any {
    // Remove any potentially dangerous references and create a clean copy
    return {
      board: gameState.board || [],
      players: gameState.players || [],
      currentPlayerIndex: gameState.currentPlayerIndex || 0,
      deck: gameState.deck || [],
      gamePhase: gameState.gamePhase || 'ended',
      topCard: gameState.topCard || null,
      turnCount: gameState.turnCount || 0,
      scoring: {
        activeConditions: gameState.scoring?.activeConditions || [],
        targetScore: gameState.scoring?.targetScore || 0,
      },
    };
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    // Reject all pending requests
    for (const request of this.pendingRequests.values()) {
      request.reject(new Error('Worker terminated'));
    }
    this.pendingRequests.clear();
  }
}

// Singleton instance
let sandboxInstance: ScoringSandbox | null = null;

export function executeScoringFormula(
  compiledJS: string, 
  gameState: GameState
): Promise<ScoringResult> {
  if (!sandboxInstance) {
    sandboxInstance = new ScoringSandbox();
  }
  
  return sandboxInstance.executeFormula(compiledJS, gameState);
}

export function terminateSandbox() {
  if (sandboxInstance) {
    sandboxInstance.terminate();
    sandboxInstance = null;
  }
}

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', terminateSandbox);
}