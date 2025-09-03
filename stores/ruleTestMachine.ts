import { assign, fromPromise, createActor, setup } from "xstate";
import { Card, GameState } from "../types/game";
import { CustomDeck, CardDefinition } from "../types/deck";
import { CustomScoringCondition } from "../types/scoring-formulas";
import { BoardPreset, RuleTestResults } from "../types/ruleTesting";
import { 
  GameMachineContext,
  GameMachineEvent
} from "./gameMachine";
import { RuleTester } from "../utils/ruleTesting";

// Extended context for rule testing - inherits from game machine
export interface RuleTestMachineContext extends GameMachineContext {
  // Rule testing specific properties
  currentDeck: CustomDeck | null;
  currentRule: CustomScoringCondition | null;
  selectedCardDef: CardDefinition | null;
  scoringResults: RuleTestResults | null;
  isLoading: boolean;
  debugMode: boolean;
}

// Extended events for rule testing - includes game machine events
export type RuleTestMachineEvent = 
  | GameMachineEvent
  | { type: "LOAD_DECK"; deck: CustomDeck }
  | { type: "LOAD_RULE"; rule: CustomScoringCondition | null }
  | { type: "SELECT_CARD_DEF"; cardDef: CardDefinition }
  | { type: "REMOVE_CARD"; x: number; y: number }
  | { type: "RESET_BOARD" }
  | { type: "LOAD_PRESET"; preset: BoardPreset }
  | { type: "GENERATE_FULL_DECK" }
  | { type: "RUN_TEST" }
  | { type: "CLEAR_SELECTION" }
  | { type: "SET_DEBUG_MODE"; debugMode: boolean };

const ruleTester = RuleTester.getInstance();

// Create rule testing machine using setup approach for proper typing
export const ruleTestMachine = setup({
  types: {
    context: {} as RuleTestMachineContext,
    events: {} as RuleTestMachineEvent,
  },
  actions: {
    // Import all game machine actions and extend with rule testing actions
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
    checkGameOver: ({ context, self }) => {
      if (!context.gameState) return;
      
      const deckEmpty = context.gameState.deck.length === 0;
      const allPlayersEmpty = context.gameState.players.every(player => player.hand.length === 0);
      
      if (deckEmpty && allPlayersEmpty) {
        self.send({ type: 'GAME_OVER_DETECTED' } as any);
      }
    },

    // Rule testing specific actions
    loadDeck: assign({
      currentDeck: ({ event }) =>
        event.type === "LOAD_DECK" ? event.deck : null,
      selectedVariations: ({ event }) =>
        event.type === "LOAD_DECK" ? [event.deck] : [],
      gameState: ({ event }) => {
        if (event.type === "LOAD_DECK") {
          return {
            players: [
              {
                id: 'test-player',
                name: 'Test Player',
                hand: [],
                isActive: true,
              }
            ],
            currentPlayerIndex: 0,
            deck: [],
            board: [],
            topCard: null,
            gamePhase: 'playing' as const,
            turnCount: 1,
            scoring: {
              activeConditions: [],
              targetScore: 0,
            },
          } as GameState;
        }
        return null;
      },
      error: null,
    }),

    loadRule: assign({
      currentRule: ({ event }) =>
        event.type === "LOAD_RULE" ? event.rule : null,
      scoringResults: null,
      error: null,
    }),

    selectCardDef: assign({
      selectedCardDef: ({ event }) =>
        event.type === "SELECT_CARD_DEF" ? event.cardDef : null,
      selectedCard: ({ event }) => {
        if (event.type === "SELECT_CARD_DEF") {
          return {
            id: `test-${Date.now()}`,
            x: 0,
            y: 0,
            cells: event.cardDef.cells,
            rotation: 0,
            customMetadata: event.cardDef.customMetadata,
          };
        }
        return null;
      },
      cardRotation: 0,
      error: null,
    }),

    clearSelection: assign({
      selectedCard: null,
      selectedCardDef: null,
      cardRotation: 0,
    }),

    setDebugMode: assign({
      debugMode: ({ event }) =>
        event.type === "SET_DEBUG_MODE" ? event.debugMode : false,
    }),

    recreateSelectedCard: assign({
      selectedCard: ({ context }) => {
        if (context.selectedCardDef) {
          return {
            id: `test-${Date.now()}`,
            x: 0,
            y: 0,
            cells: context.selectedCardDef.cells,
            rotation: 0,
            customMetadata: context.selectedCardDef.customMetadata,
          };
        }
        return null;
      },
      cardRotation: 0,
    }),

    updateGameState: assign({
      gameState: ({ event }) => {
        if ("output" in event) {
          return event.output as GameState;
        }
        return null;
      },
      // Don't clear selectedCardDef - keep it so user can place more of same type
      selectedCard: null,
      cardRotation: 0,
    }),

    setScoringResults: assign({
      scoringResults: ({ event }) => {
        if ("output" in event) {
          return event.output as RuleTestResults;
        }
        return null;
      },
      isLoading: false,
      error: null,
    }),

    setLoading: assign({
      isLoading: true,
    }),
  },

  guards: {
    // Import all game machine guards and add rule testing guards
    hasValidSetup: ({ context }) => {
      return context.selectedVariations.length > 0 && context.playerCount >= 2;
    },
    hasSelectedCard: ({ context }) => context.selectedCard !== null,
    isGameOver: ({ context }) => {
      if (!context.gameState) return false;
      
      const deckEmpty = context.gameState.deck.length === 0;
      const allPlayersEmpty = context.gameState.players.every(player => player.hand.length === 0);
      
      return deckEmpty && allPlayersEmpty;
    },

    // Rule testing specific guards
    hasCurrentDeck: ({ context }) => context.currentDeck !== null,
    hasCurrentRule: ({ context }) => context.currentRule !== null,
    canRunTest: ({ context }) => {
      return context.currentRule !== null && 
             context.gameState !== null && 
             context.gameState.board.length > 0;
    },
  },

  actors: {
    // Import game machine actors and add rule testing actors
    initializeGame: fromPromise(
      async ({ input }: { input: { playerCount: number; selectedVariations: any[]; selectedExpansions: string[]; }; }) => {
        const playerNames = Array.from(
          { length: input.playerCount },
          (_, i) => `Player ${i + 1}`
        );
        const { initializeGame } = await import("../utils/gameLogic");
        return initializeGame(
          playerNames,
          input.selectedVariations,
          input.selectedExpansions
        );
      }
    ),
    placeCard: fromPromise(
      async ({ input }: { input: { gameState: GameState; selectedCard: Card; cardRotation: number; placementPos: { x: number; y: number }; }; }) => {
        const { gameState, selectedCard, cardRotation, placementPos } = input;

        if (!gameState || !selectedCard) {
          throw new Error("Invalid game state for placing card");
        }

        const { rotateCard, isValidPlacement } = await import("../utils/gameLogic");
        
        const rotatedCard =
          cardRotation > 0
            ? rotateCard(selectedCard, cardRotation)
            : selectedCard;

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

        // For rule testing, place the card directly on board (no player hand check needed)
        const placedCard = {
          ...rotatedCard,
          x: placementPos.x,
          y: placementPos.y,
        };
        
        const newGameState: GameState = {
          ...gameState,
          board: [...gameState.board, placedCard],
        };
        return newGameState;
      }
    ),

    // Rule testing specific actors
    removeCard: fromPromise(
      async ({ input }: { input: { gameState: GameState; position: { x: number; y: number }; }; }) => {
        const { gameState, position } = input;

        if (!gameState) {
          throw new Error("Invalid game state for removing card");
        }

        const newBoard = gameState.board.filter(card => 
          !(Math.abs(card.x - position.x) < 2 && Math.abs(card.y - position.y) < 2)
        );

        return {
          ...gameState,
          board: newBoard,
        } as GameState;
      }
    ),

    runTest: fromPromise(
      async ({ input }: { input: { rule: CustomScoringCondition; board: Card[]; debugMode: boolean; }; }) => {
        const { rule, board, debugMode } = input;
        return ruleTester.testRule(rule, board, debugMode);
      }
    ),
  },
}).createMachine({
  id: "rule-test",
  
  context: {
    // Game machine context defaults
    selectedVariations: [],
    selectedExpansions: [],
    playerCount: 1,
    gameState: null,
    selectedCard: null,
    cardRotation: 0,
    placementPos: { x: 0, y: 0 },
    error: null,
    
    // Rule testing specific context
    currentDeck: null,
    currentRule: null,
    selectedCardDef: null,
    scoringResults: null,
    isLoading: false,
    debugMode: false,
  },

  initial: "ruleTestSetup",

  states: {
    ruleTestSetup: {
      on: {
        LOAD_DECK: {
          target: "playing.idle",
          actions: "loadDeck",
        },
      },
    },

    playing: {
      initial: "idle",
      states: {
        idle: {
          on: {
            LOAD_RULE: {
              actions: "loadRule",
            },
            SELECT_CARD_DEF: {
              target: "cardSelected",
              actions: "selectCardDef",
              guard: "hasCurrentDeck",
            },
            RUN_TEST: {
              target: "testing",
              guard: "canRunTest",
            },
            REMOVE_CARD: {
              target: "removingCard",
            },
            SELECT_CARD: {
              target: "cardSelected",
              actions: "selectCard",
            },
            CLEAR_SELECTION: {
              actions: "clearSelection",
            },
          },
        },
        
        cardSelected: {
          on: {
            SELECT_CARD_DEF: {
              actions: "selectCardDef",
              guard: "hasCurrentDeck",
            },
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
            onDone: [
              {
                target: "testing",
                actions: "updateGameState",
                guard: "canRunTest",
              },
              {
                target: "cardSelected",
                actions: ["updateGameState", "recreateSelectedCard"],
              }
            ],
            onError: {
              target: "cardSelected",
              actions: "setError",
            },
          },
        },

        removingCard: {
          invoke: {
            src: "removeCard",
            input: ({ context, event }) => ({
              gameState: context.gameState!,
              position: event.type === "REMOVE_CARD" 
                ? { x: event.x, y: event.y } 
                : { x: 0, y: 0 },
            }),
            onDone: {
              target: "testing",
              actions: "updateGameState",
            },
            onError: {
              target: "idle",
              actions: "setError",
            },
          },
        },

        testing: {
          entry: "setLoading",
          invoke: {
            src: "runTest",
            input: ({ context }) => ({
              rule: context.currentRule!,
              board: context.gameState!.board,
              debugMode: context.debugMode,
            }),
            onDone: [
              {
                target: "cardSelected",
                actions: ["setScoringResults", "recreateSelectedCard"],
                guard: ({ context }) => context.selectedCardDef !== null,
              },
              {
                target: "idle",
                actions: "setScoringResults",
              }
            ],
            onError: {
              target: "idle",
              actions: "setError",
            },
          },
        },
      },
    },
  },

  on: {
    CLEAR_ERROR: {
      actions: "clearError",
    },
    SET_DEBUG_MODE: {
      actions: "setDebugMode",
    },
  },
});

// Helper to create and configure a rule testing actor
export const createRuleTestActor = () => {
  return createActor(ruleTestMachine);
};