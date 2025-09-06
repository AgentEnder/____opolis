import { describe, it, expect } from 'vitest';
import { initializeGame } from '../gameLogic';
import { CustomDeck } from '../../types/deck';
import { CustomScoringCondition } from '../../types/scoring-formulas';

describe('Card-Based Scoring Selection', () => {
  // Create a custom deck with both global and card-based scoring conditions
  const customDeckWithMixedConditions: CustomDeck = {
    id: 'mixed-conditions-deck',
    name: 'Mixed Conditions Deck',
    description: 'A deck with global and card-based conditions',
    type: 'custom',
    isCustom: true,
    baseCards: [
      {
        id: 'card-with-condition',
        name: 'Card With Condition',
        count: 5,
        cells: [
          [
            { type: 'residential', roads: [] },
            { type: 'commercial', roads: [] }
          ],
          [
            { type: 'industrial', roads: [] },
            { type: 'park', roads: [] }
          ]
        ],
        scoringConditionId: 'card-based-bonus' // References a specific condition
      },
      {
        id: 'card-without-condition',
        name: 'Card Without Condition',
        count: 3,
        cells: [
          [
            { type: 'residential', roads: [] },
            { type: 'residential', roads: [] }
          ],
          [
            { type: 'park', roads: [] },
            { type: 'park', roads: [] }
          ]
        ]
        // No scoringConditionId - should not trigger any conditions
      }
    ],
    expansions: [],
    zoneTypes: [
      { id: 'residential', name: 'Residential', color: '#60a5fa', description: 'Housing areas' },
      { id: 'commercial', name: 'Commercial', color: '#f59e0b', description: 'Business districts' },
      { id: 'industrial', name: 'Industrial', color: '#6b7280', description: 'Manufacturing zones' },
      { id: 'park', name: 'Park', color: '#34d399', description: 'Green spaces' }
    ],
    theme: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#7c3aed'
    },
    customScoringConditions: [
      {
        id: 'global-bonus',
        name: 'Global Bonus',
        description: 'Always active bonus condition',
        formula: '5', // Always gives 5 points
        compiledFormula: '',
        targetContribution: 5,
        isCustom: true,
        isGlobal: true, // This should always be included
        testCases: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        evaluate: () => 5
      } as CustomScoringCondition,
      {
        id: 'card-based-bonus',
        name: 'Card-Based Bonus',
        description: 'Only active when referenced by cards',
        formula: 'countTiles("residential") * 2',
        compiledFormula: '',
        targetContribution: 8,
        isCustom: true,
        isGlobal: false, // This should only be included if referenced by a card
        testCases: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        evaluate: () => 0
      } as CustomScoringCondition,
      {
        id: 'unused-condition',
        name: 'Unused Condition',
        description: 'Not referenced by any card',
        formula: '10',
        compiledFormula: '',
        targetContribution: 10,
        isCustom: true,
        isGlobal: false, // This should NOT be included since no cards reference it
        testCases: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        evaluate: () => 10
      } as CustomScoringCondition
    ],
    metadata: {
      author: 'Test Author',
      created: new Date(),
      modified: new Date(),
      version: '1.0'
    }
  };

  it('should include global conditions regardless of card references', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [customDeckWithMixedConditions],
      []
    );

    expect(gameState.scoring).toBeDefined();
    expect(gameState.scoring?.activeConditions).toBeDefined();
    
    // Should include the global condition
    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    expect(conditionIds).toContain('global-bonus');
  });

  it('should include card-based conditions only when referenced by cards', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [customDeckWithMixedConditions],
      []
    );

    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    
    // Should include card-based-bonus because it's referenced by a card
    expect(conditionIds).toContain('card-based-bonus');
    
    // Should NOT include unused-condition because no cards reference it
    expect(conditionIds).not.toContain('unused-condition');
  });

  it('should not include any conditions when no cards have scoring references', () => {
    const deckWithoutCardReferences: CustomDeck = {
      ...customDeckWithMixedConditions,
      baseCards: [
        {
          id: 'plain-card',
          name: 'Plain Card',
          count: 5,
          cells: [
            [
              { type: 'residential', roads: [] },
              { type: 'commercial', roads: [] }
            ],
            [
              { type: 'industrial', roads: [] },
              { type: 'park', roads: [] }
            ]
          ]
          // No scoringConditionId
        }
      ],
      customScoringConditions: [
        {
          id: 'non-global-condition',
          name: 'Non-Global Condition',
          description: 'Should not be included without card reference',
          formula: '5',
          compiledFormula: '',
          targetContribution: 5,
          isCustom: true,
          isGlobal: false, // Not global, so needs card reference
          testCases: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          evaluate: () => 5
        } as CustomScoringCondition
      ]
    };

    const gameState = initializeGame(
      ['Player 1'],
      [deckWithoutCardReferences],
      []
    );

    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    
    // Should not include the non-global condition since no cards reference it
    expect(conditionIds).not.toContain('non-global-condition');
    expect(gameState.scoring?.activeConditions.length).toBe(0);
  });

  it('should include both global conditions and card-based conditions', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [customDeckWithMixedConditions],
      []
    );

    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    
    // Should have exactly 2 conditions: 1 global + 1 card-based
    expect(gameState.scoring?.activeConditions.length).toBe(2);
    expect(conditionIds).toContain('global-bonus');
    expect(conditionIds).toContain('card-based-bonus');
  });

  it('should calculate target score correctly from active conditions only', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [customDeckWithMixedConditions],
      []
    );

    // Target score should be 5 (global) + 8 (card-based) = 13
    // Should NOT include the 10 from unused-condition
    expect(gameState.scoring?.targetScore).toBe(13);
  });
});