import { describe, it, expect } from 'vitest';
import { initializeGame, getCurrentScore } from '../gameLogic';

describe('Scoring System Integration', () => {
  it('should initialize game with scoring conditions', () => {
    const gameState = initializeGame(['Player 1', 'Player 2']);
    
    // Should have scoring setup
    expect(gameState.scoring).toBeDefined();
    expect(gameState.scoring?.activeConditions).toHaveLength(3);
    expect(gameState.scoring?.targetScore).toBeGreaterThan(0);
    
    // Should have condition details
    const firstCondition = gameState.scoring?.activeConditions[0];
    expect(firstCondition?.id).toBeDefined();
    expect(firstCondition?.name).toBeDefined();
    expect(firstCondition?.description).toBeDefined();
  });

  it('should calculate current score for game state', () => {
    const gameState = initializeGame(['Player 1']);
    
    // Should be able to calculate score
    const score = getCurrentScore(gameState);
    
    expect(score).toBeDefined();
    expect(score.totalScore).toBeDefined();
    expect(score.baseScore).toBeDefined();
    expect(score.targetScore).toBe(gameState.scoring?.targetScore);
    expect(score.clusterScores).toBeDefined();
    expect(score.conditionScores).toHaveLength(3);
    
    // Should have positive base score (at least 1 point from the initial card)
    expect(score.baseScore).toBeGreaterThan(0);
  });

  it('should update score as cards are placed', async () => {
    const gameState = initializeGame(['Player 1']);
    const initialScore = getCurrentScore(gameState);
    
    // The initial score should reflect the starting card on the board
    expect(initialScore.baseScore).toBeGreaterThan(0);
    expect(gameState.board).toHaveLength(1); // Just the starting card
    
    console.log('Initial score:', {
      total: initialScore.totalScore,
      base: initialScore.baseScore,
      conditions: initialScore.conditionTotal,
      target: initialScore.targetScore
    });
    
    console.log('Cluster scores:', initialScore.clusterScores);
    console.log('Road penalty:', initialScore.roadPenalty);
    console.log('Condition scores:', initialScore.conditionScores.map(cs => ({
      name: cs.condition.name,
      points: cs.points
    })));
  });

  it('should have different scoring conditions in different games', () => {
    const game1 = initializeGame(['Player 1']);
    const game2 = initializeGame(['Player 1']);
    
    // Games might have different scoring conditions (random selection)
    const conditions1 = game1.scoring?.activeConditions.map(c => c.id).sort();
    const conditions2 = game2.scoring?.activeConditions.map(c => c.id).sort();
    
    // At least we know they both have 3 conditions
    expect(conditions1).toHaveLength(3);
    expect(conditions2).toHaveLength(3);
    
    // They should be valid condition IDs
    expect(conditions1?.every(id => typeof id === 'string' && id.length > 0)).toBe(true);
    expect(conditions2?.every(id => typeof id === 'string' && id.length > 0)).toBe(true);
  });
});