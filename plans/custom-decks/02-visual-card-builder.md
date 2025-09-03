# Vertical Slice 2: Deck Editor with Visual Card Builder

## Goal
Create a dedicated deck editor page with integrated visual card building capabilities, allowing users to manage custom decks and design individual cards through modal dialogs.

## User Story
As a player, I want a dedicated workspace to manage my custom decks and visually design cards, so I can efficiently create and organize custom content for my games.

## Deliverables

### 1. Dedicated Deck Editor Page
- Full-screen workspace for deck management and editing
- Deck metadata editor (name, description, theme)
- Visual card grid showing all cards in the deck
- Card count management and deck composition overview
- Integration with existing custom deck storage system

### 2. Visual Card Builder Modal
- Modal-based card builder launched from deck editor
- Visual 2x2 grid representing the 4 zones of a card
- Zone type editor with custom string input and preset suggestions
- Visual road segment drawing tool with click-and-drag interaction
- Real-time card preview matching game's visual style

### 3. Road Drawing System
- Click edges to create road segments between entry/exit points
- Visual feedback for valid road connections
- Road continuity validation across zones
- Undo/redo functionality for card editing

### 4. Card Library Management
- Shared card library accessible from all decks
- Save/load individual card designs
- Duplicate and modify existing cards
- Visual card thumbnails for quick selection
- Card templates and presets

### 5. Seamless Integration
- Add cards from library to active deck
- Create new cards directly for current deck
- Preview cards in actual gameplay style
- Validate deck composition and card designs

## Technical Details

### Component Architecture
```typescript
// Main deck editor page
interface DeckEditorProps {
  deckId?: string; // Optional for creating new decks
}

// Deck editor main interface
interface DeckEditorMainProps {
  deck: CustomDeck;
  onDeckUpdate: (deck: CustomDeck) => void;
  onCardEdit: (card: CardDefinition) => void;
  onCardAdd: () => void;
}

// Card builder modal
interface CardBuilderModalProps {
  isOpen: boolean;
  card?: CardDefinition;
  onSave: (card: CardDefinition) => void;
  onClose: () => void;
}

// Visual zone editor (within modal)
interface ZoneEditorProps {
  zone: Zone;
  position: ZonePosition;
  onZoneChange: (zone: Zone) => void;
  onRoadSegmentAdd: (segment: RoadSegment) => void;
}

// Road drawing interface (within modal)
interface RoadEditorProps {
  zones: Zone[];
  onRoadChange: (zoneId: string, segments: RoadSegment[]) => void;
  selectedTool: 'zone' | 'road';
}
```

### Visual Card Representation
- Reuse existing `CardPreview` component styling
- SVG-based drawing for precise road placement
- Zone color coding matching game theme
- Grid lines and edge markers for road drawing
- Hover states and selection feedback

### Road Segment Logic
```typescript
interface RoadDrawingState {
  isDrawing: boolean;
  startEdge: Edge | null;
  startZone: string | null;
  previewSegment: RoadSegment | null;
}

// Validation functions
const validateRoadContinuity = (card: CardDefinition): ValidationResult;
const canConnectEdges = (zone1: Zone, edge1: Edge, zone2: Zone, edge2: Edge): boolean;
const getAdjacentZones = (position: ZonePosition, card: CardDefinition): Zone[];
```

### Card Storage
- Extend custom decks store to include individual card library
- Local storage for user's custom card templates
- Import/export individual card designs
- Version tracking for card modifications
- Separate card library from deck-specific cards

## UI/UX Design

### Main Deck Editor Layout
```
┌─────────────────────────────────────────────────────┐
│  Deck Editor - [Deck Name]                    [Save]│
├─────────────────────────────────────────────────────┤
│  Deck Info Panel                                    │
│  Name: [_______________] Theme: [Primary] [Second]  │
│  Desc: [_________________________________________]  │
├─────────────────────────────────────────────────────┤
│  Cards in Deck (15 cards)        [+Add] [Library]  │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐  │
│  │Card │Card │Card │Card │Card │Card │Card │Card │  │
│  │ x3  │ x2  │ x4  │ x1  │ x2  │ x1  │ x3  │ x2  │  │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘  │
│  [Edit] [Duplicate] [Delete]                        │
└─────────────────────────────────────────────────────┘
```

### Card Builder Modal Layout
```
┌─────────────────────────────────────────────────────┐
│  Card Builder - [Card Name]           [Save][Cancel]│
├─────────────────┬───────────────────────────────────┤
│  Builder Tools  │          Card Preview             │
│                 │                                   │
│  ┌─────┬─────┐  │      ┌─────┬─────┐                │
│  │ TL  │ TR  │  │      │     │     │                │
│  ├─────┼─────┤  │      ├─────┼─────┤                │
│  │ BL  │ BR  │  │      │     │     │                │
│  └─────┴─────┘  │      └─────┴─────┘                │
│                 │                                   │
│  Zone Controls  │      [Actual Scale Preview]       │
│  Tool: [Zone]   │                                   │
│  Type: [____]   │      Validation:                  │
│  [Presets...]   │      ✓ All zones defined         │
│                 │      ⚠ No road connections       │
└─────────────────┴───────────────────────────────────┘
```

### Road Drawing UX
1. **Select Road Tool**: Click "Road" button to enter drawing mode
2. **Click Edge**: Click any zone edge to start road segment
3. **Drag to Target**: Drag to another edge to complete segment
4. **Visual Feedback**: Show preview line while dragging
5. **Validation**: Highlight valid/invalid connection targets
6. **Completion**: Click to finish segment, auto-switch to select mode

### Deck Editor UX Flow
1. **Access Deck Editor**: From game setup "Manage Decks" → "Edit Deck"
2. **Edit Deck Info**: Modify name, description, theme colors
3. **Manage Cards**: View all cards in deck with counts
4. **Add Cards**: From library or create new via modal
5. **Card Actions**: Edit, duplicate, delete individual cards

### Card Builder Modal UX
1. **Open Modal**: Click "Add Card" or "Edit Card" from deck editor
2. **Select Zone**: Click on any of the 4 zone quadrants
3. **Edit Properties**: Side panel shows zone type input
4. **Custom Types**: Text input with autocomplete suggestions
5. **Visual Update**: Zone color updates in real-time
6. **Preset Categories**: Buttons for common types (residential, commercial, etc.)
7. **Save/Cancel**: Modal actions to commit or discard changes

## Acceptance Criteria

### Deck Editor Page
1. ✅ User can navigate to dedicated deck editor page
2. ✅ User can edit deck metadata (name, description, theme)
3. ✅ User can view all cards in deck with visual previews
4. ✅ User can see card counts and deck composition summary
5. ✅ User can save deck changes and return to game setup

### Card Builder Modal
6. ✅ User can open card builder modal from deck editor
7. ✅ User can create a new blank card and see 2x2 grid
8. ✅ User can click on zones to edit their types
9. ✅ Zone type changes are reflected visually in real-time
10. ✅ User can draw road segments by clicking edges
11. ✅ Road drawing shows visual feedback and validation
12. ✅ Invalid road connections are prevented with clear feedback

### Integration & Management
13. ✅ User can save cards and add them to current deck
14. ✅ User can access shared card library from any deck
15. ✅ Card preview in builder matches actual in-game appearance
16. ✅ User can edit, duplicate, and delete cards from deck
17. ✅ User can export/import individual card designs

## File Changes Required

### New Files
- `pages/deck-editor/+Page.tsx` - Main deck editor page
- `components/deck-editor/DeckEditor.tsx` - Main deck editing interface
- `components/deck-editor/CardGrid.tsx` - Visual card grid display
- `components/deck-editor/DeckMetadataEditor.tsx` - Deck info editing
- `components/card-builder/CardBuilderModal.tsx` - Modal card builder
- `components/card-builder/ZoneEditor.tsx` - Individual zone editing
- `components/card-builder/RoadEditor.tsx` - Road drawing functionality
- `components/shared/CardLibrary.tsx` - Shared card library component
- `stores/deckEditorStore.ts` - Deck editor state management
- `stores/cardLibraryStore.ts` - Shared card library state
- `utils/cardValidation.ts` - Card design validation
- `utils/roadDrawing.ts` - Road drawing utilities

### Modified Files
- `stores/customDecksStore.ts` - Add card library integration
- `components/game/CardPreview.tsx` - Ensure reusability for editor
- `components/GameSetup.tsx` - Add link to deck editor
- `types/game.ts` - Extend card interfaces if needed

## Navigation Integration
- Add "Deck Editor" link to main navigation
- Link from game setup "Manage Decks" to deck editor
- Direct deck editing via URL: `/deck-editor?deckId=<id>`
- Create new deck via URL: `/deck-editor` (no deckId)
- Breadcrumb navigation: Game Setup → Deck Editor → Card Builder Modal
- Return to Game Setup after saving deck changes

## Testing Strategy
- Unit tests for road segment validation logic
- Component tests for zone editing interactions within modals
- Integration tests for deck editor and card library functionality
- Modal behavior tests (open/close, data persistence)
- Visual regression tests for card preview accuracy
- E2E tests for complete deck creation and editing workflow

## Success Metrics
- User can access and navigate deck editor intuitively
- Deck editing workflow feels natural and efficient
- Card builder modal provides focused editing experience
- User can create visually appealing custom cards in under 2 minutes
- Road drawing feels intuitive with minimal learning curve
- Card preview exactly matches in-game rendering
- No performance issues with real-time visual updates
- Seamless integration between deck editor and card builder
- Custom decks work flawlessly when used in games