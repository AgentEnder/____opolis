import { create } from 'zustand';
import { CardDefinition, CustomDeck } from '../types/deck';
import { CustomScoringCondition } from '../types/scoring-formulas';
import { MetadataSchema, CustomMetadata } from '../types/metadataSystem';

interface DeckEditorState {
  // Current editing state
  currentDeck: CustomDeck | null;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  
  // Card builder modal state
  isCardBuilderOpen: boolean;
  editingCard: CardDefinition | null;
  editingCardIndex: number | null; // For editing existing cards
  
  // UI state
  draggedCard: CardDefinition | null;
  
  // History for undo/redo
  undoStack: CardDefinition[];
  redoStack: CardDefinition[];
}

interface DeckEditorStore extends DeckEditorState {
  // Deck management
  setCurrentDeck: (deck: CustomDeck | null) => void;
  updateDeckMetadata: (updates: Partial<Pick<CustomDeck, 'name' | 'description' | 'theme' | 'zoneTypes'>>) => void;
  updateMetadataSchema: (schema: MetadataSchema) => void;
  markUnsavedChanges: (hasChanges: boolean) => void;
  
  // Card management
  addCardToDeck: (card: CardDefinition) => void;
  updateCardInDeck: (index: number, card: CardDefinition) => void;
  updateCardMetadata: (index: number, metadata: CustomMetadata) => void;
  removeCardFromDeck: (index: number) => void;
  duplicateCardInDeck: (index: number) => void;
  
  // Card builder modal
  openCardBuilder: (card?: CardDefinition, index?: number) => void;
  closeCardBuilder: () => void;
  setEditingCard: (card: CardDefinition | null) => void;
  
  // Scoring conditions management
  addScoringCondition: (condition: CustomScoringCondition) => void;
  updateScoringCondition: (conditionId: string, updates: Partial<CustomScoringCondition>) => void;
  removeScoringCondition: (conditionId: string) => void;
  getScoringCondition: (conditionId: string) => CustomScoringCondition | undefined;
  
  
  // Card dragging
  setDraggedCard: (card: CardDefinition | null) => void;
  
  // History management
  pushToUndo: (card: CardDefinition) => void;
  undo: () => CardDefinition | null;
  redo: () => CardDefinition | null;
  clearHistory: () => void;
  
  // Reset
  reset: () => void;
}

const initialState: DeckEditorState = {
  currentDeck: null,
  isEditing: false,
  hasUnsavedChanges: false,
  isCardBuilderOpen: false,
  editingCard: null,
  editingCardIndex: null,
  draggedCard: null,
  undoStack: [],
  redoStack: [],
};

const generateCardId = () => {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useDeckEditorStore = create<DeckEditorStore>((set, get) => ({
  ...initialState,

  setCurrentDeck: (deck) => {
    set({ 
      currentDeck: deck,
      isEditing: deck !== null,
      hasUnsavedChanges: false,
    });
  },

  updateDeckMetadata: (updates) => {
    const { currentDeck } = get();
    if (!currentDeck) return;

    const updatedDeck: CustomDeck = {
      ...currentDeck,
      ...updates,
      metadata: {
        ...currentDeck.metadata,
        modified: new Date(),
      },
    };

    set({ 
      currentDeck: updatedDeck,
      hasUnsavedChanges: true,
    });
  },

  markUnsavedChanges: (hasChanges) => {
    set({ hasUnsavedChanges: hasChanges });
  },

  updateMetadataSchema: (schema) => {
    const { currentDeck } = get();
    if (!currentDeck) return;

    const updatedDeck: CustomDeck = {
      ...currentDeck,
      metadataSchema: schema,
      metadata: {
        ...currentDeck.metadata,
        modified: new Date(),
      },
    };

    set({ 
      currentDeck: updatedDeck,
      hasUnsavedChanges: true,
    });
  },

  addCardToDeck: (card) => {
    const { currentDeck } = get();
    if (!currentDeck) return;

    const cardWithId: CardDefinition = {
      ...card,
      id: card.id || generateCardId(),
    };

    const updatedDeck: CustomDeck = {
      ...currentDeck,
      baseCards: [...currentDeck.baseCards, cardWithId],
      metadata: {
        ...currentDeck.metadata,
        modified: new Date(),
      },
    };

    set({ 
      currentDeck: updatedDeck,
      hasUnsavedChanges: true,
    });
  },

  updateCardInDeck: (index, card) => {
    const { currentDeck } = get();
    if (!currentDeck || index < 0 || index >= currentDeck.baseCards.length) return;

    const updatedCards = [...currentDeck.baseCards];
    updatedCards[index] = { ...card, id: card.id || generateCardId() };

    const updatedDeck: CustomDeck = {
      ...currentDeck,
      baseCards: updatedCards,
      metadata: {
        ...currentDeck.metadata,
        modified: new Date(),
      },
    };

    set({ 
      currentDeck: updatedDeck,
      hasUnsavedChanges: true,
    });
  },

  updateCardMetadata: (index, metadata) => {
    const { currentDeck } = get();
    if (!currentDeck || index < 0 || index >= currentDeck.baseCards.length) return;

    const updatedCards = [...currentDeck.baseCards];
    updatedCards[index] = {
      ...updatedCards[index],
      customMetadata: metadata,
    };

    const updatedDeck: CustomDeck = {
      ...currentDeck,
      baseCards: updatedCards,
      metadata: {
        ...currentDeck.metadata,
        modified: new Date(),
      },
    };

    set({ 
      currentDeck: updatedDeck,
      hasUnsavedChanges: true,
    });
  },

  removeCardFromDeck: (index) => {
    const { currentDeck } = get();
    if (!currentDeck || index < 0 || index >= currentDeck.baseCards.length) return;

    const updatedCards = currentDeck.baseCards.filter((_, i) => i !== index);

    const updatedDeck: CustomDeck = {
      ...currentDeck,
      baseCards: updatedCards,
      metadata: {
        ...currentDeck.metadata,
        modified: new Date(),
      },
    };

    set({ 
      currentDeck: updatedDeck,
      hasUnsavedChanges: true,
    });
  },

  duplicateCardInDeck: (index) => {
    const { currentDeck } = get();
    if (!currentDeck || index < 0 || index >= currentDeck.baseCards.length) return;

    const cardToDuplicate = currentDeck.baseCards[index];
    const duplicatedCard: CardDefinition = {
      ...cardToDuplicate,
      id: generateCardId(),
      name: cardToDuplicate.name ? `${cardToDuplicate.name} (Copy)` : undefined,
    };

    const updatedCards = [
      ...currentDeck.baseCards.slice(0, index + 1),
      duplicatedCard,
      ...currentDeck.baseCards.slice(index + 1),
    ];

    const updatedDeck: CustomDeck = {
      ...currentDeck,
      baseCards: updatedCards,
      metadata: {
        ...currentDeck.metadata,
        modified: new Date(),
      },
    };

    set({ 
      currentDeck: updatedDeck,
      hasUnsavedChanges: true,
    });
  },

  openCardBuilder: (card, index) => {
    const { currentDeck } = get();
    const defaultZoneType = currentDeck?.zoneTypes?.[0]?.id || 'residential';
    
    const editingCard = card || {
      id: generateCardId(),
      cells: [
        [{ type: defaultZoneType as any, roads: [] }, { type: defaultZoneType as any, roads: [] }],
        [{ type: defaultZoneType as any, roads: [] }, { type: defaultZoneType as any, roads: [] }],
      ],
      count: 1,
    };

    set({
      isCardBuilderOpen: true,
      editingCard,
      editingCardIndex: index ?? null,
    });
  },

  closeCardBuilder: () => {
    set({
      isCardBuilderOpen: false,
      editingCard: null,
      editingCardIndex: null,
    });
    get().clearHistory();
  },

  setEditingCard: (card) => {
    if (card && get().editingCard) {
      get().pushToUndo(get().editingCard!);
    }
    set({ editingCard: card });
  },

  setDraggedCard: (card) => {
    set({ draggedCard: card });
  },

  pushToUndo: (card) => {
    const { undoStack } = get();
    set({
      undoStack: [...undoStack, card],
      redoStack: [], // Clear redo stack when new action is performed
    });
  },

  undo: () => {
    const { undoStack, redoStack, editingCard } = get();
    if (undoStack.length === 0) return null;

    const previousCard = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    if (editingCard) {
      set({
        editingCard: previousCard,
        undoStack: newUndoStack,
        redoStack: [...redoStack, editingCard],
      });
    }

    return previousCard;
  },

  redo: () => {
    const { redoStack, undoStack, editingCard } = get();
    if (redoStack.length === 0) return null;

    const nextCard = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    if (editingCard) {
      set({
        editingCard: nextCard,
        redoStack: newRedoStack,
        undoStack: [...undoStack, editingCard],
      });
    }

    return nextCard;
  },

  clearHistory: () => {
    set({ undoStack: [], redoStack: [] });
  },

  // Scoring conditions management
  addScoringCondition: (condition) => {
    const { currentDeck } = get();
    if (!currentDeck) return;

    const updatedConditions = [...(currentDeck.customScoringConditions || []), condition];

    const updatedDeck: CustomDeck = {
      ...currentDeck,
      customScoringConditions: updatedConditions,
      metadata: {
        ...currentDeck.metadata,
        modified: new Date(),
      },
    };

    set({ 
      currentDeck: updatedDeck,
      hasUnsavedChanges: true,
    });
  },

  updateScoringCondition: (conditionId, updates) => {
    const { currentDeck } = get();
    if (!currentDeck) return;

    const updatedConditions = (currentDeck.customScoringConditions || []).map(condition =>
      condition.id === conditionId ? { ...condition, ...updates, updatedAt: new Date() } : condition
    );

    const updatedDeck: CustomDeck = {
      ...currentDeck,
      customScoringConditions: updatedConditions,
      metadata: {
        ...currentDeck.metadata,
        modified: new Date(),
      },
    };

    set({ 
      currentDeck: updatedDeck,
      hasUnsavedChanges: true,
    });
  },

  removeScoringCondition: (conditionId) => {
    const { currentDeck } = get();
    if (!currentDeck) return;

    // Remove the condition
    const updatedConditions = (currentDeck.customScoringConditions || []).filter(
      condition => condition.id !== conditionId
    );

    // Remove references from cards
    const updatedCards = currentDeck.baseCards.map(card => {
      if (card.scoringConditionId === conditionId) {
        const { scoringConditionId, ...cardWithoutCondition } = card;
        return cardWithoutCondition;
      }
      return card;
    });

    const updatedDeck: CustomDeck = {
      ...currentDeck,
      baseCards: updatedCards,
      customScoringConditions: updatedConditions,
      metadata: {
        ...currentDeck.metadata,
        modified: new Date(),
      },
    };

    set({ 
      currentDeck: updatedDeck,
      hasUnsavedChanges: true,
    });
  },

  getScoringCondition: (conditionId) => {
    const { currentDeck } = get();
    if (!currentDeck) return undefined;

    return (currentDeck.customScoringConditions || []).find(condition => condition.id === conditionId);
  },

  reset: () => {
    set(initialState);
  },
}));