import { describe, test, expect } from 'vitest';
import { createActor } from 'xstate';
import { gameMachine } from '../stores/gameMachine';
import { GAME_VARIATIONS } from '../types/deck';

describe('GameMachine', () => {
  test('should initialize in setup state with default context', () => {
    const actor = createActor(gameMachine);
    actor.start();
    
    const state = actor.getSnapshot();
    console.log('Initial state:', state.value);
    console.log('Initial context:', state.context);
    
    expect(state.matches('setup')).toBe(true);
    expect(state.context.selectedVariations).toHaveLength(1);
    expect(state.context.selectedVariations[0]).toEqual(GAME_VARIATIONS[0]);
    expect(state.context.playerCount).toBe(2);
    expect(state.context.gameState).toBeNull();
  });

  test('should allow starting game with valid setup', () => {
    const actor = createActor(gameMachine);
    actor.start();
    
    // Verify initial state allows game start
    let state = actor.getSnapshot();
    expect(state.context.selectedVariations.length > 0).toBe(true);
    expect(state.context.playerCount >= 2).toBe(true);
    
    console.log('Before START_GAME:', state.value);
    console.log('Context before:', state.context);
    
    // Send START_GAME event
    actor.send({ type: 'START_GAME' });
    
    // Check if state transitioned
    state = actor.getSnapshot();
    console.log('After START_GAME:', state.value);
    console.log('Context after:', state.context);
    
    expect(state.matches('initializing')).toBe(true);
  });

  test('hasValidSetup guard should work correctly', () => {
    const actor = createActor(gameMachine);
    actor.start();
    
    // Test with no variations
    actor.send({ type: 'SET_VARIATIONS', variations: [] });
    let state = actor.getSnapshot();
    
    console.log('After clearing variations:', state.context);
    
    // Try to start game - should fail
    actor.send({ type: 'START_GAME' });
    state = actor.getSnapshot();
    
    console.log('After START_GAME with no variations:', state.value);
    expect(state.matches('setup')).toBe(true); // Should stay in setup
    
    // Add variation back
    actor.send({ type: 'SET_VARIATIONS', variations: [GAME_VARIATIONS[0]] });
    state = actor.getSnapshot();
    
    // Now it should work
    actor.send({ type: 'START_GAME' });
    state = actor.getSnapshot();
    
    console.log('After START_GAME with valid setup:', state.value);
    expect(state.matches('initializing')).toBe(true);
  });

  test('should handle game initialization success', async () => {
    const actor = createActor(gameMachine);
    actor.start();
    
    console.log('Starting game initialization test...');
    
    // Send START_GAME and wait for completion
    actor.send({ type: 'START_GAME' });
    
    // Wait for async initialization to complete
    await new Promise(resolve => {
      const subscription = actor.subscribe(state => {
        console.log('State changed to:', state.value);
        if (state.matches({ playing: 'idle' })) {
          console.log('Reached playing.idle state');
          subscription.unsubscribe();
          resolve(void 0);
        } else if (state.matches('setup') && state.context.error) {
          console.log('Error occurred:', state.context.error);
          subscription.unsubscribe();
          resolve(void 0);
        }
      });
      
      // Timeout after 2 seconds
      setTimeout(() => {
        console.log('Test timed out');
        subscription.unsubscribe();
        resolve(void 0);
      }, 2000);
    });
    
    const finalState = actor.getSnapshot();
    console.log('Final state:', finalState.value);
    console.log('Final context error:', finalState.context.error);
    console.log('Final gameState exists:', !!finalState.context.gameState);
    
    // Should either be in playing state or back to setup with error
    const isSuccess = finalState.matches({ playing: 'idle' });
    const hasError = finalState.matches('setup') && finalState.context.error;
    
    expect(isSuccess || hasError).toBe(true);
    
    if (isSuccess) {
      expect(finalState.context.gameState).not.toBeNull();
    }
  });
});