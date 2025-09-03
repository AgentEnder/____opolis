import { create } from 'zustand';
import { Card } from '../types/game';
import { CustomScoringCondition } from '../types/scoring-formulas';
import { CardDefinition, CustomDeck } from '../types/deck';
import { 
  BoardPreset, 
  BoardPosition,
  RuleTestEnvironment 
} from '../types/ruleTesting';
import { RuleTester } from '../utils/ruleTesting';

interface RuleTestStoreState extends RuleTestEnvironment {
  // Actions
  loadRule: (rule: CustomScoringCondition | null) => void;
  setTestBoard: (board: Card[]) => void;
  placeCard: (position: BoardPosition, cardDef: CardDefinition) => void;
  removeCard: (position: BoardPosition) => void;
  runTest: () => Promise<void>;
  resetBoard: () => void;
  loadPreset: (preset: BoardPreset) => void;
  generateFullDeck: (deck: CustomDeck) => void;
  
  // Getters
  getBoardStats: (deck: CustomDeck) => any;
  getAvailablePresets: (deck: CustomDeck) => BoardPreset[];
}

export const useRuleTestStore = create<RuleTestStoreState>()((set, get) => {
  const ruleTester = RuleTester.getInstance();

  return {
    // Initial state
    currentRule: null,
    testBoard: [],
    availableCards: [],
    scoringResults: null,
    highlightedTiles: [],
    boardSize: 8,
    isLoading: false,

    // Actions
    loadRule: (rule: CustomScoringCondition | null) => {
      set({ 
        currentRule: rule,
        scoringResults: null,
        highlightedTiles: []
      });
      
      // Auto-run test if we have both rule and board
      const { testBoard } = get();
      if (rule && testBoard.length > 0) {
        get().runTest();
      }
    },

    setTestBoard: (board: Card[]) => {
      set({ 
        testBoard: board,
        scoringResults: null,
        highlightedTiles: []
      });
      
      // Auto-run test if we have a current rule
      const { currentRule } = get();
      if (currentRule && board.length > 0) {
        get().runTest();
      }
    },

    placeCard: (position: BoardPosition, cardDef: CardDefinition) => {
      const { testBoard } = get();
      const newBoard = ruleTester.placeCard(testBoard, position, cardDef);
      
      set({ 
        testBoard: newBoard,
        scoringResults: null,
        highlightedTiles: []
      });
      
      // Auto-run test if we have a current rule
      const { currentRule } = get();
      if (currentRule) {
        get().runTest();
      }
    },

    removeCard: (position: BoardPosition) => {
      const { testBoard } = get();
      const newBoard = ruleTester.removeCard(testBoard, position);
      
      set({ 
        testBoard: newBoard,
        scoringResults: null,
        highlightedTiles: []
      });
      
      // Auto-run test if we have a current rule
      const { currentRule } = get();
      if (currentRule && newBoard.length > 0) {
        get().runTest();
      }
    },

    runTest: async () => {
      const { currentRule, testBoard } = get();
      
      if (!currentRule) {
        console.warn('No rule selected for testing');
        return;
      }

      if (testBoard.length === 0) {
        console.warn('No cards on test board');
        set({ 
          scoringResults: null,
          highlightedTiles: []
        });
        return;
      }

      set({ isLoading: true });

      try {
        const results = await ruleTester.testRule(currentRule, testBoard);
        
        set({
          scoringResults: results,
          highlightedTiles: results.highlightedTiles,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error running rule test:', error);
        set({
          scoringResults: {
            ruleId: currentRule.id,
            testBoard,
            calculatedScore: 0,
            highlightedTiles: [],
            executionTime: 0,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
          },
          highlightedTiles: [],
          isLoading: false,
        });
      }
    },

    resetBoard: () => {
      set({
        testBoard: [],
        scoringResults: null,
        highlightedTiles: [],
      });
    },

    loadPreset: (preset: BoardPreset) => {
      set({
        testBoard: [...preset.board],
        scoringResults: null,
        highlightedTiles: [],
      });
      
      // Auto-run test if we have a current rule
      const { currentRule } = get();
      if (currentRule && preset.board.length > 0) {
        get().runTest();
      }
    },

    generateFullDeck: (deck: CustomDeck) => {
      const { boardSize } = get();
      const newBoard = ruleTester.createTestBoard(deck, boardSize);
      
      set({
        testBoard: newBoard,
        availableCards: deck.baseCards.map(cardDef => ({
          id: `available-${cardDef.id}`,
          x: 0,
          y: 0,
          cells: cardDef.cells,
          rotation: 0,
          customMetadata: cardDef.customMetadata,
        })),
        scoringResults: null,
        highlightedTiles: [],
      });
      
      // Auto-run test if we have a current rule
      const { currentRule } = get();
      if (currentRule) {
        get().runTest();
      }
    },

    // Getters
    getBoardStats: (deck: CustomDeck) => {
      const { testBoard } = get();
      return ruleTester.getBoardStats(testBoard, deck);
    },

    getAvailablePresets: (deck: CustomDeck) => {
      return ruleTester.getCommonPresets(deck);
    },
  };
});