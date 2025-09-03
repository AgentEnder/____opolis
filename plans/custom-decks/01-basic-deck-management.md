# Vertical Slice 1: Basic Deck Management

## Goal
Add basic custom deck storage, listing, and selection functionality that users can see and interact with immediately.

## User Story
As a player, I want to create, name, and select custom decks so I can play with my own card combinations instead of only the preset variations.

## Deliverables

### 1. Data Models
- Extend existing `GameVariation` interface to support custom decks
- Create `CustomDeck` interface that integrates with existing card system
- Add validation for custom deck format compatibility

### 2. Storage System
- Zustand store for custom deck management (`useCustomDecksStore`)
- Local storage persistence for user's custom decks
- Import/export JSON functionality for deck sharing

### 3. UI Components
- Custom deck selector in `GameSetup` component
- Basic deck creation modal with name and description
- Deck management interface (list, edit, delete, duplicate)

### 4. Integration Points
- Extend `GameSetup.tsx` to show custom decks alongside existing variations
- Update game initialization to handle custom deck cards
- Ensure custom decks work with existing scoring system

## Technical Details

### Data Structure Integration
```typescript
interface CustomDeck extends GameVariation {
  id: string;
  type: 'custom';
  isCustom: true;
  cards: CardDefinition[];
  metadata: {
    author: string;
    created: Date;
    modified: Date;
    version: string;
  };
}
```

### Zustand Store
```typescript
interface CustomDecksStore {
  customDecks: CustomDeck[];
  selectedCustomDeck: CustomDeck | null;
  
  // Actions
  addDeck: (deck: Omit<CustomDeck, 'id'>) => void;
  updateDeck: (id: string, updates: Partial<CustomDeck>) => void;
  deleteDeck: (id: string) => void;
  selectDeck: (deck: CustomDeck | null) => void;
  
  // Import/Export
  exportDeck: (id: string) => string; // JSON string
  importDeck: (jsonString: string) => Promise<void>;
}
```

### UI Enhancement in GameSetup
- Add "Custom Decks" section below existing variations
- Show custom deck cards count and preview
- Allow mixing custom decks with preset variations
- Validation that ensures minimum card count for gameplay

## Acceptance Criteria

1. ✅ User can create a new custom deck with name and description
2. ✅ Custom decks appear in game setup alongside preset variations
3. ✅ User can select custom deck and start a game successfully
4. ✅ Custom decks persist between browser sessions
5. ✅ User can export custom deck as JSON file
6. ✅ User can import previously exported deck JSON
7. ✅ Invalid deck imports show helpful error messages
8. ✅ Custom deck games use existing scoring system without issues

## File Changes Required

### New Files
- `stores/customDecksStore.ts` - Zustand store for deck management
- `components/deck-management/CustomDeckSelector.tsx` - Deck selection UI
- `components/deck-management/DeckImportExport.tsx` - Import/export functionality
- `utils/deckValidation.ts` - Deck format validation utilities

### Modified Files
- `components/game/GameSetup.tsx` - Add custom deck selection
- `types/deck.ts` - Extend interfaces for custom decks
- `utils/gameLogic.ts` - Support custom deck initialization

## Testing Strategy
- Unit tests for deck validation and storage
- Integration tests for game setup with custom decks
- E2E tests for complete create → select → play flow
- Edge case testing for invalid imports and storage limits

## Success Metrics
- User can complete the full cycle: create deck → export → import → play
- Custom decks integrate seamlessly with existing game flow
- No performance degradation when managing multiple custom decks
- Error handling provides clear feedback for invalid operations