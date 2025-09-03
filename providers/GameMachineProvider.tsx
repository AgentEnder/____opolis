import { createActorContext } from '@xstate/react';
import { gameMachine } from '../stores/gameMachine';
import { GameVariation } from '../types/deck';
import { Card } from '../types/game';

// Create the actor context using XState's createActorContext
export const GameMachineContext = createActorContext(gameMachine);

// Custom hook that provides a convenient API
export const useSharedGameMachine = () => {
  const actorRef = GameMachineContext.useActorRef();
  const snapshot = GameMachineContext.useSelector((state) => state);
  
  const selectors = {
    // State selectors
    isSetup: snapshot.matches('setup'),
    isInitializing: snapshot.matches('initializing'),
    isPlaying: snapshot.matches('playing'),
    isIdle: snapshot.matches({ playing: 'idle' }),
    isCardSelected: snapshot.matches({ playing: 'cardSelected' }),
    isPlacing: snapshot.matches({ playing: 'placing' }),
    isGameOver: snapshot.matches('gameOver'),
    
    // Context selectors
    selectedVariations: snapshot.context.selectedVariations,
    selectedExpansions: snapshot.context.selectedExpansions,
    playerCount: snapshot.context.playerCount,
    gameState: snapshot.context.gameState,
    selectedCard: snapshot.context.selectedCard,
    cardRotation: snapshot.context.cardRotation,
    placementPos: snapshot.context.placementPos,
    error: snapshot.context.error,
    
    // Computed selectors
    canStartGame: snapshot.context.selectedVariations.length > 0 && snapshot.context.playerCount >= 2,
    currentPlayer: snapshot.context.gameState ? 
      snapshot.context.gameState.players[snapshot.context.gameState.currentPlayerIndex] : 
      null,
  };

  const actions = {
    setVariations: (variations: (GameVariation | any)[]) => 
      actorRef.send({ type: 'SET_VARIATIONS', variations }),
    setExpansions: (expansions: string[]) => 
      actorRef.send({ type: 'SET_EXPANSIONS', expansions }),
    setPlayerCount: (count: number) => 
      actorRef.send({ type: 'SET_PLAYER_COUNT', count }),
    startGame: () => 
      actorRef.send({ type: 'START_GAME' }),
    selectCard: (card: Card) => 
      actorRef.send({ type: 'SELECT_CARD', card }),
    rotateCard: () => 
      actorRef.send({ type: 'ROTATE_CARD' }),
    placeCard: (x: number, y: number) => 
      actorRef.send({ type: 'PLACE_CARD', x, y }),
    cancelPlacement: () => 
      actorRef.send({ type: 'CANCEL_PLACEMENT' }),
    restartGame: () => 
      actorRef.send({ type: 'RESTART_GAME' }),
    exitGame: () => 
      actorRef.send({ type: 'EXIT_GAME' }),
    clearError: () => 
      actorRef.send({ type: 'CLEAR_ERROR' }),
  };

  return {
    selectors,
    actions,
    state: snapshot, // For compatibility with DebugInfo component
  };
};

// Export the context type for typing purposes
export type GameMachineContextValue = ReturnType<typeof useSharedGameMachine>;

// Export the provider component
export const GameMachineProvider = GameMachineContext.Provider;