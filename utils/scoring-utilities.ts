// Shared scoring utilities for both main thread debug execution and web worker
// This module contains the safe execution context and utility functions

import { GameState, TileData } from "../types/game";
import { Cluster } from "../types/scoring";
import { ScoringContext } from "../types/scoring-context";
import { findClusters, findRoadNetworks, getAllTiles } from "./scoring";

/**
 * Create a safe execution context with utility functions for scoring formulas
 */
export function createScoringContext(
  gameState: GameState,
  options?: { allowConsole?: boolean }
): ScoringContext {
  // Utility functions that can be safely exposed
  const safeUtilities = {
    sum: (numbers: number[]) => numbers.reduce((a, b) => a + b, 0),
    max: (numbers: number[]) => Math.max(...numbers),
    min: (numbers: number[]) => Math.min(...numbers),
    count: <T>(items: T[], predicate: (item: T) => boolean) =>
      items.filter(predicate).length,
  };

  const clusters = findClusters(gameState.board);
  const roads = findRoadNetworks(gameState.board);
  const tiles = getAllTiles(gameState.board);
  const tileMap: { [y: number]: { [x: number]: TileData | null } } = (() => {
    const map: { [y: number]: { [x: number]: TileData | null } } = {};
    for (const tile of tiles) {
      if (!map[tile.y]) {
        map[tile.y] = {};
      }
      map[tile.y][tile.x] = tile;
    }

    return map;
  })();

  // Board utilities - these will be properly implemented with real game state
  const boardUtilities = {
    getAllTiles: () => tiles,

    getTileAt: (row: number, col: number) => {
      return tileMap[row]?.[col] ?? null;
    },

    getAdjacentTiles: (row: number, col: number) => {
      const adjacent = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 },
      ]
        .map((pos) => tileMap[pos.row]?.[pos.col])
        .filter((tile): tile is TileData => tile !== undefined);

      return adjacent;
    },

    findClusters: <T extends string>(...zoneTypes: T[]) => {
      const result: {
        [key in T]: Cluster[];
      } = Object.fromEntries(
        zoneTypes.map((type) => [type, [] as Cluster[]])
      ) as {
        [key in T]: Cluster[];
      };

      for (const cluster of clusters) {
        if (result[cluster.type as T]) {
          result[cluster.type as T]?.push(cluster);
        }
      }

      return result;
    },

    findLargestCluster: (zoneType: string) => {
      return clusters.reduce(
        (largest, current) =>
          current.type === zoneType && current.size > largest.size
            ? current
            : largest,
        {
          type: "",
          size: 0,
          tiles: [],
        } as Cluster
      );
    },

    countZonesOfType: (zoneType: string) => {
      return boardUtilities
        .getAllTiles()
        .filter((tile) => tile.type === zoneType).length;
    },

    findRoadNetworks: () => roads,

    getDistance: (tile1: TileData, tile2: TileData) => {
      const dx = tile1.x - tile2.x;
      const dy = tile1.y - tile2.y;
      return Math.sqrt(dx * dx + dy * dy);
    },

    isAdjacent: (tile1: TileData, tile2: TileData) => {
      const dx = Math.abs(tile1.x - tile2.x);
      const dy = Math.abs(tile1.y - tile2.y);
      return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    },

    getTilesInRadius: (center: TileData, radius: number) => {
      return boardUtilities.getAllTiles().filter((tile) => {
        const distance = boardUtilities.getDistance(center, tile);
        return distance <= radius;
      });
    },
  };

  // Create the context object
  const context: ScoringContext = {
    gameState: JSON.parse(JSON.stringify(gameState)), // Deep clone for safety
    ...safeUtilities,
    ...boardUtilities,
    roads,
    tileMap,
    tiles,
  };

  return context;
}

export function runScoringFormula(compiledJS: string, context: ScoringContext) {
  const contextKeys = Object.keys(context);
  const func = new Function(
    ...contextKeys,
    `
    'use strict';
    ${compiledJS}

    // Execute the user's calculateScore function
    return calculateScore({ ${contextKeys.join(", ")} });
  `
  );

  return func(
    ...(Object.keys(context).map(
      (k) => context[k as keyof ScoringContext]
    ) as any[])
  );
}
