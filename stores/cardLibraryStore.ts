import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CellData, CellType, RoadSegment } from '../types/game';
import { CardDefinition } from '../types/deck';

interface CardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'residential' | 'commercial' | 'industrial' | 'mixed' | 'roads';
  card: Omit<CardDefinition, 'id' | 'count'>;
  isUserCreated: boolean;
  created: Date;
}

interface CardLibraryStore {
  cardTemplates: CardTemplate[];
  
  // Actions
  addTemplate: (template: Omit<CardTemplate, 'id' | 'created'>) => void;
  updateTemplate: (id: string, updates: Partial<CardTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplate: (id: string) => CardTemplate | undefined;
  getTemplatesByCategory: (category: string) => CardTemplate[];
  
  // Preset creation
  initializePresets: () => void;
}

// Helper function for creating cells
const cell = (type: CellType, roads: RoadSegment[] = []): CellData => ({ type, roads });

// Common road patterns
const ROADS = {
  NONE: [] as RoadSegment[],
  HORIZONTAL: [[3, 1] as RoadSegment],
  VERTICAL: [[0, 2] as RoadSegment],
  L_TOP_RIGHT: [[0, 1] as RoadSegment],
  L_RIGHT_BOTTOM: [[1, 2] as RoadSegment],
  L_BOTTOM_LEFT: [[2, 3] as RoadSegment],
  L_LEFT_TOP: [[3, 0] as RoadSegment],
};

// Preset card templates
const PRESET_TEMPLATES: Omit<CardTemplate, 'id' | 'created'>[] = [
  // Residential templates
  {
    name: 'Residential Block',
    description: 'Dense residential area with park',
    category: 'residential',
    isUserCreated: false,
    card: {
      name: 'Residential Block',
      cells: [
        [cell('residential'), cell('residential')],
        [cell('residential'), cell('park')]
      ]
    }
  },
  {
    name: 'Suburb',
    description: 'Residential area with connecting roads',
    category: 'residential',
    isUserCreated: false,
    card: {
      name: 'Suburb',
      cells: [
        [cell('residential', ROADS.HORIZONTAL), cell('residential', ROADS.HORIZONTAL)],
        [cell('park'), cell('residential')]
      ]
    }
  },
  
  // Commercial templates
  {
    name: 'Shopping Center',
    description: 'Large commercial development',
    category: 'commercial',
    isUserCreated: false,
    card: {
      name: 'Shopping Center',
      cells: [
        [cell('commercial'), cell('commercial')],
        [cell('commercial'), cell('park')]
      ]
    }
  },
  {
    name: 'Main Street',
    description: 'Commercial strip with vertical road',
    category: 'commercial',
    isUserCreated: false,
    card: {
      name: 'Main Street',
      cells: [
        [cell('commercial', ROADS.VERTICAL), cell('park')],
        [cell('commercial', ROADS.VERTICAL), cell('commercial')]
      ]
    }
  },
  
  // Industrial templates
  {
    name: 'Factory District',
    description: 'Heavy industrial area',
    category: 'industrial',
    isUserCreated: false,
    card: {
      name: 'Factory District',
      cells: [
        [cell('industrial'), cell('industrial')],
        [cell('industrial'), cell('park')]
      ]
    }
  },
  {
    name: 'Warehouse',
    description: 'Industrial with road access',
    category: 'industrial',
    isUserCreated: false,
    card: {
      name: 'Warehouse',
      cells: [
        [cell('industrial', ROADS.L_TOP_RIGHT), cell('commercial')],
        [cell('park'), cell('industrial')]
      ]
    }
  },
  
  // Mixed development templates
  {
    name: 'Mixed Use',
    description: 'Balanced mixed development',
    category: 'mixed',
    isUserCreated: false,
    card: {
      name: 'Mixed Use',
      cells: [
        [cell('commercial'), cell('residential')],
        [cell('park'), cell('industrial')]
      ]
    }
  },
  
  // Road templates
  {
    name: 'Intersection',
    description: 'Four-way intersection with development',
    category: 'roads',
    isUserCreated: false,
    card: {
      name: 'Intersection',
      cells: [
        [cell('park', ROADS.L_LEFT_TOP), cell('commercial', ROADS.L_TOP_RIGHT)],
        [cell('residential', ROADS.L_BOTTOM_LEFT), cell('industrial', ROADS.L_RIGHT_BOTTOM)]
      ]
    }
  },
  {
    name: 'Highway',
    description: 'Straight road through development',
    category: 'roads',
    isUserCreated: false,
    card: {
      name: 'Highway',
      cells: [
        [cell('park', ROADS.HORIZONTAL), cell('commercial', ROADS.HORIZONTAL)],
        [cell('residential'), cell('industrial')]
      ]
    }
  }
];

const generateId = () => {
  return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useCardLibraryStore = create<CardLibraryStore>()(
  persist(
    (set, get) => ({
      cardTemplates: [],

      addTemplate: (template) => {
        const newTemplate: CardTemplate = {
          ...template,
          id: generateId(),
          created: new Date(),
        };

        set((state) => ({
          cardTemplates: [...state.cardTemplates, newTemplate],
        }));
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          cardTemplates: state.cardTemplates.map((template) =>
            template.id === id ? { ...template, ...updates } : template
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          cardTemplates: state.cardTemplates.filter((template) => template.id !== id),
        }));
      },

      getTemplate: (id) => {
        return get().cardTemplates.find((template) => template.id === id);
      },

      getTemplatesByCategory: (category) => {
        return get().cardTemplates.filter((template) => template.category === category);
      },

      initializePresets: () => {
        const existingTemplates = get().cardTemplates;
        if (existingTemplates.length > 0) return; // Already initialized

        const presetTemplates: CardTemplate[] = PRESET_TEMPLATES.map((preset) => ({
          ...preset,
          id: generateId(),
          created: new Date(),
        }));

        set({ cardTemplates: presetTemplates });
      },
    }),
    {
      name: 'card-library-storage',
      version: 1,
    }
  )
);