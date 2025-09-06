import { CustomMetadata } from "./metadataSystem";

// Road segments connect edges: top, right, bottom, left (0, 1, 2, 3)
export type RoadSegment = [number, number]; // [from_edge, to_edge]

export type TileData = CellData & {
  cardId: string;
  x: number;
  y: number;
  cardIndex: number; // Track which card this is from (later cards are on top)
};

export interface CellData {
  type: CellType;
  roads: RoadSegment[]; // Road segments in this cell
  customMetadata?: CustomMetadata; // Custom metadata for this individual cell
}

export interface Card {
  id: string;
  x: number;
  y: number;
  cells: CellData[][];
  rotation: number; // 0 or 180 degrees
}

export type CellType = string;

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  isActive: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  deck: Card[];
  board: Card[];
  topCard: Card | null; // Public visible top card of deck
  gamePhase: "setup" | "playing" | "ended";
  turnCount: number;
  scoring?: {
    activeConditions: Array<{ id: string; name: string; description: string }>;
    targetScore: number;
    customConditions?: any[]; // Store custom scoring conditions
  };
}

export interface Transform {
  scale: number;
  offsetX: number;
  offsetY: number;
}
