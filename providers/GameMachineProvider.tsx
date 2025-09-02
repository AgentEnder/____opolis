import React, { createContext, useContext } from 'react';
import { useMachine } from '@xstate/react';
import { gameMachine, GameMachineEvent } from '../stores/gameMachine';
import { GameVariation } from '../types/deck';
import { Card } from '../types/game';

// Create context for sharing the machine instance
interface GameMachineContextValue {
  state: any;
  send: (event: GameMachineEvent) => void;
  actions: {
    setVariations: (variations: GameVariation[]) => void;
    setExpansions: (expansions: string[]) => void;
    setPlayerCount: (count: number) => void;
    startGame: () => void;
    selectCard: (card: Card) => void;
    rotateCard: () => void;
    placeCard: (x: number, y: number) => void;
    cancelPlacement: () => void;
    restartGame: () => void;
    exitGame: () => void;
    clearError: () => void;
  };
  selectors: {
    isSetup: boolean;
    isInitializing: boolean;
    isPlaying: boolean;
    isIdle: boolean;
    isCardSelected: boolean;
    isPlacing: boolean;
    isGameOver: boolean;
    gameState: any;
    selectedCard: any;
    cardRotation: number;
    selectedVariations: GameVariation[];
    selectedExpansions: string[];
    playerCount: number;
    error: string | null;
    currentPlayer: any;
    canStartGame: boolean;
  };
}

const GameMachineContext = createContext<GameMachineContextValue | undefined>(undefined);

export function GameMachineProvider({ children }: { children: React.ReactNode }) {
  const [state, _send] = useMachine(gameMachine);

  console.log('GameMachineProvider render - state:', state.value);

  const send = (event: GameMachineEvent) => {
    console.log('GameMachineProvider - sending event:', event);
    _send(event);
  };

  const actions = {
    setVariations: (variations: GameVariation[]) =>
      send({ type: 'SET_VARIATIONS', variations }),
    setExpansions: (expansions: string[]) =>
      send({ type: 'SET_EXPANSIONS', expansions }),
    setPlayerCount: (count: number) =>
      send({ type: 'SET_PLAYER_COUNT', count }),
    startGame: () => send({ type: 'START_GAME' }),
    selectCard: (card: Card) => send({ type: 'SELECT_CARD', card }),
    rotateCard: () => send({ type: 'ROTATE_CARD' }),
    placeCard: (x: number, y: number) => send({ type: 'PLACE_CARD', x, y }),
    cancelPlacement: () => send({ type: 'CANCEL_PLACEMENT' }),
    restartGame: () => send({ type: 'RESTART_GAME' }),
    exitGame: () => send({ type: 'EXIT_GAME' }),
    clearError: () => send({ type: 'CLEAR_ERROR' }),
  };

  const selectors = {
    isSetup: state.matches('setup'),
    isInitializing: state.matches('initializing'),
    isPlaying: state.matches('playing'),
    isIdle: state.matches({ playing: 'idle' }),
    isCardSelected: state.matches({ playing: 'cardSelected' }),
    isPlacing: state.matches({ playing: 'placing' }),
    isGameOver: state.matches('gameOver'),
    gameState: state.context.gameState,
    selectedCard: state.context.selectedCard,
    cardRotation: state.context.cardRotation,
    selectedVariations: state.context.selectedVariations,
    selectedExpansions: state.context.selectedExpansions,
    playerCount: state.context.playerCount,
    error: state.context.error,
    currentPlayer: state.context.gameState
      ? state.context.gameState.players[state.context.gameState.currentPlayerIndex]
      : null,
    canStartGame: state.context.selectedVariations.length > 0 && state.context.playerCount >= 2,
  };

  return (
    <GameMachineContext.Provider value={{ state, send, actions, selectors }}>
      {children}
    </GameMachineContext.Provider>
  );
}

export function useSharedGameMachine() {
  const context = useContext(GameMachineContext);
  if (context === undefined) {
    throw new Error('useSharedGameMachine must be used within a GameMachineProvider');
  }
  return context;
}