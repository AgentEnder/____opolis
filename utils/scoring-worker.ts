// TypeScript Web Worker for sandboxed scoring formula execution
// This worker runs in complete isolation from the main thread

import type { GameState } from "../types/game";

// Timeout for formula execution (100ms)
const EXECUTION_TIMEOUT = 100;

interface WorkerMessage {
  id: number;
  formula: string;
  gameState: GameState;
}

interface WorkerResponse {
  id: number;
  result?: {
    score: number;
    executionTime: number;
    highlightedTiles: Array<{ row: number; col: number }>;
  };
  error?: string;
}

// Import shared utilities
import { createScoringContext, runScoringFormula } from "./scoring-utilities";

// Use the shared createSafeContext (renamed for clarity)
function createSafeContext(gameState: GameState) {
  return createScoringContext(gameState);
}

// Execute user formula with timeout protection
function executeFormula(compiledCode: string, gameState: GameState) {
  return new Promise<{
    score: number;
    executionTime: number;
    highlightedTiles: Array<{ row: number; col: number }>;
  }>((resolve, reject) => {
    const startTime = performance.now();

    // Set up execution timeout
    const timeoutId = setTimeout(() => {
      reject(new Error("Formula execution timeout (100ms exceeded)"));
    }, EXECUTION_TIMEOUT);

    try {
      // Create a clean execution context
      const context = createSafeContext(gameState);

      // Remove dangerous globals
      // @ts-ignore
      const originalImportScripts = self.importScripts;

      // @ts-ignore
      self.importScripts = undefined;
      // @ts-ignore
      self.fetch = undefined;
      // @ts-ignore
      self.XMLHttpRequest = undefined;

      try {
        // Execute the compiled formula in isolated scope
        const result = runScoringFormula(compiledCode, context);
        const executionTime = performance.now() - startTime;

        clearTimeout(timeoutId);

        // Validate result
        if (typeof result !== "number" || !isFinite(result)) {
          reject(new Error("Formula must return a finite number"));
          return;
        }

        resolve({
          score: result,
          executionTime,
          highlightedTiles: [], // TODO: Implement tile highlighting based on formula analysis
        });
      } finally {
        // Restore globals
        // @ts-ignore
        self.importScripts = originalImportScripts;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}

// Message handler
self.onmessage = async function (event: MessageEvent<WorkerMessage>) {
  const { id, formula, gameState } = event.data;

  try {
    const result = await executeFormula(formula, gameState);

    const response: WorkerResponse = {
      id,
      result,
      error: undefined,
    };

    self.postMessage(response);
  } catch (error) {
    const response: WorkerResponse = {
      id,
      result: undefined,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    self.postMessage(response);
  }
};
