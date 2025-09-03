import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomDeck } from '../types/deck';

interface CustomDecksStore {
  customDecks: CustomDeck[];
  selectedCustomDeck: CustomDeck | null;
  
  // Actions
  addDeck: (deck: Omit<CustomDeck, 'id'>) => string;
  updateDeck: (id: string, updates: Partial<CustomDeck>) => void;
  deleteDeck: (id: string) => void;
  selectDeck: (deck: CustomDeck | null) => void;
  
  // Import/Export
  exportDeck: (id: string) => string;
  importDeck: (jsonString: string) => Promise<void>;
  duplicateDeck: (id: string) => void;
  
  // Utility
  getDeckById: (id: string) => CustomDeck | undefined;
}

const generateId = () => {
  return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useCustomDecksStore = create<CustomDecksStore>()(
  persist(
    (set, get) => ({
      customDecks: [],
      selectedCustomDeck: null,

      addDeck: (deck) => {
        const newDeckId = generateId();
        const newDeck: CustomDeck = {
          ...deck,
          id: newDeckId,
          type: 'custom',
          isCustom: true,
          metadata: {
            ...deck.metadata,
            created: new Date(),
            modified: new Date(),
          },
        };

        set((state) => ({
          customDecks: [...state.customDecks, newDeck],
        }));
        
        return newDeckId;
      },

      updateDeck: (id, updates) => {
        set((state) => ({
          customDecks: state.customDecks.map((deck) =>
            deck.id === id
              ? {
                  ...deck,
                  ...updates,
                  metadata: {
                    ...deck.metadata,
                    ...updates.metadata,
                    modified: new Date(),
                  },
                }
              : deck
          ),
        }));
      },

      deleteDeck: (id) => {
        set((state) => ({
          customDecks: state.customDecks.filter((deck) => deck.id !== id),
          selectedCustomDeck:
            state.selectedCustomDeck?.id === id ? null : state.selectedCustomDeck,
        }));
      },

      selectDeck: (deck) => {
        set({ selectedCustomDeck: deck });
      },

      exportDeck: (id) => {
        const deck = get().getDeckById(id);
        if (!deck) {
          throw new Error('Deck not found');
        }

        const exportData = {
          ...deck,
          exportVersion: '1.0',
          exportedAt: new Date().toISOString(),
        };

        return JSON.stringify(exportData, null, 2);
      },

      importDeck: async (jsonString) => {
        try {
          const importedData = JSON.parse(jsonString);
          
          // Validate the imported data structure
          if (!importedData.name || !importedData.baseCards || !Array.isArray(importedData.baseCards)) {
            throw new Error('Invalid deck format: missing required fields');
          }

          if (importedData.baseCards.length === 0) {
            throw new Error('Deck must contain at least one card');
          }

          // Check for duplicate deck names
          const existingNames = get().customDecks.map(deck => deck.name.toLowerCase());
          let deckName = importedData.name;
          let counter = 1;
          
          while (existingNames.includes(deckName.toLowerCase())) {
            deckName = `${importedData.name} (${counter})`;
            counter++;
          }

          const newDeck: Omit<CustomDeck, 'id'> = {
            name: deckName,
            description: importedData.description || 'Imported custom deck',
            type: 'custom',
            isCustom: true,
            baseCards: importedData.baseCards,
            expansions: importedData.expansions || [],
            zoneTypes: importedData.zoneTypes || [
              { id: 'residential', name: 'Residential', color: '#60a5fa', description: 'Housing areas' },
              { id: 'commercial', name: 'Commercial', color: '#f59e0b', description: 'Business districts' },
              { id: 'industrial', name: 'Industrial', color: '#6b7280', description: 'Manufacturing zones' },
              { id: 'park', name: 'Park', color: '#34d399', description: 'Green spaces' },
            ],
            theme: importedData.theme || {
              primaryColor: '#8b5cf6',
              secondaryColor: '#7c3aed'
            },
            metadata: {
              author: importedData.metadata?.author || 'Unknown',
              created: new Date(),
              modified: new Date(),
              version: importedData.metadata?.version || '1.0',
            },
          };

          get().addDeck(newDeck);
        } catch (error) {
          if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON format');
          }
          throw error;
        }
      },

      duplicateDeck: (id) => {
        const deck = get().getDeckById(id);
        if (!deck) {
          throw new Error('Deck not found');
        }

        const existingNames = get().customDecks.map(d => d.name.toLowerCase());
        let newName = `${deck.name} (Copy)`;
        let counter = 1;
        
        while (existingNames.includes(newName.toLowerCase())) {
          newName = `${deck.name} (Copy ${counter})`;
          counter++;
        }

        const duplicatedDeck: Omit<CustomDeck, 'id'> = {
          ...deck,
          name: newName,
          metadata: {
            ...deck.metadata,
            created: new Date(),
            modified: new Date(),
          },
        };

        get().addDeck(duplicatedDeck);
      },

      getDeckById: (id) => {
        const deck = get().customDecks.find((deck) => deck.id === id);
        // Ensure customScoringConditions field exists for backward compatibility
        if (deck && !deck.customScoringConditions) {
          deck.customScoringConditions = [];
        }
        return deck;
      },
    }),
    {
      name: 'custom-decks-storage',
      version: 1,
    }
  )
);