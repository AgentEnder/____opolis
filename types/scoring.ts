import { Card, CellType, TileData } from "./game";

// Information about tiles relevant to a scoring condition
export interface ScoringDetail {
  points: number;
  relevantTiles: Array<{ x: number; y: number }>;
  description?: string;
}

// Scoring condition that can be applied to evaluate a board state
export interface ScoringCondition {
  id: string;
  name: string;
  description: string;
  // Function to evaluate this condition against the current board
  evaluate: (board: Card[]) => number;
  // Function to get detailed information about scoring (with relevant tiles)
  evaluateWithDetails?: (board: Card[]) => ScoringDetail;
  // Some conditions might contribute to target score
  targetContribution?: number;
}

// Result of scoring calculation
export interface ScoreResult {
  // Base scoring components
  clusterScores: Record<CellType, number>; // Points from largest cluster of each type
  roadPenalty: number; // Negative points from road networks
  baseScore: number; // Sum of cluster scores minus road penalty

  // Condition-based scoring
  conditionScores: {
    condition: ScoringCondition;
    points: number;
    details?: ScoringDetail;
  }[];
  conditionTotal: number;

  // Final totals
  totalScore: number;
  targetScore: number;

  // Details for visualization
  largestClusters?: Record<CellType, Cluster>; // Largest cluster of each type for visualization
  roadNetworks?: RoadNetwork[]; // All road networks for visualization
}

// Represents a connected cluster of cells of the same type
export interface Cluster {
  type: CellType;
  tiles: Array<TileData>;
  size: number;
}

// Represents a connected road network
export interface RoadNetwork {
  segments: Array<{
    cardId: string;
    cellRow: number;
    cellCol: number;
    x: number; // world coordinates
    y: number;
    segment: [number, number]; // [from_edge, to_edge]
  }>;
  size: number; // number of connected segments
}

// Extended card definition that can have scoring conditions
export interface ScoringCard extends Card {
  scoringCondition?: ScoringCondition;
}

// Game scoring state
export interface GameScoring {
  activeConditions: ScoringCondition[]; // The 3 active scoring conditions
  targetScore: number; // Calculated target score
  currentScore?: ScoreResult; // Current score (calculated on demand)
}
