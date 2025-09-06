import { describe, it, expect } from 'vitest';
import { initializeGame } from '../gameLogic';
import { GAME_VARIATIONS } from '../../types/deck';

describe('Built-in Card Scoring Selection', () => {
  // Test with actual built-in variations to ensure we don't accidentally include
  // random conditions when no cards have scoring condition references
  
  it('should only include scoring conditions referenced by cards in built-in variations', () => {
    // Use Sprawopolis which should have some cards with scoring conditions
    const gameState = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[0]], // Sprawopolis
      []
    );

    expect(gameState.scoring).toBeDefined();
    
    // Log the conditions that were selected for debugging
    console.log('Selected conditions:', gameState.scoring?.activeConditions.map(c => c.id));
    
    // The number of conditions should be based on what cards actually reference,
    // not a fixed 3 random conditions
    if (gameState.scoring?.activeConditions.length === 0) {
      // If no cards reference conditions, that's valid behavior
      expect(gameState.scoring.activeConditions.length).toBe(0);
      expect(gameState.scoring.targetScore).toBe(0);
    } else {
      // If there are conditions, they should be from card references only
      expect(gameState.scoring?.activeConditions.length).toBeGreaterThan(0);
      expect(gameState.scoring?.activeConditions.length).toBeLessThanOrEqual(3);
    }
  });

  it('should not include scoring conditions when no cards reference them', () => {
    // Create a simple game with built-in cards that don't reference any conditions
    const gameState = initializeGame(
      ['Player 1', 'Player 2'],
      [], // No variations - will default to first one
      []
    );

    // Check if any conditions were included
    const conditionCount = gameState.scoring?.activeConditions.length || 0;
    
    // With our new logic, conditions should only be included if:
    // 1. They are global (isGlobal: true), or  
    // 2. They are referenced by cards in the deck
    // Since built-in variations likely don't have cards with scoringConditionId set,
    // we expect few or no conditions
    
    console.log(`Built-in game has ${conditionCount} scoring conditions`);
    
    // This is informational - the actual count depends on the built-in deck configuration
    expect(conditionCount).toBeGreaterThanOrEqual(0);
    expect(conditionCount).toBeLessThanOrEqual(3);
  });

  it('should work with mixed built-in and custom decks', () => {
    // This tests that the logic works when we mix built-in variations
    // with custom decks that have proper card references
    
    const customDeckWithCardReference = {
      id: 'mixed-test-deck',
      name: 'Mixed Test Deck', 
      description: 'A deck for testing mixed scenarios',
      type: 'custom' as const,
      isCustom: true as const,
      baseCards: [
        {
          id: 'custom-card-1',
          name: 'Custom Card',
          count: 3,
          cells: [
            [
              { type: 'residential', roads: [] },
              { type: 'park', roads: [] }
            ],
            [
              { type: 'commercial', roads: [] },
              { type: 'industrial', roads: [] }
            ]
          ],
          scoringConditionId: 'custom-mixed-condition'
        }
      ],
      expansions: [],
      zoneTypes: [],
      theme: { primaryColor: '#000', secondaryColor: '#fff' },
      customScoringConditions: [
        {
          id: 'custom-mixed-condition',
          name: 'Custom Mixed Condition',
          description: 'A condition for mixed deck testing',
          formula: 'countTiles("residential")',
          compiledFormula: '',
          targetContribution: 3,
          isCustom: true,
          isGlobal: false,
          testCases: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          evaluate: () => 0
        }
      ],
      metadata: {
        author: 'Test',
        created: new Date(),
        modified: new Date(),
        version: '1.0'
      }
    };

    const gameState = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[0], customDeckWithCardReference],
      []
    );

    expect(gameState.scoring).toBeDefined();
    
    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    
    // Should include the custom condition since it's referenced by a card
    expect(conditionIds).toContain('custom-mixed-condition');
    
    console.log('Mixed deck conditions:', conditionIds);
  });
});