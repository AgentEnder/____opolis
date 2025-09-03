import type { Card } from '../types/game';
import type { ScoringCondition, ScoringDetail } from '../types/scoring';
import type { CustomScoringCondition, ScoringContext } from '../types/scoring-formulas';
import { getAllTiles, findClusters, findRoadNetworks } from './scoring';
import { executeScoringFormula } from './scoring-sandbox';

// Create a scoring context from the current board state
export function createScoringContext(board: Card[]): ScoringContext {
  const allTiles = getAllTiles(board);
  
  // Create a map for quick card lookup by id
  const cardMap = new Map(board.map(card => [card.id, card]));
  
  return {
    gameState: {
      cards: board,
      currentScore: 0,
      targetScore: 0,
      scoring: { conditions: [], targetScore: 0 },
    },
    
    // Board utilities
    getAllTiles: () => allTiles.map(tile => {
      const card = cardMap.get(tile.cardId);
      return {
        row: tile.y,
        col: tile.x,
        type: tile.type,
        card: card ? {
          ...card,
          customMetadata: card.customMetadata
        } : undefined
      };
    }),
    
    getTileAt: (row: number, col: number) => {
      const tile = allTiles.find(t => t.x === col && t.y === row);
      if (!tile) return null;
      
      const card = cardMap.get(tile.cardId);
      return {
        type: tile.type,
        card: card ? {
          ...card,
          customMetadata: card.customMetadata
        } : undefined
      };
    },
    
    getAdjacentTiles: (row: number, col: number) => {
      const adjacent = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 },
      ];
      
      return adjacent
        .map(pos => {
          const tile = allTiles.find(t => t.x === pos.col && t.y === pos.row);
          if (!tile) return null;
          
          const card = cardMap.get(tile.cardId);
          return {
            row: pos.row,
            col: pos.col,
            type: tile.type,
            card: card ? {
              ...card,
              customMetadata: card.customMetadata
            } : undefined
          };
        })
        .filter((tile): tile is { row: number; col: number; type: string; card?: any } => tile !== null);
    },
    
    // Zone analysis
    findClusters: (zoneType?: string) => {
      const clusters = findClusters(board);
      if (zoneType) {
        return clusters[zoneType] || [];
      } else {
        return Object.values(clusters).flat();
      }
    },
    
    findLargestCluster: (zoneType: string) => {
      const clusters = findClusters(board);
      const typeClusters = clusters[zoneType] || [];
      if (typeClusters.length === 0) return [];
      
      return typeClusters.reduce((largest, current) => 
        current.length > largest.length ? current : largest
      );
    },
    
    countZonesOfType: (zoneType: string) => {
      return allTiles.filter(tile => tile.type === zoneType).length;
    },
    
    // Road utilities
    findRoadNetworks: () => {
      const networks = findRoadNetworks(board);
      return networks.map(network => ({
        segments: network.map(pos => ({ row: pos.y, col: pos.x }))
      }));
    },
    
    hasRoadConnection: (tile1: { row: number; col: number }, tile2: { row: number; col: number }) => {
      // Simplified implementation - check if tiles are adjacent
      const dx = Math.abs(tile1.col - tile2.col);
      const dy = Math.abs(tile1.row - tile2.row);
      return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    },
    
    // Geometric utilities
    getDistance: (tile1: { row: number; col: number }, tile2: { row: number; col: number }) => {
      const dx = tile1.col - tile2.col;
      const dy = tile1.row - tile2.row;
      return Math.sqrt(dx * dx + dy * dy);
    },
    
    isAdjacent: (tile1: { row: number; col: number }, tile2: { row: number; col: number }) => {
      const dx = Math.abs(tile1.col - tile2.col);
      const dy = Math.abs(tile1.row - tile2.row);
      return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    },
    
    getTilesInRadius: (center: { row: number; col: number }, radius: number) => {
      return allTiles
        .filter(tile => {
          const dx = tile.x - center.col;
          const dy = tile.y - center.row;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance <= radius;
        })
        .map(tile => {
          const card = cardMap.get(tile.cardId);
          return {
            row: tile.y,
            col: tile.x,
            type: tile.type,
            card: card ? {
              ...card,
              customMetadata: card.customMetadata
            } : undefined
          };
        });
    },
    
    // Scoring helpers
    sum: (numbers: number[]) => numbers.reduce((a, b) => a + b, 0),
    max: (numbers: number[]) => Math.max(...numbers),
    min: (numbers: number[]) => Math.min(...numbers),
    count: <T>(items: T[], predicate: (item: T) => boolean) => items.filter(predicate).length,
  };
}

// Convert a custom scoring condition to a standard scoring condition
export function createScoringConditionFromCustom(custom: CustomScoringCondition): ScoringCondition {
  return {
    id: custom.id,
    name: custom.name,
    description: custom.description,
    targetContribution: custom.targetContribution,
    
    evaluate: (board: Card[]) => {
      try {
        // Create scoring context
        const context = createScoringContext(board);
        
        // Execute the compiled formula in sandbox
        return executeScoringFormula(custom.compiledFormula, context.gameState)
          .then(result => result.score)
          .catch(() => 0);
      } catch (error) {
        console.error('Error executing custom scoring condition:', error);
        return 0;
      }
    },
    
    evaluateWithDetails: (board: Card[]): ScoringDetail => {
      try {
        // Create scoring context
        const context = createScoringContext(board);
        
        // Execute the compiled formula in sandbox
        return executeScoringFormula(custom.compiledFormula, context.gameState)
          .then(result => ({
            points: result.score,
            relevantTiles: result.highlightedTiles?.map(tile => ({ x: tile.col, y: tile.row })) || [],
            description: result.details?.map(d => d.description).join(', ') || `${custom.name}: ${result.score} points`,
          }))
          .catch(error => ({
            points: 0,
            relevantTiles: [],
            description: `Error: ${error.message}`,
          }));
      } catch (error) {
        return {
          points: 0,
          relevantTiles: [],
          description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
      }
    },
  };
}

// Validate that a custom scoring condition is properly formed
export function validateCustomScoringCondition(condition: CustomScoringCondition): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!condition.id || condition.id.trim().length === 0) {
    errors.push('Condition must have an ID');
  }
  
  if (!condition.name || condition.name.trim().length === 0) {
    errors.push('Condition must have a name');
  }
  
  if (!condition.formula || condition.formula.trim().length === 0) {
    errors.push('Condition must have a formula');
  }
  
  if (!condition.compiledFormula || condition.compiledFormula.trim().length === 0) {
    errors.push('Condition must have compiled JavaScript');
  }
  
  if (!condition.formula.includes('calculateScore')) {
    errors.push('Formula must contain a calculateScore function');
  }
  
  if (typeof condition.targetContribution !== 'number' || condition.targetContribution < 0) {
    errors.push('Target contribution must be a non-negative number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}