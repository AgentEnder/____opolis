import { ScoringCondition, ScoringDetail } from '../types/scoring';
import { findClusters, findRoadNetworks, getAllTiles } from './scoring';
import { Card, CellType } from '../types/game';

// Use the exported getAllTiles function from scoring.ts

// Example scoring conditions that might appear on cards

export const SCORING_CONDITIONS: Record<string, ScoringCondition> = {
  // Residential scoring variations
  'residential-groups': {
    id: 'residential-groups',
    name: 'Residential Groups',
    description: '+1 point per residential area (instead of just the largest)',
    targetContribution: 8,
    evaluate: (board: Card[]) => {
      const clusters = findClusters(board);
      const residentialClusters = clusters.filter(c => c.type === 'residential');
      return residentialClusters.reduce((sum, cluster) => sum + cluster.size, 0);
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const clusters = findClusters(board);
      const residentialClusters = clusters.filter(c => c.type === 'residential');
      const relevantTiles: Array<{ x: number; y: number }> = [];
      
      // Collect all tiles from all residential clusters
      for (const cluster of residentialClusters) {
        for (const tile of cluster.tiles) {
          relevantTiles.push({ x: tile.x, y: tile.y });
        }
      }
      
      const points = residentialClusters.reduce((sum, cluster) => sum + cluster.size, 0);
      return {
        points,
        relevantTiles,
        description: `${residentialClusters.length} residential area(s) = ${points} points`
      };
    }
  },

  'residential-near-parks': {
    id: 'residential-near-parks', 
    name: 'Suburban Living',
    description: '+1 point for each residential tile adjacent to a park tile',
    targetContribution: 6,
    evaluate: (board: Card[]) => {
      const tiles = getAllTiles(board);
      const residentialTiles = tiles.filter(t => t.type === 'residential');
      const parkTiles = tiles.filter(t => t.type === 'park');
      
      let points = 0;
      for (const resTile of residentialTiles) {
        const hasAdjacentPark = parkTiles.some(parkTile => {
          const dx = Math.abs(resTile.x - parkTile.x);
          const dy = Math.abs(resTile.y - parkTile.y);
          return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
        });
        if (hasAdjacentPark) points += 1;
      }
      return points;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const tiles = getAllTiles(board);
      const residentialTiles = tiles.filter(t => t.type === 'residential');
      const parkTiles = tiles.filter(t => t.type === 'park');
      const relevantTiles: Array<{ x: number; y: number }> = [];
      
      let points = 0;
      for (const resTile of residentialTiles) {
        const adjacentParks = parkTiles.filter(parkTile => {
          const dx = Math.abs(resTile.x - parkTile.x);
          const dy = Math.abs(resTile.y - parkTile.y);
          return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
        });
        
        if (adjacentParks.length > 0) {
          points += 1;
          // Add the residential tile and its adjacent parks
          relevantTiles.push({ x: resTile.x, y: resTile.y });
          for (const park of adjacentParks) {
            if (!relevantTiles.some(t => t.x === park.x && t.y === park.y)) {
              relevantTiles.push({ x: park.x, y: park.y });
            }
          }
        }
      }
      
      return {
        points,
        relevantTiles,
        description: `${points} residential tiles adjacent to parks`
      };
    }
  },

  // Commercial scoring variations  
  'commercial-corners': {
    id: 'commercial-corners',
    name: 'Corner Shops',
    description: '+3 points for each commercial tile at the corner of a 2x2 square',
    targetContribution: 9,
    evaluate: (board: Card[]) => {
      const tiles = getAllTiles(board);
      const commercialTiles = tiles.filter(t => t.type === 'commercial');
      
      let points = 0;
      for (const commTile of commercialTiles) {
        // Check if this commercial tile is at the corner of a 2x2 square
        // where the other 3 tiles are non-commercial (making it a true "corner shop")
        const corners = [
          [-1, -1], [0, -1], [-1, 0], [0, 0] // relative positions where this tile could be a corner
        ];
        
        for (const [dx, dy] of corners) {
          const squarePositions = [
            { x: commTile.x + dx, y: commTile.y + dy },
            { x: commTile.x + dx + 1, y: commTile.y + dy },
            { x: commTile.x + dx, y: commTile.y + dy + 1 },
            { x: commTile.x + dx + 1, y: commTile.y + dy + 1 }
          ];
          
          // Check if all 4 positions have tiles
          const squareTiles = squarePositions.map(pos => 
            tiles.find(t => t.x === pos.x && t.y === pos.y)
          );
          
          const hasAllTiles = squareTiles.every(tile => tile !== undefined);
          
          if (hasAllTiles) {
            // Count commercial tiles in this 2x2 square
            const commercialCount = squareTiles.filter(tile => tile!.type === 'commercial').length;
            
            // Only award points if there's exactly 1 commercial tile (this one) in the 2x2 square
            if (commercialCount === 1 && squareTiles.some(tile => 
              tile!.x === commTile.x && tile!.y === commTile.y)) {
              points += 3;
              break; // Only count each commercial tile once
            }
          }
        }
      }
      return points;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const tiles = getAllTiles(board);
      const commercialTiles = tiles.filter(t => t.type === 'commercial');
      const relevantTiles: Array<{ x: number; y: number }> = [];
      
      let points = 0;
      for (const commTile of commercialTiles) {
        // Check if this commercial tile is at the corner of a 2x2 square
        // where the other 3 tiles are non-commercial (making it a true "corner shop")
        const corners = [
          [-1, -1], [0, -1], [-1, 0], [0, 0] // relative positions where this tile could be a corner
        ];
        
        for (const [dx, dy] of corners) {
          const squarePositions = [
            { x: commTile.x + dx, y: commTile.y + dy },
            { x: commTile.x + dx + 1, y: commTile.y + dy },
            { x: commTile.x + dx, y: commTile.y + dy + 1 },
            { x: commTile.x + dx + 1, y: commTile.y + dy + 1 }
          ];
          
          // Check if all 4 positions have tiles
          const squareTiles = squarePositions.map(pos => 
            tiles.find(t => t.x === pos.x && t.y === pos.y)
          );
          
          const hasAllTiles = squareTiles.every(tile => tile !== undefined);
          
          if (hasAllTiles) {
            // Count commercial tiles in this 2x2 square
            const commercialCount = squareTiles.filter(tile => tile!.type === 'commercial').length;
            
            // Only award points if there's exactly 1 commercial tile (this one) in the 2x2 square
            if (commercialCount === 1 && squareTiles.some(tile => 
              tile!.x === commTile.x && tile!.y === commTile.y)) {
              points += 3;
              // Add all tiles in the 2x2 square
              for (const pos of squarePositions) {
                if (!relevantTiles.some(t => t.x === pos.x && t.y === pos.y)) {
                  relevantTiles.push({ x: pos.x, y: pos.y });
                }
              }
              break; // Only count each commercial tile once
            }
          }
        }
      }
      
      return {
        points,
        relevantTiles,
        description: `${points/3} commercial corner shop(s) in 2x2 squares = ${points} points`
      };
    }
  },

  // Industrial scoring variations
  'industrial-edges': {
    id: 'industrial-edges',
    name: 'Industrial District',  
    description: '+2 points for each industrial tile on the edge of your city',
    targetContribution: 8,
    evaluate: (board: Card[]) => {
      const tiles = getAllTiles(board);
      const industrialTiles = tiles.filter(t => t.type === 'industrial');
      
      if (tiles.length === 0) return 0;
      
      // Find the bounds of the city
      const minX = Math.min(...tiles.map(t => t.x));
      const maxX = Math.max(...tiles.map(t => t.x));
      const minY = Math.min(...tiles.map(t => t.y));
      const maxY = Math.max(...tiles.map(t => t.y));
      
      let points = 0;
      for (const indTile of industrialTiles) {
        if (indTile.x === minX || indTile.x === maxX || 
            indTile.y === minY || indTile.y === maxY) {
          points += 2;
        }
      }
      return points;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const tiles = getAllTiles(board);
      const industrialTiles = tiles.filter(t => t.type === 'industrial');
      const relevantTiles: Array<{ x: number; y: number }> = [];
      
      if (tiles.length === 0) {
        return { points: 0, relevantTiles: [], description: 'No tiles on board = 0 points' };
      }
      
      // Find the bounds of the city
      const minX = Math.min(...tiles.map(t => t.x));
      const maxX = Math.max(...tiles.map(t => t.x));
      const minY = Math.min(...tiles.map(t => t.y));
      const maxY = Math.max(...tiles.map(t => t.y));
      
      let points = 0;
      for (const indTile of industrialTiles) {
        if (indTile.x === minX || indTile.x === maxX || 
            indTile.y === minY || indTile.y === maxY) {
          points += 2;
          relevantTiles.push({ x: indTile.x, y: indTile.y });
        }
      }
      
      return {
        points,
        relevantTiles,
        description: `${points/2} industrial tiles on city edges = ${points} points`
      };
    }
  },

  // Road-based scoring
  'long-roads': {
    id: 'long-roads',
    name: 'Highway System',
    description: '+2 points for each road network with 4+ segments (instead of -1 penalty)',
    targetContribution: 6,
    evaluate: (board: Card[]) => {
      const roadNetworks = findRoadNetworks(board);
      const longRoads = roadNetworks.filter(network => network.size >= 4);
      return longRoads.length * 2;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const roadNetworks = findRoadNetworks(board);
      const longRoads = roadNetworks.filter(network => network.size >= 4);
      const relevantTiles: Array<{ x: number; y: number }> = [];
      
      // Collect all tiles that contain long road segments
      for (const network of longRoads) {
        for (const segment of network.segments) {
          if (!relevantTiles.some(t => t.x === segment.x && t.y === segment.y)) {
            relevantTiles.push({ x: segment.x, y: segment.y });
          }
        }
      }
      
      const points = longRoads.length * 2;
      return {
        points,
        relevantTiles,
        description: `${longRoads.length} long road(s) with 4+ segments = ${points} points`
      };
    }
  },

  'road-loops': {
    id: 'road-loops',
    name: 'Circular Routes',
    description: '+5 points for each road network that forms a complete loop',
    targetContribution: 10,
    evaluate: (board: Card[]) => {
      // This is a simplified version - detecting actual loops is complex
      // For now, we'll count networks with 6+ segments as likely loops
      const roadNetworks = findRoadNetworks(board);
      const likelyLoops = roadNetworks.filter(network => network.size >= 6);
      return likelyLoops.length * 5;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      // This is a simplified version - detecting actual loops is complex
      // For now, we'll count networks with 6+ segments as likely loops
      const roadNetworks = findRoadNetworks(board);
      const likelyLoops = roadNetworks.filter(network => network.size >= 6);
      const relevantTiles: Array<{ x: number; y: number }> = [];
      
      // Collect all tiles that contain loop road segments
      for (const network of likelyLoops) {
        for (const segment of network.segments) {
          if (!relevantTiles.some(t => t.x === segment.x && t.y === segment.y)) {
            relevantTiles.push({ x: segment.x, y: segment.y });
          }
        }
      }
      
      const points = likelyLoops.length * 5;
      return {
        points,
        relevantTiles,
        description: `${likelyLoops.length} potential loop(s) with 6+ segments = ${points} points`
      };
    }
  },

  // Mixed zone scoring
  'diversity-bonus': {
    id: 'diversity-bonus',
    name: 'Mixed Development',
    description: '+3 points for each different zone type you have at least 3 tiles of',
    targetContribution: 12,
    evaluate: (board: Card[]) => {
      const tiles = getAllTiles(board);
      const typeCounts: Record<CellType, number> = {
        residential: 0,
        commercial: 0,
        industrial: 0,
        park: 0
      };
      
      for (const tile of tiles) {
        typeCounts[tile.type]++;
      }
      
      const qualifyingTypes = Object.values(typeCounts).filter(count => count >= 3);
      return qualifyingTypes.length * 3;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const tiles = getAllTiles(board);
      const typeCounts: Record<CellType, number> = {
        residential: 0,
        commercial: 0,
        industrial: 0,
        park: 0
      };
      
      // Count tiles by type
      for (const tile of tiles) {
        typeCounts[tile.type]++;
      }
      
      const relevantTiles: Array<{ x: number; y: number }> = [];
      const qualifyingTypes: string[] = [];
      
      // Find types with 3+ tiles and collect their tiles
      for (const [type, count] of Object.entries(typeCounts)) {
        if (count >= 3) {
          qualifyingTypes.push(type);
          // Add tiles of this type
          const tilesOfType = tiles.filter(t => t.type === type as CellType);
          for (const tile of tilesOfType) {
            relevantTiles.push({ x: tile.x, y: tile.y });
          }
        }
      }
      
      const points = qualifyingTypes.length * 3;
      return {
        points,
        relevantTiles,
        description: `${qualifyingTypes.length} zone type(s) with 3+ tiles: ${qualifyingTypes.join(', ')} = ${points} points`
      };
    }
  },

  // Longest road scoring conditions
  'longest-road': {
    id: 'longest-road',
    name: 'Major Highway',
    description: '+1 point for each segment in your longest road network',
    targetContribution: 8,
    evaluate: (board: Card[]) => {
      const roadNetworks = findRoadNetworks(board);
      if (roadNetworks.length === 0) return 0;
      
      const longestNetwork = roadNetworks.reduce((max, network) => 
        network.size > max.size ? network : max
      );
      return longestNetwork.size;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const roadNetworks = findRoadNetworks(board);
      const relevantTiles: Array<{ x: number; y: number }> = [];
      
      if (roadNetworks.length === 0) {
        return { points: 0, relevantTiles: [], description: 'No road networks found = 0 points' };
      }
      
      const longestNetwork = roadNetworks.reduce((max, network) => 
        network.size > max.size ? network : max
      );
      
      // Collect all tiles from the longest network
      for (const segment of longestNetwork.segments) {
        if (!relevantTiles.some(t => t.x === segment.x && t.y === segment.y)) {
          relevantTiles.push({ x: segment.x, y: segment.y });
        }
      }
      
      return {
        points: longestNetwork.size,
        relevantTiles,
        description: `Longest road network: ${longestNetwork.size} segments = ${longestNetwork.size} points`
      };
    }
  },

  'road-network-count': {
    id: 'road-network-count',
    name: 'Transportation Hub',
    description: '+4 points if you have exactly 2 road networks, +2 points if you have exactly 3',
    targetContribution: 4,
    evaluate: (board: Card[]) => {
      const roadNetworks = findRoadNetworks(board);
      const count = roadNetworks.length;
      
      if (count === 2) return 4;
      if (count === 3) return 2;
      return 0;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const roadNetworks = findRoadNetworks(board);
      const relevantTiles: Array<{ x: number; y: number }> = [];
      const count = roadNetworks.length;
      
      // Collect all road tiles
      for (const network of roadNetworks) {
        for (const segment of network.segments) {
          if (!relevantTiles.some(t => t.x === segment.x && t.y === segment.y)) {
            relevantTiles.push({ x: segment.x, y: segment.y });
          }
        }
      }
      
      let points = 0;
      let description = '';
      if (count === 2) {
        points = 4;
        description = '2 road networks = 4 points';
      } else if (count === 3) {
        points = 2;
        description = '3 road networks = 2 points';
      } else {
        description = `${count} road networks = 0 points (need exactly 2 or 3)`;
      }
      
      return { points, relevantTiles, description };
    }
  },

  // Park-based scoring
  'park-chain': {
    id: 'park-chain',
    name: 'Green Corridor',
    description: '+2 points for each park tile in your largest connected park area',
    targetContribution: 8,
    evaluate: (board: Card[]) => {
      const clusters = findClusters(board);
      const parkClusters = clusters.filter(c => c.type === 'park');
      
      if (parkClusters.length === 0) return 0;
      
      const largestPark = parkClusters.reduce((max, cluster) => 
        cluster.size > max.size ? cluster : max
      );
      return largestPark.size * 2;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const clusters = findClusters(board);
      const parkClusters = clusters.filter(c => c.type === 'park');
      const relevantTiles: Array<{ x: number; y: number }> = [];
      
      if (parkClusters.length === 0) {
        return { points: 0, relevantTiles: [], description: 'No park areas found = 0 points' };
      }
      
      const largestPark = parkClusters.reduce((max, cluster) => 
        cluster.size > max.size ? cluster : max
      );
      
      // Add all tiles from the largest park
      for (const tile of largestPark.tiles) {
        relevantTiles.push({ x: tile.x, y: tile.y });
      }
      
      const points = largestPark.size * 2;
      return {
        points,
        relevantTiles,
        description: `Largest park area: ${largestPark.size} tiles × 2 = ${points} points`
      };
    }
  },

  // Industrial isolation scoring
  'industrial-isolation': {
    id: 'industrial-isolation',
    name: 'Industrial Zone',
    description: '+3 points for each industrial tile not adjacent to residential tiles',
    targetContribution: 9,
    evaluate: (board: Card[]) => {
      const tiles = getAllTiles(board);
      const industrialTiles = tiles.filter(t => t.type === 'industrial');
      const residentialTiles = tiles.filter(t => t.type === 'residential');
      
      let points = 0;
      for (const indTile of industrialTiles) {
        const hasAdjacentResidential = residentialTiles.some(resTile => {
          const dx = Math.abs(indTile.x - resTile.x);
          const dy = Math.abs(indTile.y - resTile.y);
          return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
        });
        if (!hasAdjacentResidential) points += 3;
      }
      return points;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const tiles = getAllTiles(board);
      const industrialTiles = tiles.filter(t => t.type === 'industrial');
      const residentialTiles = tiles.filter(t => t.type === 'residential');
      const relevantTiles: Array<{ x: number; y: number }> = [];
      
      let points = 0;
      for (const indTile of industrialTiles) {
        const adjacentResidential = residentialTiles.filter(resTile => {
          const dx = Math.abs(indTile.x - resTile.x);
          const dy = Math.abs(indTile.y - resTile.y);
          return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
        });
        
        if (adjacentResidential.length === 0) {
          points += 3;
          relevantTiles.push({ x: indTile.x, y: indTile.y });
        }
      }
      
      return {
        points,
        relevantTiles,
        description: `${points/3} isolated industrial tiles = ${points} points`
      };
    }
  },

  // Commercial density scoring
  'commercial-density': {
    id: 'commercial-density',
    name: 'Shopping District',
    description: '+1 point for each commercial tile adjacent to 2+ other commercial tiles',
    targetContribution: 6,
    evaluate: (board: Card[]) => {
      const tiles = getAllTiles(board);
      const commercialTiles = tiles.filter(t => t.type === 'commercial');
      
      let points = 0;
      for (const commTile of commercialTiles) {
        const adjacentCommercial = commercialTiles.filter(otherTile => {
          if (otherTile.x === commTile.x && otherTile.y === commTile.y) return false;
          const dx = Math.abs(commTile.x - otherTile.x);
          const dy = Math.abs(commTile.y - otherTile.y);
          return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
        });
        
        if (adjacentCommercial.length >= 2) points += 1;
      }
      return points;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const tiles = getAllTiles(board);
      const commercialTiles = tiles.filter(t => t.type === 'commercial');
      const relevantTiles: Array<{ x: number; y: number }> = [];
      
      let points = 0;
      for (const commTile of commercialTiles) {
        const adjacentCommercial = commercialTiles.filter(otherTile => {
          if (otherTile.x === commTile.x && otherTile.y === commTile.y) return false;
          const dx = Math.abs(commTile.x - otherTile.x);
          const dy = Math.abs(commTile.y - otherTile.y);
          return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
        });
        
        if (adjacentCommercial.length >= 2) {
          points += 1;
          // Add the commercial tile and its dense neighbors
          relevantTiles.push({ x: commTile.x, y: commTile.y });
          for (const neighbor of adjacentCommercial) {
            if (!relevantTiles.some(t => t.x === neighbor.x && t.y === neighbor.y)) {
              relevantTiles.push({ x: neighbor.x, y: neighbor.y });
            }
          }
        }
      }
      
      return {
        points,
        relevantTiles,
        description: `${points} commercial tiles with 2+ commercial neighbors = ${points} points`
      };
    }
  },

  // Balanced city scoring
  'balanced-city': {
    id: 'balanced-city',
    name: 'Balanced Development',
    description: '+8 points if you have at least 2 tiles of each zone type',
    targetContribution: 8,
    evaluate: (board: Card[]) => {
      const tiles = getAllTiles(board);
      const typeCounts: Record<CellType, number> = {
        residential: 0,
        commercial: 0,
        industrial: 0,
        park: 0
      };
      
      for (const tile of tiles) {
        typeCounts[tile.type]++;
      }
      
      const hasAllTypes = Object.values(typeCounts).every(count => count >= 2);
      return hasAllTypes ? 8 : 0;
    },
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      const tiles = getAllTiles(board);
      const typeCounts: Record<CellType, number> = {
        residential: 0,
        commercial: 0,
        industrial: 0,
        park: 0
      };
      
      // Count tiles by type
      for (const tile of tiles) {
        typeCounts[tile.type]++;
      }
      
      const relevantTiles: Array<{ x: number; y: number }> = [];
      const hasAllTypes = Object.values(typeCounts).every(count => count >= 2);
      
      if (hasAllTypes) {
        // Add all tiles since they all contribute to balance
        relevantTiles.push(...tiles.map(t => ({ x: t.x, y: t.y })));
      }
      
      const points = hasAllTypes ? 8 : 0;
      const counts = Object.entries(typeCounts)
        .map(([type, count]) => `${type}: ${count}`)
        .join(', ');
      
      return {
        points,
        relevantTiles,
        description: hasAllTypes 
          ? `Balanced city (${counts}) = 8 points`
          : `Unbalanced city (${counts}) = 0 points (need 2+ of each type)`
      };
    }
  }
};

// Get a random set of scoring conditions (for game setup)
export function getRandomScoringConditions(count: number = 3): ScoringCondition[] {
  const allConditions = Object.values(SCORING_CONDITIONS);
  const shuffled = [...allConditions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}