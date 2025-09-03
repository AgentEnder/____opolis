import { GameState } from "./game";
import type { ScoringCondition, ScoringDetail } from "./scoring";

// TypeScript compilation result
export interface CompilationResult {
  source: string;
  compiled: string;
  sourceMap?: string;
  success: boolean;
  error?: string;
  diagnostics?: string[];
}

// Sandboxed execution result
export interface ScoringResult {
  score: number;
  details?: ScoringDetail[];
  executionTime: number;
  error?: string;
  highlightedTiles?: Array<{ row: number; col: number }>;
}

// Test case for formula validation
export interface TestCase {
  id: string;
  name: string;
  boardState: GameState;
  expectedScore?: number;
  description?: string;
}

// Editor state
export interface FormulaEditorState {
  formula: string;
  compilationResult?: CompilationResult;
  testResults: Map<string, ScoringResult>;
  isCompiling: boolean;
  isTesting: boolean;
  selectedTestCase?: string;
}

// Custom scoring condition with TypeScript formula
export interface CustomScoringCondition extends ScoringCondition {
  isCustom: true;
  isGlobal?: boolean; // If true, applies to all games with this deck, not tied to specific cards
  formula: string;
  compiledFormula: string;
  testCases: TestCase[];
  createdAt: Date;
  updatedAt: Date;
}

// Formula template for quick start
export interface FormulaTemplate {
  id: string;
  name: string;
  description: string;
  category: "adjacency" | "cluster" | "road" | "diversity" | "geometric";
  code: string;
  explanation: string;
}
