import {
  Card,
  CellData,
  CellType,
  RoadSegment,
  GameState,
  Player,
} from "../types/game";
import { GameVariation, CardDefinition, CustomDeck, GAME_VARIATIONS } from "../types/deck";
import { SCORING_CONDITIONS } from "./scoringConditions";
import { calculateScore } from "./scoring";
import { customScoringEngine } from "./customScoringEngine";
import { ScoringCondition } from "../types/scoring";
import { CustomScoringCondition } from '../types/scoring-formulas';

const CARD_WIDTH = 2;
const CARD_HEIGHT = 2;

export const generateRandomCard = (id?: string): Card => {
  const types: CellType[] = ["residential", "commercial", "industrial", "park"];
  const cells: CellData[][] = [];

  // Generate base cell types
  for (let i = 0; i < CARD_HEIGHT; i++) {
    cells[i] = [];
    for (let j = 0; j < CARD_WIDTH; j++) {
      cells[i][j] = {
        type: types[Math.floor(Math.random() * types.length)],
        roads: [],
      };
    }
  }

  // Add road segments - ensure at least one road and one cell without roads
  const roadPatterns = [
    // L-shape roads
    { cells: [[0, 0]], roads: [[[3, 0] as RoadSegment]] }, // top-left: left to top
    { cells: [[0, 1]], roads: [[[0, 1] as RoadSegment]] }, // top-right: top to right
    { cells: [[1, 1]], roads: [[[1, 2] as RoadSegment]] }, // bottom-right: right to bottom
    { cells: [[1, 0]], roads: [[[2, 3] as RoadSegment]] }, // bottom-left: bottom to left
    // Straight roads
    {
      cells: [
        [0, 0],
        [0, 1],
      ],
      roads: [[[3, 1] as RoadSegment], [[3, 1] as RoadSegment]],
    }, // horizontal top
    {
      cells: [
        [1, 0],
        [1, 1],
      ],
      roads: [[[3, 1] as RoadSegment], [[3, 1] as RoadSegment]],
    }, // horizontal bottom
    {
      cells: [
        [0, 0],
        [1, 0],
      ],
      roads: [[[0, 2] as RoadSegment], [[0, 2] as RoadSegment]],
    }, // vertical left
    {
      cells: [
        [0, 1],
        [1, 1],
      ],
      roads: [[[0, 2] as RoadSegment], [[0, 2] as RoadSegment]],
    }, // vertical right
    // T-junction
    {
      cells: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      roads: [
        [[3, 0] as RoadSegment],
        [[0, 1] as RoadSegment],
        [[2, 3] as RoadSegment],
      ],
    },
  ];

  // Pick a random road pattern
  const pattern = roadPatterns[Math.floor(Math.random() * roadPatterns.length)];
  pattern.cells.forEach((cellPos, idx) => {
    const [row, col] = cellPos;
    cells[row][col].roads = pattern.roads[idx];
  });

  return {
    id: id || `card-${Date.now()}-${Math.random()}`,
    x: 0,
    y: 0,
    cells,
    rotation: 0,
  };
};

// Enhanced function that supports both preset variations and custom decks
export const generateDeckFromVariations = (
  variations: (GameVariation | CustomDeck)[],
  selectedExpansions: string[] = []
): Card[] => {
  const deck: Card[] = [];

  // Add cards from each selected variation (preset or custom)
  for (const variation of variations) {
    // Add base cards from this variation
    for (const cardDef of variation.baseCards) {
      for (let i = 0; i < cardDef.count; i++) {
        const card: Card = {
          id: `${cardDef.id}-${i}`,
          x: 0,
          y: 0,
          cells: cardDef.cells,
          rotation: 0,
        };
        
        deck.push(card);
      }
    }

    // Add expansion cards from this variation (only for preset variations)
    if (variation.type !== 'custom' && selectedExpansions.length > 0) {
      for (const expansionId of selectedExpansions) {
        const expansion = variation.expansions.find((e) => e.id === expansionId);
        if (expansion) {
          for (const cardDef of expansion.cards) {
            for (let i = 0; i < cardDef.count; i++) {
              const card: Card = {
                id: `${cardDef.id}-${i}`,
                x: 0,
                y: 0,
                cells: cardDef.cells,
                rotation: 0,
              };
              
              deck.push(card);
            }
          }
        }
      }
    }
  }

  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

// Legacy function for backwards compatibility - converts IDs to variation objects
export const generateDeckFromVariationIds = (
  variationIds: string[],
  selectedExpansions: string[] = []
): Card[] => {
  const variations = variationIds.map(id => {
    const variation = GAME_VARIATIONS.find((v) => v.id === id);
    if (!variation) {
      throw new Error(`Unknown variation: ${id}`);
    }
    return variation;
  });

  return generateDeckFromVariations(variations, selectedExpansions);
};

// Legacy function for single variation (backwards compatibility)
export const generateDeckFromVariation = (
  variationId: string,
  selectedExpansions: string[] = []
): Card[] => {
  return generateDeckFromVariationIds([variationId], selectedExpansions);
};

// Keep the old function for backwards compatibility
export const generateDeck = (size: number = 60): Card[] => {
  const deck: Card[] = [];
  for (let i = 0; i < size; i++) {
    deck.push(generateRandomCard(`deck-card-${i}`));
  }
  return deck;
};

export const rotateCard = (card: Card, rotation: number): Card => {
  if (rotation === 0) {
    return { ...card, rotation: 0 };
  }

  // 180-degree rotation
  const rotatedCells: CellData[][] = [];
  for (let i = 0; i < CARD_HEIGHT; i++) {
    rotatedCells[i] = [];
    for (let j = 0; j < CARD_WIDTH; j++) {
      const originalCell = card.cells[CARD_HEIGHT - 1 - i][CARD_WIDTH - 1 - j];
      // Rotate road segments by 180 degrees (add 2 to each edge, mod 4)
      const rotatedRoads: RoadSegment[] = originalCell.roads.map(
        (segment) => [(segment[0] + 2) % 4, (segment[1] + 2) % 4] as RoadSegment
      );
      rotatedCells[i][j] = {
        type: originalCell.type,
        roads: rotatedRoads,
      };
    }
  }

  return { ...card, cells: rotatedCells, rotation };
};

export const isValidPlacement = (
  card: Card,
  x: number,
  y: number,
  board: Card[]
): boolean => {
  if (board.length === 0) return true;

  // Get all cells of existing cards
  const allExistingCells = new Set<string>();
  for (const existingCard of board) {
    for (let cy = 0; cy < CARD_HEIGHT; cy++) {
      for (let cx = 0; cx < CARD_WIDTH; cx++) {
        allExistingCells.add(`${existingCard.x + cx},${existingCard.y + cy}`);
      }
    }
  }

  let hasValidConnection = false;
  let allConnectionsAreCorners = true;

  // Check each cell of the new card
  for (let cy = 0; cy < CARD_HEIGHT; cy++) {
    for (let cx = 0; cx < CARD_WIDTH; cx++) {
      const nx = x + cx;
      const ny = y + cy;
      const cellKey = `${nx},${ny}`;

      // Check for overlap (valid)
      if (allExistingCells.has(cellKey)) {
        hasValidConnection = true;
        allConnectionsAreCorners = false;
      }

      // Check for edge adjacency (valid)
      const adjacentCells = [
        `${nx - 1},${ny}`, // left
        `${nx + 1},${ny}`, // right
        `${nx},${ny - 1}`, // top
        `${nx},${ny + 1}`, // bottom
      ];

      for (const adjacent of adjacentCells) {
        if (allExistingCells.has(adjacent)) {
          hasValidConnection = true;
          allConnectionsAreCorners = false;
        }
      }

      // Check for corner connections
      const cornerCells = [
        `${nx - 1},${ny - 1}`, // top-left
        `${nx + 1},${ny - 1}`, // top-right
        `${nx - 1},${ny + 1}`, // bottom-left
        `${nx + 1},${ny + 1}`, // bottom-right
      ];

      for (const corner of cornerCells) {
        if (allExistingCells.has(corner)) {
          hasValidConnection = true;
        }
      }
    }
  }

  // Valid if we have any connection AND not all connections are corners
  return hasValidConnection && !allConnectionsAreCorners;
};

export const initializeGame = (
  playerNames: string[],
  variations: (GameVariation | CustomDeck)[] = [],
  selectedExpansions: string[] = []
): GameState => {
  // If no variations provided, default to sprawopolis
  const gameVariations = variations.length > 0 ? variations : [GAME_VARIATIONS[0]];
  const deck = generateDeckFromVariations(gameVariations, selectedExpansions);
  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index}`,
    name,
    hand: [],
    isActive: true,
  }));

  // Place the first card in the center of the board
  const firstCard = deck.pop()!;
  firstCard.x = 0; // Center position
  firstCard.y = 0;

  // Deal cards: 3 to starting player, 1 to others
  const startingPlayerIndex = Math.floor(Math.random() * players.length);
  players.forEach((player, index) => {
    const cardCount = index === startingPlayerIndex ? 3 : 1;
    for (let i = 0; i < cardCount; i++) {
      if (deck.length > 0) {
        player.hand.push(deck.pop()!);
      }
    }
  });

  // Get the top card (public)
  const topCard = deck.length > 0 ? deck[deck.length - 1] : null;

  // Set up scoring conditions - only use card-based and global conditions
  let cardBasedConditions: ScoringCondition[] = [];
  let globalConditions: ScoringCondition[] = [];
  let targetScore = 0;

  // Collect scoring conditions from card definitions in the deck
  const cardScoringConditionIds = new Set<string>();
  
  // Extract scoring condition IDs from all cards in all variations
  for (const variation of gameVariations) {
    // Check base cards
    for (const cardDef of variation.baseCards) {
      if (cardDef.scoringConditionId) {
        cardScoringConditionIds.add(cardDef.scoringConditionId);
      }
    }
    
    // Check expansion cards (only for preset variations)
    if (variation.type !== 'custom' && selectedExpansions.length > 0) {
      for (const expansionId of selectedExpansions) {
        const expansion = variation.expansions.find(e => e.id === expansionId);
        if (expansion) {
          for (const cardDef of expansion.cards) {
            if (cardDef.scoringConditionId) {
              cardScoringConditionIds.add(cardDef.scoringConditionId);
            }
          }
        }
      }
    }
  }

  // Get custom decks for global conditions
  const customDecks = gameVariations.filter(v => 'isCustom' in v && v.isCustom) as CustomDeck[];
  
  // Process custom scoring conditions from custom decks
  for (const deck of customDecks) {
    if (deck.customScoringConditions) {
      for (const cond of deck.customScoringConditions) {
        const scoringCondition: ScoringCondition = {
          id: cond.id,
          name: cond.name,
          description: cond.description,
          targetContribution: cond.targetContribution || 0,
          evaluate: (_board: Card[]) => {
            // This will be handled by the custom scoring engine
            // Actual evaluation happens in the scoring calculation
            return 0;
          }
        };

        if (cond.isGlobal) {
          // Global conditions are always active and don't count towards the 3-card limit
          globalConditions.push(scoringCondition);
        } else if (cardScoringConditionIds.has(cond.id)) {
          // Only include non-global conditions that are referenced by cards
          cardBasedConditions.push(scoringCondition);
        }
      }
    }
  }

  // For built-in conditions, check if any cards reference them
  for (const conditionId of cardScoringConditionIds) {
    const builtInCondition = SCORING_CONDITIONS[conditionId];
    if (builtInCondition && !cardBasedConditions.some(c => c.id === conditionId)) {
      cardBasedConditions.push(builtInCondition);
    }
  }

  // Limit card-based conditions to 3 (not including global conditions)
  const selectedCardBasedConditions = cardBasedConditions.slice(0, 3);
  
  // Combine global and card-based conditions
  const activeConditions = [...globalConditions, ...selectedCardBasedConditions];

  targetScore = activeConditions.reduce((sum, condition) => 
    sum + (condition.targetContribution || 0), 0);

  // Pre-compile custom conditions for better performance
  const customConditions = customDecks.flatMap(deck => deck.customScoringConditions || []);
  if (customConditions.length > 0) {
    customScoringEngine.precompileConditions(customConditions).catch(console.error);
  }

  return {
    players,
    currentPlayerIndex: startingPlayerIndex,
    deck,
    board: [firstCard],
    topCard,
    gamePhase: "playing" as const,
    turnCount: 0,
    scoring: {
      activeConditions: activeConditions.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description
      })),
      targetScore,
      customConditions: customConditions as any[] // Store for scoring calculations
    },
  };
};

export const playCard = (
  gameState: GameState,
  playerId: string,
  cardId: string,
  x: number,
  y: number,
  rotation: number = 0
): GameState | null => {
  const playerIndex = gameState.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1 || playerIndex !== gameState.currentPlayerIndex) {
    return null; // Not this player's turn
  }

  const player = gameState.players[playerIndex];
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return null; // Card not in hand
  }

  let card = player.hand[cardIndex];
  card = rotateCard(card, rotation);
  card.x = x;
  card.y = y;

  if (!isValidPlacement(card, x, y, gameState.board)) {
    return null; // Invalid placement
  }

  // Remove card from player's hand
  const newHand = [...player.hand];
  newHand.splice(cardIndex, 1);

  // Pass remaining cards to next player
  const nextPlayerIndex = (playerIndex + 1) % gameState.players.length;

  // Create new players array with updated hands
  const newPlayers = gameState.players.map((p, idx) => {
    if (idx === playerIndex) {
      // Current player only gets the newly drawn card (remaining cards are passed)
      const drawnCard =
        gameState.deck.length > 0
          ? gameState.deck[gameState.deck.length - 1]
          : null;
      const updatedHand = drawnCard ? [drawnCard] : [];
      return { ...p, hand: updatedHand };
    } else if (idx === nextPlayerIndex) {
      // Next player receives passed cards
      return { ...p, hand: [...p.hand, ...newHand] };
    }
    return p;
  });

  // Update deck (remove the drawn card)
  const newDeck = [...gameState.deck];
  if (newDeck.length > 0) {
    newDeck.pop();
  }

  // Update top card
  const newTopCard = newDeck.length > 0 ? newDeck[newDeck.length - 1] : null;

  return {
    ...gameState,
    players: newPlayers,
    currentPlayerIndex: nextPlayerIndex,
    deck: newDeck,
    board: [...gameState.board, card],
    topCard: newTopCard,
    turnCount: gameState.turnCount + 1,
  };
};

// Legacy function for backwards compatibility with existing code
export const initializeGameWithIds = (
  playerNames: string[],
  variationIds: string[] = ["sprawopolis"],
  selectedExpansions: string[] = []
): GameState => {
  const variations = variationIds.map(id => {
    const variation = GAME_VARIATIONS.find((v) => v.id === id);
    if (!variation) {
      throw new Error(`Unknown variation: ${id}`);
    }
    return variation;
  });

  return initializeGame(playerNames, variations, selectedExpansions);
};

// Calculate current score for a game state
export const getCurrentScore = (gameState: GameState) => {
  if (!gameState.scoring) {
    return calculateScore(gameState.board);
  }
  
  // Get the actual scoring condition functions
  const builtInConditions = gameState.scoring.activeConditions
    .map(conditionInfo => SCORING_CONDITIONS[conditionInfo.id])
    .filter(Boolean); // Remove any undefined conditions
  
  // Handle custom scoring conditions
  const customConditions: ScoringCondition[] = [];
  if (gameState.scoring.customConditions && gameState.scoring.customConditions.length > 0) {
    // Convert custom conditions to ScoringCondition format
    gameState.scoring.customConditions.forEach(cond => {
      if (gameState.scoring?.activeConditions.some(ac => ac.id === cond.id)) {
        customConditions.push({
          id: cond.id,
          name: cond.name,
          description: cond.description,
          targetContribution: cond.targetContribution || 0,
          evaluate: (board: Card[]) => {
            // Simplified synchronous evaluation for now
            // In production, this would be handled asynchronously
            try {
              const context = customScoringEngine['createScoringContext'](board);
              const formula = customScoringEngine['createSafeFormula'](cond.formula);
              return formula(context);
            } catch {
              return 0;
            }
          }
        });
      }
    });
  }
  
  // Combine built-in and custom conditions
  const allConditions = [...builtInConditions, ...customConditions];
  
  return calculateScore(gameState.board, allConditions);
};
