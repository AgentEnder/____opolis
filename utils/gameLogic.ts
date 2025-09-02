import {
  Card,
  CellData,
  CellType,
  RoadSegment,
  GameState,
  Player,
} from "../types/game";
import { GameVariation, CardDefinition, GAME_VARIATIONS } from "../types/deck";

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

export const generateDeckFromVariations = (
  variationIds: string[],
  selectedExpansions: string[] = []
): Card[] => {
  const deck: Card[] = [];

  // Add cards from each selected variation
  for (const variationId of variationIds) {
    const variation = GAME_VARIATIONS.find((v) => v.id === variationId);
    if (!variation) {
      throw new Error(`Unknown variation: ${variationId}`);
    }

    // Add base cards from this variation
    for (const cardDef of variation.baseCards) {
      for (let i = 0; i < cardDef.count; i++) {
        deck.push({
          id: `${cardDef.id}-${i}`,
          x: 0,
          y: 0,
          cells: cardDef.cells,
          rotation: 0,
        });
      }
    }

    // Add expansion cards from this variation
    for (const expansionId of selectedExpansions) {
      const expansion = variation.expansions.find((e) => e.id === expansionId);
      if (expansion) {
        for (const cardDef of expansion.cards) {
          for (let i = 0; i < cardDef.count; i++) {
            deck.push({
              id: `${cardDef.id}-${i}`,
              x: 0,
              y: 0,
              cells: cardDef.cells,
              rotation: 0,
            });
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

// Legacy function for single variation (backwards compatibility)
export const generateDeckFromVariation = (
  variationId: string,
  selectedExpansions: string[] = []
): Card[] => {
  return generateDeckFromVariations([variationId], selectedExpansions);
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
  variationIds: string[] = ["sprawopolis"],
  selectedExpansions: string[] = []
): GameState => {
  const deck = generateDeckFromVariations(variationIds, selectedExpansions);
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

  return {
    players,
    currentPlayerIndex: startingPlayerIndex,
    deck,
    board: [firstCard],
    topCard,
    gamePhase: "playing",
    turnCount: 0,
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
  const nextPlayer = gameState.players[nextPlayerIndex];

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
