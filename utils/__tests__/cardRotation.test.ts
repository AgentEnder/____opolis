import { describe, it, expect } from 'vitest';
import { rotateCard, playCard, initializeGame } from '../gameLogic';
import { Card, CellData } from '../../types/game';
import { SPRAWOPOLIS } from '../../types/deck';

describe('Card Rotation', () => {
  // Create a test card with distinct cells to verify rotation
  const createTestCard = (): Card => ({
    id: 'test-card',
    x: 0,
    y: 0,
    rotation: 0,
    cells: [
      [
        { type: 'residential', roads: [[0, 1]] as any }, // top-left: residential with top-right road
        { type: 'commercial', roads: [] }               // top-right: commercial
      ],
      [
        { type: 'park', roads: [] },                    // bottom-left: park
        { type: 'industrial', roads: [[2, 3]] as any }  // bottom-right: industrial with bottom-left road
      ]
    ]
  });

  it('should rotate card cells 180 degrees', () => {
    const originalCard = createTestCard();
    const rotatedCard = rotateCard(originalCard, 180);

    // After 180° rotation, cells should be flipped both horizontally and vertically
    // Original:     Rotated:
    // [R, C]   =>   [I, P]
    // [P, I]        [C, R]

    expect(rotatedCard.cells[0][0].type).toBe('industrial'); // was bottom-right
    expect(rotatedCard.cells[0][1].type).toBe('park');       // was bottom-left
    expect(rotatedCard.cells[1][0].type).toBe('commercial'); // was top-right
    expect(rotatedCard.cells[1][1].type).toBe('residential'); // was top-left
  });

  it('should rotate road segments 180 degrees', () => {
    const originalCard = createTestCard();
    const rotatedCard = rotateCard(originalCard, 180);

    // Original road [0,1] (top-right) should become [2,3] (bottom-left) after 180° rotation
    // Original road [2,3] (bottom-left) should become [0,1] (top-right) after 180° rotation
    
    // The residential cell (originally top-left, now bottom-right) should have rotated road
    expect(rotatedCard.cells[1][1].roads[0]).toEqual([2, 3]);
    
    // The industrial cell (originally bottom-right, now top-left) should have rotated road
    expect(rotatedCard.cells[0][0].roads[0]).toEqual([0, 1]);
  });

  it('should preserve rotation value', () => {
    const originalCard = createTestCard();
    const rotatedCard = rotateCard(originalCard, 180);

    expect(rotatedCard.rotation).toBe(180);
    expect(originalCard.rotation).toBe(0); // original unchanged
  });

  it('should handle zero rotation', () => {
    const originalCard = createTestCard();
    const notRotatedCard = rotateCard(originalCard, 0);

    expect(notRotatedCard.rotation).toBe(0);
    expect(notRotatedCard.cells).toEqual(originalCard.cells);
  });

  it('should maintain rotation when placing card through playCard', () => {
    // Initialize a game
    const gameState = initializeGame(['Player 1'], [SPRAWOPOLIS]);
    
    // Get the current player
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Add our test card to the player's hand
    const testCard = createTestCard();
    currentPlayer.hand.push(testCard);
    
    // Place adjacent to the first card (which is at 0,0) - try position (2,0) for edge adjacency
    const newGameState = playCard(gameState, currentPlayer.id, testCard.id, 2, 0, 180);
    
    expect(newGameState).not.toBeNull();
    
    // Find the placed card on the board
    const placedCard = newGameState!.board.find(card => card.id === testCard.id);
    
    expect(placedCard).toBeDefined();
    expect(placedCard!.rotation).toBe(180);
    
    // Verify the cells are still rotated
    expect(placedCard!.cells[0][0].type).toBe('industrial'); // should be rotated
    expect(placedCard!.cells[0][1].type).toBe('park');
    expect(placedCard!.cells[1][0].type).toBe('commercial');
    expect(placedCard!.cells[1][1].type).toBe('residential');
  });

  it('should trace the exact flow through playCard function', () => {
    // This test will help us understand what happens step by step
    const gameState = initializeGame(['Player 1'], [SPRAWOPOLIS]);
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    const testCard = createTestCard();
    currentPlayer.hand.push(testCard);
    
    console.log('Original card rotation:', testCard.rotation);
    console.log('Original card cells[0][0]:', testCard.cells[0][0].type);
    
    // Call playCard with rotation=180 - place adjacent to first card
    const newGameState = playCard(gameState, currentPlayer.id, testCard.id, 2, 0, 180);
    
    if (!newGameState) {
      console.log('playCard returned null - placement failed');
      return;
    }
    
    const placedCard = newGameState.board.find(card => card.id === testCard.id);
    
    console.log('Placed card rotation:', placedCard!.rotation);
    console.log('Placed card cells[0][0]:', placedCard!.cells[0][0].type);
    
    // This should show us if the rotation is being lost somewhere in playCard
    expect(placedCard!.rotation).toBe(180);
  });
});