import { Card, CellData, CellType, TileData } from "../types/game";
import {
  Cluster,
  RoadNetwork,
  ScoreResult,
  ScoringCondition,
} from "../types/scoring";

const CARD_WIDTH = 2;
const CARD_HEIGHT = 2;

// Convert card and cell coordinates to world coordinates
function getWorldCoordinates(card: Card, cellRow: number, cellCol: number) {
  return {
    x: card.x + cellCol,
    y: card.y + cellRow,
  };
}

// Get all visible tiles from the board (only top-most tiles when cards overlap)
export function getAllTiles(board: Card[]) {
  // Map to store the top-most tile at each position
  const tileMap = new Map<string, TileData>();

  // Process cards in order - later cards override earlier ones (they're placed on top)
  board.forEach((card, cardIndex) => {
    for (let row = 0; row < CARD_HEIGHT; row++) {
      for (let col = 0; col < CARD_WIDTH; col++) {
        if (card.cells && card.cells[row] && card.cells[row][col]) {
          const cell: CellData = card.cells[row][col];
          const { x, y } = getWorldCoordinates(card, row, col);
          const key = `${x},${y}`;

          // Store or override the tile at this position
          tileMap.set(key, {
            cardId: card.id,
            x,
            y,
            ...cell,
            cardIndex,
          });
        }
      }
    }
  });

  // Convert map to array, removing the cardIndex as it's no longer needed
  return Array.from(tileMap.values());
}

// Find all clusters of connected tiles of the same type
export function findClusters(board: Card[]): Cluster[] {
  const tiles = getAllTiles(board);
  const visited = new Set<string>();
  const clusters: Cluster[] = [];

  // Helper function to get adjacent tile coordinates
  function getAdjacentCoords(x: number, y: number) {
    return [
      { x: x - 1, y }, // left
      { x: x + 1, y }, // right
      { x, y: y - 1 }, // top
      { x, y: y + 1 }, // bottom
    ];
  }

  // Flood fill to find connected cluster
  function floodFill(
    startTile: (typeof tiles)[0],
    targetType: CellType
  ): Cluster {
    const cluster: Cluster = {
      type: targetType,
      tiles: [],
      size: 0,
    };

    const stack = [startTile];

    while (stack.length > 0) {
      const currentTile = stack.pop()!;
      const tileKey = `${currentTile.x},${currentTile.y}`;

      if (visited.has(tileKey)) continue;

      visited.add(tileKey);
      cluster.tiles.push(currentTile);

      // Find adjacent tiles of the same type
      const adjacentCoords = getAdjacentCoords(currentTile.x, currentTile.y);

      for (const coord of adjacentCoords) {
        const adjacentTile = tiles.find(
          (t) => t.x === coord.x && t.y === coord.y
        );
        const adjacentKey = `${coord.x},${coord.y}`;

        if (
          adjacentTile &&
          adjacentTile.type === targetType &&
          !visited.has(adjacentKey)
        ) {
          stack.push(adjacentTile);
        }
      }
    }

    cluster.size = cluster.tiles.length;
    return cluster;
  }

  // Find clusters for each unvisited tile
  for (const tile of tiles) {
    const tileKey = `${tile.x},${tile.y}`;
    if (!visited.has(tileKey)) {
      const cluster = floodFill(tile, tile.type);
      clusters.push(cluster);
    }
  }

  return clusters;
}

// Type for road segment data
type RoadSegmentData = {
  cardId: string;
  cellRow: number;
  cellCol: number;
  x: number;
  y: number;
  segment: [number, number];
};

// Get all visible road segments from the board (only from top-most tiles)
export function getAllRoadSegments(board: Card[]): RoadSegmentData[] {
  // First, get a map of which card is on top at each position
  const topCardMap = new Map<string, number>(); // position -> cardIndex

  board.forEach((card, cardIndex) => {
    for (let row = 0; row < CARD_HEIGHT; row++) {
      for (let col = 0; col < CARD_WIDTH; col++) {
        if (card.cells && card.cells[row] && card.cells[row][col]) {
          const { x, y } = getWorldCoordinates(card, row, col);
          const key = `${x},${y}`;
          topCardMap.set(key, cardIndex); // Later cards override earlier ones
        }
      }
    }
  });

  // Now collect road segments only from tiles that are on top
  const segments: RoadSegmentData[] = [];

  board.forEach((card, cardIndex) => {
    for (let row = 0; row < CARD_HEIGHT; row++) {
      for (let col = 0; col < CARD_WIDTH; col++) {
        const cell = card.cells?.[row]?.[col];
        if (cell && cell.roads && cell.roads.length > 0) {
          const { x, y } = getWorldCoordinates(card, row, col);
          const key = `${x},${y}`;

          // Only include road segments from tiles that are on top
          if (topCardMap.get(key) === cardIndex) {
            for (const roadSegment of cell.roads) {
              segments.push({
                cardId: card.id,
                cellRow: row,
                cellCol: col,
                x,
                y,
                segment: roadSegment,
              });
            }
          }
        }
      }
    }
  });

  return segments;
}

// Check if two road segments connect at a tile boundary
function segmentsConnect(
  seg1: RoadSegmentData,
  seg2: RoadSegmentData
): boolean {
  // Check if segments are in adjacent tiles
  const dx = Math.abs(seg1.x - seg2.x);
  const dy = Math.abs(seg1.y - seg2.y);

  // Must be exactly one tile apart in one direction
  if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
    return false;
  }

  // Determine which edges should connect
  let seg1Edge: number, seg2Edge: number;

  if (dx === 1 && dy === 0) {
    // Horizontal adjacency
    if (seg1.x < seg2.x) {
      // seg1 is left of seg2
      seg1Edge = 1; // right edge of seg1
      seg2Edge = 3; // left edge of seg2
    } else {
      // seg1 is right of seg2
      seg1Edge = 3; // left edge of seg1
      seg2Edge = 1; // right edge of seg2
    }
  } else {
    // Vertical adjacency
    if (seg1.y < seg2.y) {
      // seg1 is above seg2
      seg1Edge = 2; // bottom edge of seg1
      seg2Edge = 0; // top edge of seg2
    } else {
      // seg1 is below seg2
      seg1Edge = 0; // top edge of seg1
      seg2Edge = 2; // bottom edge of seg2
    }
  }

  // Check if the road segments actually connect at those edges
  const seg1Connects =
    seg1.segment[0] === seg1Edge || seg1.segment[1] === seg1Edge;
  const seg2Connects =
    seg2.segment[0] === seg2Edge || seg2.segment[1] === seg2Edge;

  return seg1Connects && seg2Connects;
}

// Find all connected road networks using flood fill
export function findRoadNetworks(board: Card[]): RoadNetwork[] {
  const segments = getAllRoadSegments(board);
  const visited = new Set<string>();
  const networks: RoadNetwork[] = [];

  function getSegmentKey(seg: RoadSegmentData): string {
    return `${seg.cardId}-${seg.cellRow}-${seg.cellCol}-${seg.segment[0]}-${seg.segment[1]}`;
  }

  // Flood fill to find connected road network
  function floodFillRoads(startSegment: RoadSegmentData): RoadNetwork {
    const network: RoadNetwork = {
      segments: [],
      size: 0,
    };

    const stack = [startSegment];

    while (stack.length > 0) {
      const currentSegment = stack.pop()!;
      const segmentKey = getSegmentKey(currentSegment);

      if (visited.has(segmentKey)) continue;

      visited.add(segmentKey);
      network.segments.push(currentSegment);

      // Find connected segments
      for (const otherSegment of segments) {
        const otherKey = getSegmentKey(otherSegment);

        if (
          !visited.has(otherKey) &&
          segmentsConnect(currentSegment, otherSegment)
        ) {
          stack.push(otherSegment);
        }
      }
    }

    network.size = network.segments.length;
    return network;
  }

  // Find networks for each unvisited segment
  for (const segment of segments) {
    const segmentKey = getSegmentKey(segment);
    if (!visited.has(segmentKey)) {
      const network = floodFillRoads(segment);
      networks.push(network);
    }
  }

  return networks;
}

// Calculate base score (clusters - roads)
export function calculateBaseScore(board: Card[]): {
  clusterScores: Record<string, number>;
  roadPenalty: number;
  baseScore: number;
  largestClusters: Record<string, Cluster | null>;
  roadNetworks: RoadNetwork[];
} {
  const clusters = findClusters(board);
  const roadNetworks = findRoadNetworks(board);

  // Find all unique zone types from the board
  const allZoneTypes = new Set<string>();
  for (const card of board) {
    for (const row of card.cells) {
      for (const cell of row) {
        allZoneTypes.add(cell.type);
      }
    }
  }

  // Initialize dynamic scoring objects
  const clusterScores: Record<string, number> = {};
  const largestClusters: Record<string, Cluster | null> = {};
  const clustersByType: Record<string, Cluster[]> = {};

  // Initialize for all zone types found on the board
  for (const zoneType of allZoneTypes) {
    clusterScores[zoneType] = 0;
    largestClusters[zoneType] = null;
    clustersByType[zoneType] = [];
  }

  // Group clusters by type
  for (const cluster of clusters) {
    clustersByType[cluster.type].push(cluster);
  }

  // Get points from largest cluster of each type
  for (const type of allZoneTypes) {
    const typeClusters = clustersByType[type];
    if (typeClusters.length > 0) {
      const largestCluster = typeClusters.reduce((max, cluster) =>
        cluster.size > max.size ? cluster : max
      );
      largestClusters[type] = largestCluster;
      clusterScores[type] = largestCluster.size;
    }
  }

  // Calculate road penalty
  const roadPenalty = -roadNetworks.length; // -1 per road network

  // Calculate base score
  const clusterTotal = Object.values(clusterScores).reduce(
    (sum, score) => sum + score,
    0
  );
  const baseScore = clusterTotal + roadPenalty; // roadPenalty is already negative

  return {
    clusterScores,
    roadPenalty,
    baseScore,
    largestClusters,
    roadNetworks,
  };
}

// Calculate full score including conditions
export function calculateScore(
  board: Card[],
  conditions: ScoringCondition[] = []
): ScoreResult {
  const {
    clusterScores,
    roadPenalty,
    baseScore,
    largestClusters,
    roadNetworks,
  } = calculateBaseScore(board);

  // Calculate condition scores with details
  const conditionScores = conditions.map((condition) => {
    const points = condition.evaluate(board);
    const details = condition.evaluateWithDetails
      ? condition.evaluateWithDetails(board)
      : undefined;
    return {
      condition,
      points,
      details,
    };
  });

  const conditionTotal = conditionScores.reduce(
    (sum, cs) => sum + cs.points,
    0
  );
  const totalScore = baseScore + conditionTotal;

  // Calculate target score (sum of target contributions)
  const targetScore = conditions.reduce((sum, condition) => {
    return sum + (condition.targetContribution || 0);
  }, 0);

  return {
    clusterScores,
    roadPenalty,
    baseScore,
    conditionScores,
    conditionTotal,
    totalScore,
    targetScore,
    largestClusters: largestClusters as Record<CellType, Cluster>,
    roadNetworks,
  };
}
