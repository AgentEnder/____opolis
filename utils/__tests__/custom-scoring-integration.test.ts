import { describe, it, expect, vi } from 'vitest';
import { createScoringContext, createScoringConditionFromCustom, validateCustomScoringCondition } from '../custom-scoring-integration';
import type { Card } from '../../types/game';
import type { CustomScoringCondition } from '../../types/scoring-formulas';

// Mock the scoring sandbox
vi.mock('../scoring-sandbox', () => ({
  executeScoringFormula: vi.fn(() => Promise.resolve({
    score: 10,
    executionTime: 50,
    highlightedTiles: [{ row: 0, col: 0 }],
    details: [{ score: 10, description: 'Test scoring', tiles: [] }]
  }))
}));

describe('Custom Scoring Integration', () => {
  const mockBoard: Card[] = [
    {
      id: 'card1',
      cells: [
        [{ type: 'residential', roads: [] }, { type: 'commercial', roads: [] }],
        [{ type: 'park', roads: [] }, { type: 'industrial', roads: [] }],
      ],
      x: 0,
      y: 0,
      rotation: 0,
    }
  ];

  describe('createScoringContext', () => {
    it('should create a complete scoring context', () => {
      const context = createScoringContext(mockBoard);

      expect(context).toHaveProperty('gameState');
      expect(context).toHaveProperty('getAllTiles');
      expect(context).toHaveProperty('getTileAt');
      expect(context).toHaveProperty('getAdjacentTiles');
      expect(context).toHaveProperty('findClusters');
      expect(context).toHaveProperty('countZonesOfType');
      expect(context).toHaveProperty('sum');
      expect(context).toHaveProperty('max');
      expect(context).toHaveProperty('min');
    });

    it('should provide correct tile information', () => {
      const context = createScoringContext(mockBoard);
      const allTiles = context.getAllTiles();

      expect(allTiles).toHaveLength(4);
      expect(allTiles[0]).toMatchObject({ row: 0, col: 0, type: 'residential' });
      expect(allTiles[1]).toMatchObject({ row: 0, col: 1, type: 'commercial' });
      expect(allTiles[2]).toMatchObject({ row: 1, col: 0, type: 'park' });
      expect(allTiles[3]).toMatchObject({ row: 1, col: 1, type: 'industrial' });
    });

    it('should count zones correctly', () => {
      const context = createScoringContext(mockBoard);

      expect(context.countZonesOfType('residential')).toBe(1);
      expect(context.countZonesOfType('commercial')).toBe(1);
      expect(context.countZonesOfType('park')).toBe(1);
      expect(context.countZonesOfType('industrial')).toBe(1);
      expect(context.countZonesOfType('nonexistent')).toBe(0);
    });

    it('should find adjacent tiles correctly', () => {
      const context = createScoringContext(mockBoard);
      const adjacent = context.getAdjacentTiles(0, 0);

      expect(adjacent).toHaveLength(2); // Right and down from (0,0)
      expect(adjacent).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ row: 0, col: 1, type: 'commercial' }),
          expect.objectContaining({ row: 1, col: 0, type: 'park' })
        ])
      );
    });

    it('should calculate distances correctly', () => {
      const context = createScoringContext(mockBoard);

      expect(context.getDistance({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(1);
      expect(context.getDistance({ row: 0, col: 0 }, { row: 1, col: 1 })).toBeCloseTo(Math.sqrt(2));
    });

    it('should identify adjacent tiles', () => {
      const context = createScoringContext(mockBoard);

      expect(context.isAdjacent({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(true);
      expect(context.isAdjacent({ row: 0, col: 0 }, { row: 1, col: 0 })).toBe(true);
      expect(context.isAdjacent({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(false);
    });

    it('should provide math utilities', () => {
      const context = createScoringContext(mockBoard);

      expect(context.sum([1, 2, 3, 4])).toBe(10);
      expect(context.max([1, 5, 3, 2])).toBe(5);
      expect(context.min([5, 1, 3, 2])).toBe(1);
      expect(context.count([1, 2, 3, 4], x => x > 2)).toBe(2);
    });
  });

  describe('createScoringConditionFromCustom', () => {
    const mockCustomCondition: CustomScoringCondition = {
      id: 'custom_test',
      name: 'Test Custom Condition',
      description: 'A test scoring condition',
      isCustom: true,
      formula: 'function calculateScore() { return 10; }',
      compiledFormula: 'function calculateScore() { return 10; } self.calculateScore = calculateScore;',
      testCases: [],
      targetContribution: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      evaluate: () => 0,
      evaluateWithDetails: () => ({ score: 0, tiles: [], description: '' }),
    };

    it('should create a standard scoring condition', () => {
      const condition = createScoringConditionFromCustom(mockCustomCondition);

      expect(condition.id).toBe('custom_test');
      expect(condition.name).toBe('Test Custom Condition');
      expect(condition.description).toBe('A test scoring condition');
      expect(condition.targetContribution).toBe(10);
      expect(typeof condition.evaluate).toBe('function');
      expect(typeof condition.evaluateWithDetails).toBe('function');
    });
  });

  describe('validateCustomScoringCondition', () => {
    const validCondition: CustomScoringCondition = {
      id: 'valid_condition',
      name: 'Valid Condition',
      description: 'A valid scoring condition',
      isCustom: true,
      formula: 'function calculateScore(context) { return 5; }',
      compiledFormula: 'function calculateScore(context) { return 5; }',
      testCases: [],
      targetContribution: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      evaluate: () => 0,
      evaluateWithDetails: () => ({ score: 0, tiles: [], description: '' }),
    };

    it('should validate a correct condition', () => {
      const result = validateCustomScoringCondition(validCondition);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject condition without ID', () => {
      const invalidCondition = { ...validCondition, id: '' };
      const result = validateCustomScoringCondition(invalidCondition);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Condition must have an ID');
    });

    it('should reject condition without name', () => {
      const invalidCondition = { ...validCondition, name: '' };
      const result = validateCustomScoringCondition(invalidCondition);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Condition must have a name');
    });

    it('should reject condition without formula', () => {
      const invalidCondition = { ...validCondition, formula: '' };
      const result = validateCustomScoringCondition(invalidCondition);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Condition must have a formula');
    });

    it('should reject condition without calculateScore function', () => {
      const invalidCondition = { 
        ...validCondition, 
        formula: 'function otherFunction() { return 5; }' 
      };
      const result = validateCustomScoringCondition(invalidCondition);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Formula must contain a calculateScore function');
    });

    it('should reject condition with invalid target contribution', () => {
      const invalidCondition = { ...validCondition, targetContribution: -5 };
      const result = validateCustomScoringCondition(invalidCondition);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Target contribution must be a non-negative number');
    });
  });
});