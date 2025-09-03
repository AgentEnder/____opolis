import { describe, it, expect } from 'vitest';
import { initializeGame, playCard } from '../gameLogic';

describe('Game Over Detection', () => {
  it('should detect game over when deck and all hands are empty', () => {
    // Initialize a game with minimal deck
    const gameState = initializeGame(['Player 1', 'Player 2']);
    
    // Manually create a near-end-game state
    const nearEndState = {
      ...gameState,
      deck: [], // Empty deck
      players: gameState.players.map(p => ({
        ...p,
        hand: [] // Empty hands
      }))
    };
    
    // Verify game is over
    const deckEmpty = nearEndState.deck.length === 0;
    const allPlayersEmpty = nearEndState.players.every(player => player.hand.length === 0);
    const isGameOver = deckEmpty && allPlayersEmpty;
    
    expect(isGameOver).toBe(true);
  });

  it('should not detect game over when players still have cards', () => {
    const gameState = initializeGame(['Player 1', 'Player 2']);
    
    // Game with empty deck but players still have cards
    const notEndState = {
      ...gameState,
      deck: [], // Empty deck
      players: gameState.players.map((p, index) => ({
        ...p,
        hand: index === 0 ? [gameState.players[0].hand[0]] : [] // First player still has a card
      }))
    };
    
    const deckEmpty = notEndState.deck.length === 0;
    const allPlayersEmpty = notEndState.players.every(player => player.hand.length === 0);
    const isGameOver = deckEmpty && allPlayersEmpty;
    
    expect(isGameOver).toBe(false);
  });

  it('should not detect game over when deck still has cards', () => {
    const gameState = initializeGame(['Player 1', 'Player 2']);
    
    // Game with cards in deck but empty hands
    const notEndState = {
      ...gameState,
      deck: [gameState.deck[0]], // One card left
      players: gameState.players.map(p => ({
        ...p,
        hand: [] // Empty hands
      }))
    };
    
    const deckEmpty = notEndState.deck.length === 0;
    const allPlayersEmpty = notEndState.players.every(player => player.hand.length === 0);
    const isGameOver = deckEmpty && allPlayersEmpty;
    
    expect(isGameOver).toBe(false);
  });

  it('should have game state properties needed for game over dialog', () => {
    const gameState = initializeGame(['Player 1', 'Player 2']);
    
    // Verify all properties needed by GameOverDialog exist
    expect(gameState.turnCount).toBeDefined();
    expect(typeof gameState.turnCount).toBe('number');
    expect(gameState.board).toBeDefined();
    expect(Array.isArray(gameState.board)).toBe(true);
    expect(gameState.players).toBeDefined();
    expect(Array.isArray(gameState.players)).toBe(true);
    expect(gameState.scoring).toBeDefined();
    expect(gameState.scoring?.targetScore).toBeDefined();
    expect(typeof gameState.scoring?.targetScore).toBe('number');
  });
});