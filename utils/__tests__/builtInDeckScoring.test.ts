import { describe, it, expect } from 'vitest';
import { initializeGame } from '../gameLogic';
import { GAME_VARIATIONS } from '../../types/deck';

describe('Built-in Deck Scoring Updates', () => {
  it('should include scoring conditions from Sprawopolis cards', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[0]], // Sprawopolis
      []
    );

    expect(gameState.scoring).toBeDefined();
    expect(gameState.scoring?.activeConditions).toBeDefined();
    
    // Should now have scoring conditions since cards reference them
    expect(gameState.scoring?.activeConditions.length).toBeGreaterThan(0);
    expect(gameState.scoring?.activeConditions.length).toBeLessThanOrEqual(3);
    
    // Log the conditions for verification
    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    console.log('Sprawopolis conditions:', conditionIds);
    
    // Should include Sprawopolis-specific conditions
    const hasSprawopolisCondition = conditionIds.some(id => id.startsWith('spr-'));
    expect(hasSprawopolisCondition).toBe(true);
    
    // Target score should be > 0 since we have active conditions
    expect(gameState.scoring?.targetScore).toBeGreaterThan(0);
  });

  it('should include scoring conditions from Agropolis cards', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[1]], // Agropolis
      []
    );

    expect(gameState.scoring).toBeDefined();
    expect(gameState.scoring?.activeConditions).toBeDefined();
    
    // Should now have scoring conditions since cards reference them
    expect(gameState.scoring?.activeConditions.length).toBeGreaterThan(0);
    expect(gameState.scoring?.activeConditions.length).toBeLessThanOrEqual(3);
    
    // Log the conditions for verification
    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    console.log('Agropolis conditions:', conditionIds);
    
    // Should include Agropolis-specific conditions
    const hasAgropolisCondition = conditionIds.some(id => id.startsWith('agr-'));
    expect(hasAgropolisCondition).toBe(true);
    
    // Target score should be > 0 since we have active conditions
    expect(gameState.scoring?.targetScore).toBeGreaterThan(0);
  });

  it('should have different scoring conditions for different built-in decks', () => {
    const sprawopolisGame = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[0]], // Sprawopolis
      []
    );
    
    const agropolisGame = initializeGame(
      ['Player 1'], 
      [GAME_VARIATIONS[1]], // Agropolis
      []
    );

    const sprawopolisConditions = sprawopolisGame.scoring?.activeConditions.map(c => c.id) || [];
    const agropolisConditions = agropolisGame.scoring?.activeConditions.map(c => c.id) || [];
    
    console.log('Sprawopolis vs Agropolis conditions:');
    console.log('Sprawopolis:', sprawopolisConditions);
    console.log('Agropolis:', agropolisConditions);
    
    // Should have different conditions
    const hasDifferentConditions = !sprawopolisConditions.every(id => 
      agropolisConditions.includes(id)
    );
    expect(hasDifferentConditions).toBe(true);
    
    // Each should have their theme-specific conditions
    expect(sprawopolisConditions.some(id => id.startsWith('spr-'))).toBe(true);
    expect(agropolisConditions.some(id => id.startsWith('agr-'))).toBe(true);
  });

  it('should limit to 3 card-based scoring conditions maximum', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[0]], // Sprawopolis (has 8 different card types)
      []
    );

    expect(gameState.scoring).toBeDefined();
    
    // Should limit to 3 conditions even though Sprawopolis has 8 card types
    expect(gameState.scoring?.activeConditions.length).toBeLessThanOrEqual(3);
    
    // All conditions should be valid Sprawopolis conditions
    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    const validSprIds = [
      'spr-001-residential-block',
      'spr-002-suburb', 
      'spr-003-shopping-district',
      'spr-004-main-street',
      'spr-005-factory-district',
      'spr-006-warehouse',
      'spr-007-mixed-use',
      'spr-008-intersection'
    ];
    
    for (const conditionId of conditionIds) {
      expect(validSprIds.includes(conditionId)).toBe(true);
    }
  });

  it('should calculate meaningful target scores', () => {
    const sprawopolisGame = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[0]], // Sprawopolis
      []
    );
    
    const agropolisGame = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[1]], // Agropolis
      []
    );

    // Both should have meaningful target scores
    expect(sprawopolisGame.scoring?.targetScore).toBeGreaterThan(5);
    expect(sprawopolisGame.scoring?.targetScore).toBeLessThan(50);
    
    expect(agropolisGame.scoring?.targetScore).toBeGreaterThan(5);
    expect(agropolisGame.scoring?.targetScore).toBeLessThan(50);
    
    console.log('Target scores:');
    console.log('Sprawopolis:', sprawopolisGame.scoring?.targetScore);
    console.log('Agropolis:', agropolisGame.scoring?.targetScore);
  });

  it('should work with mixed built-in decks', () => {
    const gameState = initializeGame(
      ['Player 1'],
      [GAME_VARIATIONS[0], GAME_VARIATIONS[1]], // Both Sprawopolis and Agropolis
      []
    );

    expect(gameState.scoring).toBeDefined();
    expect(gameState.scoring?.activeConditions.length).toBeGreaterThan(0);
    expect(gameState.scoring?.activeConditions.length).toBeLessThanOrEqual(3);
    
    const conditionIds = gameState.scoring?.activeConditions.map(c => c.id) || [];
    console.log('Mixed built-in conditions:', conditionIds);
    
    // Should include conditions from both decks (up to 3 total)
    const hasSprCondition = conditionIds.some(id => id.startsWith('spr-'));
    const hasAgrCondition = conditionIds.some(id => id.startsWith('agr-'));
    
    // At least one deck's conditions should be represented
    expect(hasSprCondition || hasAgrCondition).toBe(true);
    
    // Target score should be reasonable
    expect(gameState.scoring?.targetScore).toBeGreaterThan(0);
  });
});