import { Card } from "../types/game";
import { CustomScoringCondition } from "../types/scoring-formulas";
import { CustomDeck, CardDefinition } from "../types/deck";
import {
  RuleTestResults,
  TileHighlight,
  BoardPreset,
  BoardPosition,
} from "../types/ruleTesting";
import { executeScoringFormula } from "./scoring-sandbox";
import { createScoringContext, runScoringFormula } from "./scoring-utilities";

/**
 * Rule testing framework for interactive testing of scoring conditions
 */
export class RuleTester {
  private static instance: RuleTester;

  static getInstance(): RuleTester {
    if (!RuleTester.instance) {
      RuleTester.instance = new RuleTester();
    }
    return RuleTester.instance;
  }

  /**
   * Execute formula directly in main thread for debugging (allows console.log)
   */
  private async executeFormulaDirectly(
    compiledJS: string,
    gameState: any
  ): Promise<any> {
    console.log("🐛 DEBUG MODE: Executing formula directly");
    console.log("📊 Game state:", gameState);

    // Create scoring context with console support enabled
    const context = createScoringContext(gameState, { allowConsole: true });

    console.log("🎯 All tiles:", context.getAllTiles());

    try {
      // Execute the compiled JavaScript with context
      console.log("Compiled JS:", compiledJS);

      console.log("🔧 Executing formula...");
      const result = runScoringFormula(compiledJS, context);
      console.log("✅ Formula result:", result);

      // Normalize result format
      const normalizedResult = {
        score: typeof result === "number" ? result : result?.score || 0,
        details: result?.details || [],
      };

      console.log("📋 Normalized result:", normalizedResult);
      return normalizedResult;
    } catch (error) {
      console.error("❌ Formula execution error:", error);
      return { score: 0, details: [] };
    }
  }

  /**
   * Tests a scoring rule against a board and returns detailed results
   */
  async testRule(
    rule: CustomScoringCondition,
    board: Card[],
    debugMode = false
  ): Promise<RuleTestResults> {
    const startTime = performance.now();

    try {
      // Create scoring context for this board
      const context = createScoringContext({
        board,
        players: [],
        currentPlayerIndex: 0,
        deck: [],
        gamePhase: "ended",
        topCard: null,
        turnCount: 15,
      });

      // Execute the scoring formula
      let executionResult;
      if (debugMode) {
        // In debug mode, execute directly without worker for console.log support
        executionResult = await this.executeFormulaDirectly(
          rule.compiledFormula,
          context.gameState
        );
      } else {
        executionResult = await executeScoringFormula(
          rule.compiledFormula,
          context.gameState
        );
      }

      const endTime = performance.now();

      // Generate tile highlights based on scoring details
      const highlightedTiles = this.generateTileHighlights(
        executionResult,
        board
      );

      return {
        ruleId: rule.id,
        testBoard: [...board],
        calculatedScore: executionResult.score,
        highlightedTiles,
        executionTime: endTime - startTime,
        errors: [],
        details: executionResult.details
          ? {
              description: `${rule.name}: ${executionResult.score} points`,
              breakdown: executionResult.details.map((detail: any) => ({
                description: detail.description || "Scoring calculation",
                points: detail.points || 0,
                tiles: (detail.relevantTiles || []).map((tile: any) => ({
                  row: tile.y,
                  col: tile.x,
                })),
              })),
            }
          : undefined,
      };
    } catch (error) {
      const endTime = performance.now();

      return {
        ruleId: rule.id,
        testBoard: [...board],
        calculatedScore: 0,
        highlightedTiles: [],
        executionTime: endTime - startTime,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Creates a test board from deck cards
   */
  createTestBoard(deck: CustomDeck, size: number = 8): Card[] {
    const cards: Card[] = [];
    let cardIdCounter = 0;

    // Helper to generate card ID
    const generateCardId = () => `test-card-${cardIdCounter++}`;

    // Create cards from deck definitions, limiting total cards
    const totalCards = Math.min(
      size,
      deck.baseCards.reduce((sum, card) => sum + card.count, 0)
    );
    let cardsPlaced = 0;

    for (const cardDef of deck.baseCards) {
      if (cardsPlaced >= totalCards) break;

      const cardsFromThisDef = Math.min(
        cardDef.count,
        totalCards - cardsPlaced
      );

      for (let i = 0; i < cardsFromThisDef; i++) {
        // Calculate position in a roughly square grid
        const gridSize = Math.ceil(Math.sqrt(totalCards));
        const row = Math.floor(cardsPlaced / gridSize);
        const col = cardsPlaced % gridSize;

        cards.push({
          id: generateCardId(),
          x: col * 3, // Space cards out to avoid overlap
          y: row * 3,
          cells: cardDef.cells,
          rotation: 0,
        });

        cardsPlaced++;
      }
    }

    return cards;
  }

  /**
   * Places a card at a specific position on the test board
   */
  placeCard(
    board: Card[],
    position: BoardPosition,
    cardDefinition: CardDefinition
  ): Card[] {
    const newCard: Card = {
      id: `placed-${Date.now()}-${Math.random()}`,
      x: position.x,
      y: position.y,
      cells: cardDefinition.cells,
      rotation: 0,
    };

    // Check if there's already a card at this position
    const existingCardIndex = board.findIndex(
      (card) =>
        Math.abs(card.x - position.x) < 2 && Math.abs(card.y - position.y) < 2
    );

    if (existingCardIndex >= 0) {
      // Replace existing card
      const newBoard = [...board];
      newBoard[existingCardIndex] = newCard;
      return newBoard;
    } else {
      // Add new card
      return [...board, newCard];
    }
  }

  /**
   * Removes a card from the test board at a specific position
   */
  removeCard(board: Card[], position: BoardPosition): Card[] {
    return board.filter(
      (card) =>
        !(
          Math.abs(card.x - position.x) < 2 && Math.abs(card.y - position.y) < 2
        )
    );
  }

  /**
   * Generates tile highlights based on scoring execution results
   */
  private generateTileHighlights(
    executionResult: any,
    _board: Card[]
  ): TileHighlight[] {
    const highlights: TileHighlight[] = [];

    if (executionResult.highlightedTiles) {
      executionResult.highlightedTiles.forEach((tile: any) => {
        highlights.push({
          row: tile.row,
          col: tile.col,
          color: tile.color || "#3b82f6", // Default to blue
          intensity: tile.intensity || 0.7,
          description: tile.description,
        });
      });
    }

    // If no explicit highlights, try to highlight tiles mentioned in details
    if (highlights.length === 0 && executionResult.details) {
      executionResult.details.forEach((detail: any) => {
        if (detail.tiles) {
          detail.tiles.forEach((tile: any) => {
            highlights.push({
              row: tile.row,
              col: tile.col,
              color: detail.points > 0 ? "#10b981" : "#ef4444", // Green for positive, red for negative
              intensity: Math.min(1, Math.abs(detail.points) / 10), // Scale intensity by points
              description: detail.description,
            });
          });
        }
      });
    }

    return highlights;
  }

  /**
   * Creates common board presets for testing
   */
  getCommonPresets(deck: CustomDeck): BoardPreset[] {
    const presets: BoardPreset[] = [];

    // Empty board
    presets.push({
      id: "empty",
      name: "Empty Board",
      description: "Start with a clean slate",
      board: [],
      suggestedRules: [],
    });

    // Single card
    if (deck.baseCards.length > 0) {
      const firstCard = deck.baseCards[0];
      presets.push({
        id: "single-card",
        name: "Single Card",
        description: "Test with one card",
        board: [
          {
            id: "preset-single",
            x: 0,
            y: 0,
            cells: firstCard.cells,
            rotation: 0,
          },
        ],
        suggestedRules: [],
      });
    }

    // Small cluster (2x2 cards)
    if (deck.baseCards.length >= 4) {
      const smallBoard: Card[] = [];
      for (let i = 0; i < Math.min(4, deck.baseCards.length); i++) {
        const cardDef = deck.baseCards[i];
        smallBoard.push({
          id: `preset-cluster-${i}`,
          x: (i % 2) * 3,
          y: Math.floor(i / 2) * 3,
          cells: cardDef.cells,
          rotation: 0,
        });
      }

      presets.push({
        id: "small-cluster",
        name: "Small Cluster",
        description: "Four cards in a cluster",
        board: smallBoard,
        suggestedRules: deck.customScoringConditions?.map((c) => c.id) || [],
      });
    }

    // Full test board
    presets.push({
      id: "full-board",
      name: "Full Test Board",
      description: "Generated board with variety of cards",
      board: this.createTestBoard(deck, 8),
      suggestedRules: deck.customScoringConditions?.map((c) => c.id) || [],
    });

    return presets;
  }

  /**
   * Calculates board statistics for display
   */
  getBoardStats(
    board: Card[],
    deck: CustomDeck
  ): {
    cardCount: number;
    zoneCount: Record<string, number>;
    roadConnections: number;
    coverage: number;
  } {
    const stats = {
      cardCount: board.length,
      zoneCount: {} as Record<string, number>,
      roadConnections: 0,
      coverage: 0,
    };

    // Initialize zone counts
    deck.zoneTypes.forEach((zone) => {
      stats.zoneCount[zone.id] = 0;
    });

    // Count zones from all cards
    let totalCells = 0;
    board.forEach((card) => {
      card.cells.forEach((row) => {
        row.forEach((cell) => {
          stats.zoneCount[cell.type] = (stats.zoneCount[cell.type] || 0) + 1;
          totalCells++;

          // Count road segments
          if (cell.roads && cell.roads.length > 0) {
            stats.roadConnections += cell.roads.length;
          }
        });
      });
    });

    // Calculate coverage as percentage of expected full board
    const expectedCells = 8 * 4; // 8 cards * 4 cells per card
    stats.coverage =
      totalCells > 0 ? Math.round((totalCells / expectedCells) * 100) : 0;

    return stats;
  }
}
