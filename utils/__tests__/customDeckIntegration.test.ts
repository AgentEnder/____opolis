import { describe, it, expect } from 'vitest';
import { initializeGame } from '../gameLogic';
import { CustomDeck } from '../../types/deck';
import { CustomScoringCondition } from '../../types/scoring-formulas';

describe('Custom Deck Integration', () => {
  const sampleCustomDeck: CustomDeck = {
    id: 'test-deck',
    name: 'Test Deck',
    description: 'A test deck for integration testing',
    type: 'custom',
    isCustom: true,
    baseCards: [
      {
        id: 'test-card-1',
        name: 'Test Card',
        count: 10,
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
        scoringConditionId: 'test-condition-1' // Reference the scoring condition
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
        id: 'test-condition-1',
        name: 'Test Bonus',
        description: 'Gives 5 points for each residential tile',
        formula: 'countTiles("residential") * 5',
        compiledFormula: '',
        targetContribution: 10,
        isCustom: true,
        testCases: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        evaluate: () => 0
      } as CustomScoringCondition
    ],
    metadata: {
      author: 'Test Author',
      created: new Date(),
      modified: new Date(),
      version: '1.0'
    }
  };

  it('should initialize a game with custom deck', () => {
    const gameState = initializeGame(
      ['Player 1', 'Player 2'],
      [sampleCustomDeck],
      []
    );

    expect(gameState).toBeDefined();
    expect(gameState.players).toHaveLength(2);
    expect(gameState.scoring).toBeDefined();
    expect(gameState.scoring?.customConditions).toHaveLength(1);
  });

  it('should handle custom scoring conditions in game setup', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [sampleCustomDeck],
      []
    );

    expect(gameState.scoring?.activeConditions).toBeDefined();
    expect(gameState.scoring?.activeConditions.length).toBeGreaterThan(0);
    expect(gameState.scoring?.targetScore).toBeGreaterThan(0);
  });

  it('should create proper deck cards from custom deck definition', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [sampleCustomDeck],
      []
    );

    // Should have at least one card on the board and some in deck
    expect(gameState.board).toHaveLength(1);
    expect(gameState.deck.length).toBeGreaterThan(0);
    
    // Cards should have proper structure
    const firstCard = gameState.board[0];
    expect(firstCard.cells).toBeDefined();
    expect(firstCard.cells).toHaveLength(2);
    expect(firstCard.cells[0]).toHaveLength(2);
  });
});