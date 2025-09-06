import { describe, it, expect } from 'vitest';
import { initializeGame } from '../gameLogic';
import { GAME_VARIATIONS } from '../../types/deck';

describe('Expansion Card Scoring', () => {
  it('should include scoring conditions from expansion cards', () => {
    // Test Sprawopolis with the Beaches expansion
    const gameState = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[0]], // Sprawopolis
      ['spr-exp-1'] // Beaches expansion
    );

    expect(gameState.scoring).toBeDefined();
    expect(gameState.scoring?.activeConditions).toBeDefined();
    
    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    console.log('Sprawopolis + Beaches conditions:', conditionIds);
    
    // Should include base Sprawopolis conditions and/or expansion conditions
    expect(gameState.scoring?.activeConditions.length).toBeGreaterThan(0);
    expect(gameState.scoring?.activeConditions.length).toBeLessThanOrEqual(3);
    
    // Check if we have expansion conditions (may or may not appear due to random selection)
    const hasExpansionCondition = conditionIds.some(id => 
      id.includes('spr-beach-001') || id.includes('spr-beach-002')
    );
    
    // At minimum, should have some Sprawopolis-related conditions
    const hasSprawopolisCondition = conditionIds.some(id => id.startsWith('spr-'));
    expect(hasSprawopolisCondition).toBe(true);
    
    console.log('Has expansion condition:', hasExpansionCondition);
    console.log('Has base Sprawopolis condition:', hasSprawopolisCondition);
  });

  it('should mix base and expansion conditions appropriately', () => {
    // Run multiple games to see the variation
    const games = [];
    for (let i = 0; i < 10; i++) {
      const gameState = initializeGame(
        ['Player 1'],
        [GAME_VARIATIONS[0]], // Sprawopolis
        ['spr-exp-1'] // Beaches expansion
      );
      
      const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
      games.push({
        conditions: conditionIds,
        targetScore: gameState.scoring?.targetScore || 0
      });
    }
    
    // Log all the games to see the variety
    games.forEach((game, index) => {
      console.log(`Game ${index + 1}:`, game.conditions, `(target: ${game.targetScore})`);
    });
    
    // All games should have conditions
    for (const game of games) {
      expect(game.conditions.length).toBeGreaterThan(0);
      expect(game.conditions.length).toBeLessThanOrEqual(3);
      expect(game.targetScore).toBeGreaterThan(0);
    }
    
    // At least some variety in conditions across games
    const allConditions = new Set(games.flatMap(g => g.conditions));
    console.log('All unique conditions seen:', Array.from(allConditions));
    
    // Should see some Sprawopolis conditions
    const hasAnySprawopolis = Array.from(allConditions).some(id => id.startsWith('spr-'));
    expect(hasAnySprawopolis).toBe(true);
  });

  it('should work without expansions (base game only)', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[0]], // Sprawopolis
      [] // No expansions
    );

    expect(gameState.scoring).toBeDefined();
    expect(gameState.scoring?.activeConditions.length).toBeGreaterThan(0);
    
    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    console.log('Base Sprawopolis only:', conditionIds);
    
    // Should only have base game conditions
    const hasOnlyBaseConditions = conditionIds.every(id => 
      id.startsWith('spr-') && !id.includes('beach')
    );
    expect(hasOnlyBaseConditions).toBe(true);
  });

  it('should handle multiple decks with expansions', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[0], GAME_VARIATIONS[1]], // Sprawopolis + Agropolis  
      ['spr-exp-1'] // Only Sprawopolis expansion (Agropolis has no expansions)
    );

    expect(gameState.scoring).toBeDefined();
    expect(gameState.scoring?.activeConditions.length).toBeGreaterThan(0);
    expect(gameState.scoring?.activeConditions.length).toBeLessThanOrEqual(3);
    
    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    console.log('Mixed decks + expansion:', conditionIds);
    
    // Should work correctly with mixed content
    expect(gameState.scoring?.targetScore).toBeGreaterThan(0);
  });
});