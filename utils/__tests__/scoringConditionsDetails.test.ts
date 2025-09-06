import { describe, it, expect } from 'vitest';
import { SCORING_CONDITIONS } from '../scoringConditions';
import { Card } from '../../types/game';

describe('Scoring Conditions Details', () => {
  // Helper to create test card
  const createCard = (id: string, x: number, y: number, cells: Array<Array<{ type: any, roads?: any[] }>>): Card => ({
    id,
    x,
    y,
    rotation: 0,
    cells: cells.map(row => row.map(cell => ({
      type: cell.type,
      roads: cell.roads || []
    })))
  });

  it('should have evaluateWithDetails method for all scoring conditions', () => {
    const conditionIds = Object.keys(SCORING_CONDITIONS);
    
    // Verify all conditions have the evaluateWithDetails method
    for (const conditionId of conditionIds) {
      const condition = SCORING_CONDITIONS[conditionId];
      expect(condition.evaluateWithDetails).toBeDefined();
      expect(typeof condition.evaluateWithDetails).toBe('function');
    }
  });

  it('should return valid ScoringDetail objects from evaluateWithDetails', () => {
    // Create a test board with various types
    const board = [
      createCard('card1', 0, 0, [
        [{ type: 'residential' }, { type: 'commercial' }],
        [{ type: 'park' }, { type: 'industrial', roads: [[0, 1]] }]
      ]),
      createCard('card2', 2, 0, [
        [{ type: 'residential' }, { type: 'residential' }],
        [{ type: 'commercial' }, { type: 'park' }]
      ])
    ];

    const conditionIds = Object.keys(SCORING_CONDITIONS);
    
    for (const conditionId of conditionIds) {
      const condition = SCORING_CONDITIONS[conditionId];
      
      // Call evaluateWithDetails and verify the result structure
      const result = condition.evaluateWithDetails!(board);
      
      expect(result).toBeDefined();
      expect(typeof result.points).toBe('number');
      expect(Array.isArray(result.relevantTiles)).toBe(true);
      expect(typeof result.description).toBe('string');
      
      // Verify relevantTiles have proper structure
      for (const tile of result.relevantTiles) {
        expect(typeof tile.x).toBe('number');
        expect(typeof tile.y).toBe('number');
      }
      
      // Points should match between evaluate and evaluateWithDetails
      const directPoints = condition.evaluate(board);
      expect(result.points).toBe(directPoints);
    }
  });

  it('should handle empty board gracefully', () => {
    const emptyBoard: Card[] = [];
    const conditionIds = Object.keys(SCORING_CONDITIONS);
    
    for (const conditionId of conditionIds) {
      const condition = SCORING_CONDITIONS[conditionId];
      
      // Should not throw error on empty board
      expect(() => condition.evaluateWithDetails!(emptyBoard)).not.toThrow();
      
      const result = condition.evaluateWithDetails!(emptyBoard);
      expect(result.points).toBe(0);
      expect(result.relevantTiles).toEqual([]);
      expect(typeof result.description).toBe('string');
    }
  });

  it('should provide meaningful descriptions for each condition', () => {
    const board = [
      createCard('card1', 0, 0, [
        [{ type: 'residential' }, { type: 'residential' }],
        [{ type: 'park' }, { type: 'commercial' }]
      ])
    ];

    const conditionIds = Object.keys(SCORING_CONDITIONS);
    
    for (const conditionId of conditionIds) {
      const condition = SCORING_CONDITIONS[conditionId];
      const result = condition.evaluateWithDetails!(board);
      
      // Description should be non-empty and contain useful info
      expect(result.description?.length || 0).toBeGreaterThan(0);
      expect(result.description).toContain(result.points.toString());
    }
  });
});