import { useMachine } from "@xstate/react";
import {
  gameMachine,
  GameMachineContext,
  GameMachineEvent,
} from "../stores/gameMachine";
import { GameVariation } from "../types/deck";
import { Card } from "../types/game";

export const useGameMachine = () => {
  const [state, _send] = useMachine(gameMachine);

  const send = (event: GameMachineEvent) => {
    _send(event);
    console.log("GameMachine event sent:", event);
  };

  const actions = {
    // Setup actions
    setVariations: (variations: GameVariation[]) =>
      send({ type: "SET_VARIATIONS", variations }),

    setExpansions: (expansions: string[]) =>
      send({ type: "SET_EXPANSIONS", expansions }),

    setPlayerCount: (count: number) =>
      send({ type: "SET_PLAYER_COUNT", count }),

    startGame: () => send({ type: "START_GAME" }),

    // Game actions
    selectCard: (card: Card) => send({ type: "SELECT_CARD", card }),

    rotateCard: () => send({ type: "ROTATE_CARD" }),

    placeCard: (x: number, y: number) => send({ type: "PLACE_CARD", x, y }),

    cancelPlacement: () => send({ type: "CANCEL_PLACEMENT" }),

    // Game flow actions
    restartGame: () => send({ type: "RESTART_GAME" }),

    exitGame: () => send({ type: "EXIT_GAME" }),

    clearError: () => send({ type: "CLEAR_ERROR" }),
  };

  const selectors = {
    // State checks
    isSetup: state.matches("setup"),
    isInitializing: state.matches("initializing"),
    isPlaying: state.matches("playing"),
    isIdle: state.matches({ playing: "idle" }),
    isCardSelected: state.matches({ playing: "cardSelected" }),
    isPlacing: state.matches({ playing: "placing" }),
    isGameOver: state.matches("gameOver"),

    // Context data
    gameState: state.context.gameState,
    selectedCard: state.context.selectedCard,
    cardRotation: state.context.cardRotation,
    selectedVariations: state.context.selectedVariations,
    selectedExpansions: state.context.selectedExpansions,
    playerCount: state.context.playerCount,
    error: state.context.error,

    // Derived state
    currentPlayer: state.context.gameState
      ? state.context.gameState.players[
          state.context.gameState.currentPlayerIndex
        ]
      : null,

    canStartGame:
      state.context.selectedVariations.length > 0 &&
      state.context.playerCount >= 2,
  };

  console.log("state", state);

  return {
    state,
    send,
    actions,
    selectors,
  };
};
