// Monaco Editor TypeScript definitions for scoring formulas
// This file is imported as raw text to provide IntelliSense in the editor

import type { GameState, TileData } from "./game";
import type { ScoringDetail, Cluster, RoadNetwork } from "./scoring";

// Main scoring context interface available to custom formulas
declare interface ScoringContext {
  // Current game state
  gameState: GameState;
  roads: Array<RoadNetwork>;
  tileMap: { [y: number]: { [x: number]: TileData | null } };
  tiles: Array<TileData>;

  // Board utilities
  getAllTiles(): Array<TileData>;
  getTileAt(row: number, col: number): TileData | null;
  getAdjacentTiles(row: number, col: number): Array<TileData>;

  // Zone analysis
  findClusters<T extends string>(
    ...zoneTypes: T[]
  ): {
    [K in T]: Array<Cluster>;
  };
  findLargestCluster(zoneType: string): Cluster;
  countZonesOfType(zoneType: string): number;

  // Road utilities
  findRoadNetworks(): Array<RoadNetwork>;

  // Geometric utilities
  getDistance(tile1: TileData, tile2: TileData): number;
  isAdjacent(tile1: TileData, tile2: TileData): boolean;
  getTilesInRadius(
    center: { x: number; y: number },
    radius: number
  ): Array<TileData>;

  // Scoring helpers
  sum(numbers: number[]): number;
  max(numbers: number[]): number;
  min(numbers: number[]): number;
  count<T>(items: T[], predicate: (item: T) => boolean): number;
}

// Expected function signature for scoring formulas
declare function calculateScore(context: ScoringContext): number;

// Optional function for detailed scoring with tile highlights
declare function calculateScoreWithDetails(context: ScoringContext): {
  score: number;
  details?: ScoringDetail[];
  highlightedTiles?: Array<{ row: number; col: number }>;
};

// Common zone types (for IntelliSense suggestions)
type ZoneType =
  | "residential"
  | "commercial"
  | "industrial"
  | "road"
  | "park"
  | "water";
