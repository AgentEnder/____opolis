import { Card } from './game';
import { CustomScoringCondition } from './scoring-formulas';
import { CustomDeck } from './deck';

/**
 * Represents a highlighted tile on the board for visual feedback
 */
export interface TileHighlight {
  row: number;
  col: number;
  color: string;
  intensity: number; // 0-1, where 1 is most highlighted
  description?: string;
}

/**
 * Results from testing a scoring rule
 */
export interface RuleTestResults {
  ruleId: string;
  testBoard: Card[];
  calculatedScore: number;
  highlightedTiles: TileHighlight[];
  executionTime: number;
  errors: string[];
  details?: {
    description: string;
    breakdown: Array<{
      description: string;
      points: number;
      tiles: Array<{ row: number; col: number }>;
    }>;
  };
}

/**
 * Configuration for the rule testing environment
 */
export interface RuleTestEnvironment {
  currentRule: CustomScoringCondition | null;
  testBoard: Card[];
  availableCards: Card[];
  scoringResults: RuleTestResults | null;
  highlightedTiles: TileHighlight[];
  boardSize: number;
  isLoading: boolean;
}

/**
 * Preset board configurations for testing
 */
export interface BoardPreset {
  id: string;
  name: string;
  description: string;
  board: Card[];
  suggestedRules: string[]; // Rule IDs that work well with this preset
}

/**
 * Test scenario with expected results
 */
export interface TestScenario {
  id: string;
  name: string;
  description: string;
  board: Card[];
  ruleId: string;
  expectedScore: number;
  expectedHighlights?: Array<{ row: number; col: number }>;
}

/**
 * Board position for placing cards
 */
export interface BoardPosition {
  x: number;
  y: number;
}