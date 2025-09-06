import { Card, CellData, CellType, RoadSegment } from "./game";
import { ScoringCondition } from "./scoring";
import { CustomScoringCondition } from "./scoring-formulas";
import { CustomMetadata, MetadataSchema } from "./metadataSystem";

export interface ZoneType {
  id: string;
  name: string;
  color: string;
  description?: string;
  defaultMetadata?: CustomMetadata; // Default metadata values for cells of this zone type
}

export interface CardDefinition {
  id: string;
  name?: string;
  cells: CellData[][];
  count: number; // How many of this card are in the deck
  scoringConditionId?: string; // References a scoring condition in the deck
  // customMetadata removed - metadata now lives at the cell/zone level
}

export interface Expansion {
  id: string;
  name: string;
  description: string;
  cards: CardDefinition[];
}

export interface GameVariation {
  id: string;
  name: string;
  description: string;
  baseCards: CardDefinition[];
  expansions: Expansion[];
  zoneTypes: ZoneType[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  type?: "preset" | "custom";
  isCustom?: boolean;
  metadataSchema?: MetadataSchema; // Schema for custom card metadata
}

export interface CustomDeck extends GameVariation {
  type: "custom";
  isCustom: true;
  customScoringConditions: CustomScoringCondition[]; // All custom scoring conditions in this deck
  metadata: {
    author: string;
    created: Date;
    modified: Date;
    version: string;
  };
}

// Helper function to create cell data
const cell = (type: CellType, roads: RoadSegment[] = []): CellData => ({
  type,
  roads,
});

// Common road patterns
const ROADS = {
  NONE: [] as RoadSegment[],
  HORIZONTAL: [[3, 1] as RoadSegment], // Left to right
  VERTICAL: [[0, 2] as RoadSegment], // Top to bottom
  L_TOP_RIGHT: [[0, 1] as RoadSegment], // Top to right
  L_RIGHT_BOTTOM: [[1, 2] as RoadSegment], // Right to bottom
  L_BOTTOM_LEFT: [[2, 3] as RoadSegment], // Bottom to left
  L_LEFT_TOP: [[3, 0] as RoadSegment], // Left to top
  T_JUNCTION: [[0, 1], [1, 2] as RoadSegment], // Multiple segments for T-junctions
};

// Sprawopolis (Urban sprawl theme)
export const SPRAWOPOLIS: GameVariation = {
  id: "sprawopolis",
  name: "Sprawopolis",
  description: "The original urban planning card game",
  type: "preset",
  isCustom: false,
  zoneTypes: [
    {
      id: "residential",
      name: "Residential",
      color: "#60a5fa",
      description: "Housing areas",
    },
    {
      id: "commercial",
      name: "Commercial",
      color: "#f59e0b",
      description: "Business districts",
    },
    {
      id: "industrial",
      name: "Industrial",
      color: "#6b7280",
      description: "Manufacturing zones",
    },
    { id: "park", name: "Park", color: "#34d399", description: "Green spaces" },
  ],
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
  },
  baseCards: [
    // Residential-heavy cards
    {
      id: "spr-001",
      name: "Residential Block",
      count: 3,
      cells: [
        [cell("residential"), cell("residential")],
        [cell("residential"), cell("park")],
      ],
      scoringConditionId: "spr-001-residential-block",
    },
    {
      id: "spr-002",
      name: "Suburb",
      count: 2,
      cells: [
        [
          cell("residential", ROADS.HORIZONTAL),
          cell("residential", ROADS.HORIZONTAL),
        ],
        [cell("park"), cell("residential")],
      ],
      scoringConditionId: "spr-002-suburb",
    },
    // Commercial districts
    {
      id: "spr-003",
      name: "Shopping District",
      count: 2,
      cells: [
        [cell("commercial"), cell("commercial")],
        [cell("commercial"), cell("residential")],
      ],
      scoringConditionId: "spr-003-shopping-district",
    },
    {
      id: "spr-004",
      name: "Main Street",
      count: 3,
      cells: [
        [cell("commercial", ROADS.VERTICAL), cell("park")],
        [cell("commercial", ROADS.VERTICAL), cell("commercial")],
      ],
      scoringConditionId: "spr-004-main-street",
    },
    // Industrial areas
    {
      id: "spr-005",
      name: "Factory District",
      count: 2,
      cells: [
        [cell("industrial"), cell("industrial")],
        [cell("industrial"), cell("park")],
      ],
      scoringConditionId: "spr-005-factory-district",
    },
    {
      id: "spr-006",
      name: "Warehouse",
      count: 2,
      cells: [
        [cell("industrial", ROADS.L_TOP_RIGHT), cell("commercial")],
        [cell("park"), cell("industrial")],
      ],
      scoringConditionId: "spr-006-warehouse",
    },
    // Mixed development
    {
      id: "spr-007",
      name: "Mixed Use",
      count: 4,
      cells: [
        [cell("commercial"), cell("residential")],
        [cell("park"), cell("industrial")],
      ],
      scoringConditionId: "spr-007-mixed-use",
    },
    // Road-heavy cards
    {
      id: "spr-008",
      name: "Intersection",
      count: 3,
      cells: [
        [cell("park", ROADS.L_LEFT_TOP), cell("commercial", ROADS.L_TOP_RIGHT)],
        [
          cell("residential", ROADS.L_BOTTOM_LEFT),
          cell("industrial", ROADS.L_RIGHT_BOTTOM),
        ],
      ],
      scoringConditionId: "spr-008-intersection",
    },
  ],
  expansions: [
    {
      id: "spr-exp-1",
      name: "Sprawopolis: Beaches",
      description: "Adds coastal development cards",
      cards: [
        {
          id: "spr-beach-001",
          name: "Beachfront",
          count: 2,
          cells: [
            [cell("park"), cell("park")],
            [cell("residential"), cell("commercial")],
          ],
          scoringConditionId: "spr-beach-001-beachfront",
        },
        {
          id: "spr-beach-002",
          name: "Pier",
          count: 1,
          cells: [
            [
              cell("commercial", ROADS.HORIZONTAL),
              cell("commercial", ROADS.HORIZONTAL),
            ],
            [cell("park"), cell("park")],
          ],
          scoringConditionId: "spr-beach-002-pier",
        },
      ],
    },
  ],
};

// Agropolis (Rural/farming theme)
const AGROPOLIS: GameVariation = {
  id: "agropolis",
  name: "Agropolis",
  description: "Rural farming and countryside development",
  type: "preset",
  isCustom: false,
  zoneTypes: [
    {
      id: "fields",
      name: "Fields",
      color: "#84cc16",
      description: "Farmland and crops",
    },
    {
      id: "livestock",
      name: "Livestock",
      color: "#a78bfa",
      description: "Animal farming",
    },
    {
      id: "orchards",
      name: "Orchards",
      color: "#34d399",
      description: "Fruit trees",
    },
    {
      id: "buildings",
      name: "Buildings",
      color: "#f59e0b",
      description: "Farm buildings",
    },
  ],
  theme: {
    primaryColor: "#22c55e",
    secondaryColor: "#15803d",
  },
  baseCards: [
    {
      id: "agr-001",
      name: "Farmland",
      count: 4,
      cells: [
        [cell("park"), cell("park")],
        [cell("park"), cell("residential")],
      ],
      scoringConditionId: "agr-001-farmland",
    },
    {
      id: "agr-002",
      name: "Barn Complex",
      count: 3,
      cells: [
        [cell("industrial"), cell("park")],
        [cell("park"), cell("park")],
      ],
      scoringConditionId: "agr-002-barn-complex",
    },
    {
      id: "agr-003",
      name: "Country Store",
      count: 2,
      cells: [
        [cell("commercial", ROADS.L_TOP_RIGHT), cell("residential")],
        [cell("park"), cell("park")],
      ],
      scoringConditionId: "agr-003-country-store",
    },
    {
      id: "agr-004",
      name: "Rural Road",
      count: 4,
      cells: [
        [cell("park", ROADS.HORIZONTAL), cell("park", ROADS.HORIZONTAL)],
        [cell("residential"), cell("park")],
      ],
      scoringConditionId: "agr-004-rural-road",
    },
  ],
  expansions: [],
};

// Casinopolis (Casino/entertainment theme)
const CASINOPOLIS: GameVariation = {
  id: "casinopolis",
  name: "Casinopolis",
  description: "Glitzy casino and entertainment district",
  type: "preset",
  isCustom: false,
  zoneTypes: [
    {
      id: "casino",
      name: "Casino",
      color: "#dc2626",
      description: "Gaming floors",
    },
    {
      id: "hotel",
      name: "Hotel",
      color: "#7c3aed",
      description: "Accommodation",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      color: "#06b6d4",
      description: "Shows and venues",
    },
    {
      id: "dining",
      name: "Dining",
      color: "#f59e0b",
      description: "Restaurants and bars",
    },
  ],
  theme: {
    primaryColor: "#f59e0b",
    secondaryColor: "#d97706",
  },
  baseCards: [
    {
      id: "cas-001",
      name: "Casino Floor",
      count: 3,
      cells: [
        [cell("commercial"), cell("commercial")],
        [cell("commercial"), cell("commercial")],
      ],
    },
    {
      id: "cas-002",
      name: "Hotel Tower",
      count: 2,
      cells: [
        [cell("residential"), cell("residential")],
        [cell("commercial"), cell("park")],
      ],
    },
    {
      id: "cas-003",
      name: "Entertainment District",
      count: 3,
      cells: [
        [cell("commercial", ROADS.VERTICAL), cell("park")],
        [cell("commercial", ROADS.VERTICAL), cell("residential")],
      ],
    },
    {
      id: "cas-004",
      name: "Service Area",
      count: 2,
      cells: [
        [cell("industrial"), cell("commercial")],
        [cell("park"), cell("residential")],
      ],
    },
  ],
  expansions: [],
};

export const GAME_VARIATIONS: GameVariation[] = [
  SPRAWOPOLIS,
  AGROPOLIS,
  CASINOPOLIS,
];
