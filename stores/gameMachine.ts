import { setup, assign, fromPromise } from "xstate";
import { Card, GameState } from "../types/game";
import { GameVariation, GAME_VARIATIONS } from "../types/deck";
import {
  initializeGame,
  playCard,
  rotateCard,
  isValidPlacement,
} from "../utils/gameLogic";

// Game machine context
export interface GameMachineContext {
  selectedVariations: GameVariation[];
  selectedExpansions: string[];
  playerCount: number;
  gameState: GameState | null;
  selectedCard: Card | null;
  cardRotation: number;
  placementPos: { x: number; y: number };
  error: string | null;
}

// Game machine events
export type GameMachineEvent =
  | { type: "SET_VARIATIONS"; variations: GameVariation[] }
  | { type: "SET_EXPANSIONS"; expansions: string[] }
  | { type: "SET_PLAYER_COUNT"; count: number }
  | { type: "START_GAME" }
  | { type: "SELECT_CARD"; card: Card }
  | { type: "ROTATE_CARD" }
  | { type: "PLACE_CARD"; x: number; y: number }
  | { type: "CANCEL_PLACEMENT" }
  | { type: "RESTART_GAME" }
  | { type: "EXIT_GAME" }
  | { type: "CLEAR_ERROR" };

export const gameMachine = setup({
  types: {
    context: {} as GameMachineContext,
    events: {} as GameMachineEvent,
  },
  actions: {
    setVariations: assign({
      selectedVariations: ({ event }) =>
        event.type === "SET_VARIATIONS" ? event.variations : [],
    }),
    setExpansions: assign({
      selectedExpansions: ({ event }) =>
        event.type === "SET_EXPANSIONS" ? event.expansions : [],
    }),
    setPlayerCount: assign({
      playerCount: ({ event }) =>
        event.type === "SET_PLAYER_COUNT" ? event.count : 2,
    }),
    setGameState: assign({
      gameState: ({ event }) => {
        if ("output" in event) {
          return event.output as GameState;
        }
        return null;
      },
      error: null,
    }),
    selectCard: assign({
      selectedCard: ({ event }) =>
        event.type === "SELECT_CARD" ? event.card : null,
      cardRotation: 0,
      error: null,
    }),
    rotateSelectedCard: assign({
      cardRotation: ({ context }) => (context.cardRotation === 0 ? 180 : 0),
    }),
    setPlacementPosition: assign({
      placementPos: ({ event }) =>
        event.type === "PLACE_CARD"
          ? { x: event.x, y: event.y }
          : { x: 0, y: 0 },
    }),
    updateGameState: assign({
      gameState: ({ event }) => {
        if ("output" in event) {
          return event.output as GameState;
        }
        return null;
      },
    }),
    clearSelection: assign({
      selectedCard: null,
      cardRotation: 0,
    }),
    resetGame: assign({
      gameState: null,
      selectedCard: null,
      cardRotation: 0,
      placementPos: { x: 0, y: 0 },
      error: null,
    }),
    setError: assign({
      error: ({ event }) => {
        if ("error" in event) {
          return String(event.error);
        }
        return "An error occurred";
      },
    }),
    clearError: assign({
      error: null,
    }),
  },
  guards: {
    hasValidSetup: ({ context }) => {
      const g =
        context.selectedVariations.length > 0 && context.playerCount >= 2;
      console.log("valid setup?", g);
      return g;
    },
    hasSelectedCard: ({ context }) => context.selectedCard !== null,
  },
  actors: {
    initializeGame: fromPromise(
      async ({
        input,
      }: {
        input: {
          playerCount: number;
          selectedVariations: GameVariation[];
          selectedExpansions: string[];
        };
      }) => {
        const playerNames = Array.from(
          { length: input.playerCount },
          (_, i) => `Player ${i + 1}`
        );
        const variationIds = input.selectedVariations.map((v) => v.id);
        return initializeGame(
          playerNames,
          variationIds,
          input.selectedExpansions
        );
      }
    ),
    placeCard: fromPromise(
      async ({
        input,
      }: {
        input: {
          gameState: GameState;
          selectedCard: Card;
          cardRotation: number;
          placementPos: { x: number; y: number };
        };
      }) => {
        const { gameState, selectedCard, cardRotation, placementPos } = input;

        if (!gameState || !selectedCard) {
          throw new Error("Invalid game state for placing card");
        }

        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        const rotatedCard =
          cardRotation > 0
            ? rotateCard(selectedCard, cardRotation)
            : selectedCard;

        // Validate placement
        if (
          !isValidPlacement(
            rotatedCard,
            placementPos.x,
            placementPos.y,
            gameState.board
          )
        ) {
          throw new Error("Invalid card placement");
        }

        const newGameState = playCard(
          gameState,
          currentPlayer.id,
          selectedCard.id,
          placementPos.x,
          placementPos.y,
          cardRotation
        );

        if (!newGameState) {
          throw new Error("Failed to place card");
        }

        return newGameState;
      }
    ),
  },
}).createMachine({
  id: "opolis-game",
  initial: "setup",
  context: {
    selectedVariations: [GAME_VARIATIONS[0]], // Default to first variation
    selectedExpansions: [],
    playerCount: 2,
    gameState: null,
    selectedCard: null,
    cardRotation: 0,
    placementPos: { x: 0, y: 0 },
    error: null,
  },
  states: {
    setup: {
      on: {
        SET_VARIATIONS: {
          actions: "setVariations",
        },
        SET_EXPANSIONS: {
          actions: "setExpansions",
        },
        SET_PLAYER_COUNT: {
          actions: "setPlayerCount",
        },
        START_GAME: {
          target: "initializing",
          guard: "hasValidSetup",
        },
      },
    },
    initializing: {
      invoke: {
        src: "initializeGame",
        input: ({ context }) => ({
          playerCount: context.playerCount,
          selectedVariations: context.selectedVariations,
          selectedExpansions: context.selectedExpansions,
        }),
        onDone: {
          target: "playing.idle",
          actions: "setGameState",
        },
        onError: {
          target: "setup",
          actions: "setError",
        },
      },
    },
    playing: {
      initial: "idle",
      states: {
        idle: {
          on: {
            SELECT_CARD: {
              target: "cardSelected",
              actions: "selectCard",
            },
            EXIT_GAME: {
              target: "#opolis-game.setup",
              actions: "resetGame",
            },
          },
        },
        cardSelected: {
          on: {
            SELECT_CARD: {
              actions: "selectCard",
            },
            ROTATE_CARD: {
              actions: "rotateSelectedCard",
            },
            PLACE_CARD: {
              target: "placing",
              actions: "setPlacementPosition",
              guard: "hasSelectedCard",
            },
            CANCEL_PLACEMENT: {
              target: "idle",
              actions: "clearSelection",
            },
            EXIT_GAME: {
              target: "#opolis-game.setup",
              actions: "resetGame",
            },
          },
        },
        placing: {
          invoke: {
            src: "placeCard",
            input: ({ context }) => ({
              gameState: context.gameState!,
              selectedCard: context.selectedCard!,
              cardRotation: context.cardRotation,
              placementPos: context.placementPos,
            }),
            onDone: {
              target: "idle",
              actions: ["updateGameState", "clearSelection"],
            },
            onError: {
              target: "cardSelected",
              actions: "setError",
            },
          },
        },
      },
      on: {
        RESTART_GAME: {
          target: "setup",
          actions: "resetGame",
        },
      },
    },
    gameOver: {
      on: {
        RESTART_GAME: {
          target: "setup",
          actions: "resetGame",
        },
        EXIT_GAME: {
          target: "setup",
          actions: "resetGame",
        },
      },
    },
  },
  on: {
    CLEAR_ERROR: {
      actions: "clearError",
    },
  },
});
