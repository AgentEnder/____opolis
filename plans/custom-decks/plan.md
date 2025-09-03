# Custom Deck Editor System Plan

## Overview
A deck-editor system that allows players to create, customize, import, and export their own card decks for the game. Each card represents a zone configuration with roadways, and can optionally be associated with scoring conditions.

## Core Features

### 1. Card Creation & Editing
- **Zone Configuration**
  - Define 4 zones per card (one per quadrant)
  - Set zone type (custom string)
  - Visual card preview during creation
  
- **Road Editor (Visual)**
  - Click-and-drag to draw road segments through zones
  - Roads defined by entry and exit edges of each zone
  - Automatic validation of road continuity across zones
  - Visual feedback showing connected/disconnected segments
  - Snap-to-edge for precise road placement

- **Scoring Conditions (Optional)**
  - Associate scoring rules with cards
  - Define conditions like:
    - Zone adjacency bonuses
    - Roadway connection multipliers
    - Pattern completion rewards
    - Special card interactions
  - Visual indicators for cards with scoring conditions

### 2. Deck Management
- **Deck Operations**
  - Create new decks
  - Edit existing decks
  - Delete decks
  - Duplicate decks as templates
  - Name and describe decks

- **Card Organization**
  - Add/remove cards from deck
  - Set card quantities/frequencies
  - Categorize cards (e.g., common, rare, special)
  - Search and filter cards within deck

### 3. Import/Export System
- **File Format**
  - JSON-based deck format for easy sharing
  - Include metadata (name, author, version, description)
  - Validate imported decks for compatibility

- **Sharing Features**
  - Export deck to file
  - Import deck from file
  - Share deck via URL/code (future enhancement)
  - Browse community decks (future enhancement)

### 4. Game Integration
- **Pre-Game Setup**
  - Select from available decks (default + custom)
  - Upload custom deck file
  - Quick create option for immediate deck building
  - Preview deck contents before game start

- **In-Game Usage**
  - Load custom deck cards during gameplay
  - Apply custom scoring conditions
  - Maintain deck state throughout game

## Technical Architecture

### Data Models

```typescript
type Edge = 'north' | 'south' | 'east' | 'west';

interface RoadSegment {
  entryEdge: Edge;
  exitEdge: Edge;
}

interface Zone {
  id: string;
  type: string; // Custom zone types (e.g., "residential", "factory", "mystical-forest")
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; // Quadrant on card
  roadSegments: RoadSegment[]; // Road segments passing through this zone
  customProperties?: Record<string, any>; // Extensible for custom zone mechanics
}

interface ScoringCondition {
  id: string;
  name: string;
  description: string;
  type: 'adjacency' | 'pattern' | 'roadway' | 'zone-type' | 'custom';
  formula: string; // TypeScript code that compiles to sandboxed JS
  compiledFormula?: string; // Transpiled JS ready for sandbox execution
  visualHint?: string; // Help text for players
}

interface Card {
  id: string;
  name: string;
  zones: [Zone, Zone, Zone, Zone];
  scoringConditions?: ScoringCondition[];
  metadata: {
    author?: string;
    created: Date;
    modified: Date;
    tags?: string[];
  };
}

interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  metadata: {
    version: string;
    author: string;
    created: Date;
    modified: Date;
  };
}
```

### State Management (Zustand)
- `useDeckEditorStore`: Managing deck creation/editing state
- `useCustomDecksStore`: Storing user's custom decks
- `useGameDeckStore`: Active deck during gameplay

### Component Structure
```
components/
  deck-editor/
    DeckEditor.tsx          # Main editor container
    CardBuilder.tsx         # Individual card creation
    ZoneEditor.tsx          # Zone type configuration
    RoadEditor.tsx          # Visual road segment editor
    ScoringEditor.tsx       # Scoring condition builder
    DeckPreview.tsx         # Visual deck overview
    ImportExport.tsx        # Import/export functionality
  
  game-setup/
    DeckSelector.tsx        # Pre-game deck selection
    CustomDeckUpload.tsx    # Upload custom deck file
    QuickDeckBuilder.tsx    # Rapid deck creation
```

## Implementation Phases

### Phase 1: Basic Card Builder
- [ ] Create card data model
- [ ] Build zone editor UI
- [ ] Implement card preview
- [ ] Basic card CRUD operations

### Phase 2: Deck Management
- [ ] Deck creation and editing
- [ ] Card collection management
- [ ] Local storage persistence
- [ ] Deck listing and selection

### Phase 3: Import/Export
- [ ] Define deck file format
- [ ] Implement export to JSON
- [ ] Implement import with validation
- [ ] Error handling for invalid decks

### Phase 4: Game Integration
- [ ] Update game setup UI
- [ ] Integrate deck selector
- [ ] Load custom cards in game
- [ ] Test gameplay with custom decks

### Phase 5: Scoring System
- [ ] Design scoring condition builder
- [ ] Integrate TypeScript editor (Monaco or CodeMirror)
- [ ] Implement TypeScript to JS transpilation
- [ ] Create sandboxed execution environment
- [ ] Define scoring API/context for formulas
- [ ] Integrate with game scoring engine
- [ ] Visual feedback for scoring events

### Phase 6: Polish & Enhancement
- [ ] Improve UI/UX with animations
- [ ] Add deck templates
- [ ] Implement deck sharing features
- [ ] Performance optimization

## UI/UX Considerations

### Deck Editor Interface
- Split view: card builder on left, deck overview on right
- Tabbed interface for different editing modes
- Real-time preview of changes
- Undo/redo functionality
- Keyboard shortcuts for power users

### Visual Road Editor
- **Grid-based card display**: 2x2 grid representing the 4 zones
- **Drawing modes**:
  - Click on edge to start road, click another edge to complete segment
  - Drag from edge to edge for continuous drawing
  - Hold shift for straight roads only
- **Visual feedback**:
  - Highlight valid edge targets while drawing
  - Show road continuity with color coding (green = connected, red = dead end)
  - Preview road flow with animated directional indicators
- **Validation**:
  - Ensure roads connect properly between adjacent zones
  - Warn about impossible configurations
  - Show traffic flow simulation

### Visual Design
- Card visualization matching game aesthetic
- Clear zone boundaries and roadway indicators
- Color coding for different card types/rarities
- Intuitive drag-and-drop interactions
- Responsive design for mobile editing

### User Workflows
1. **New Player**: Quick templates → Minor customization → Export
2. **Advanced Player**: Create from scratch → Complex scoring → Share
3. **Importing Player**: Upload file → Preview → Play

## File Structure Example

```json
{
  "version": "1.0.0",
  "deck": {
    "id": "custom-deck-001",
    "name": "City Builder Special",
    "description": "A balanced deck focused on zone adjacency",
    "metadata": {
      "author": "Player123",
      "created": "2024-01-15T10:00:00Z",
      "modified": "2024-01-15T10:00:00Z"
    },
    "cards": [
      {
        "id": "card-001",
        "name": "Industrial Complex",
        "zones": [
          { 
            "id": "z1", 
            "type": "heavy-industrial",
            "position": "top-left",
            "roadSegments": [
              { "entryEdge": "west", "exitEdge": "east" }
            ]
          },
          { 
            "id": "z2", 
            "type": "light-industrial",
            "position": "top-right",
            "roadSegments": [
              { "entryEdge": "west", "exitEdge": "south" }
            ]
          },
          { 
            "id": "z3", 
            "type": "commercial-district",
            "position": "bottom-left",
            "roadSegments": [
              { "entryEdge": "north", "exitEdge": "east" },
              { "entryEdge": "west", "exitEdge": "south" }
            ]
          },
          { 
            "id": "z4", 
            "type": "residential",
            "position": "bottom-right",
            "roadSegments": [
              { "entryEdge": "west", "exitEdge": "north" }
            ]
          }
        ],
        "scoringConditions": [
          {
            "id": "sc-001",
            "name": "Industrial Synergy",
            "type": "custom",
            "description": "Score based on industrial zone connections",
            "formula": "// TypeScript scoring function\nconst industrial = zones.filter(z => z.type.includes('industrial'));\nconst bonus = industrial.length * 3;\nreturn bonus + (hasRoadConnection(industrial) ? 5 : 0);",
            "compiledFormula": "(function(){const industrial=zones.filter(z=>z.type.includes('industrial'));const bonus=industrial.length*3;return bonus+(hasRoadConnection(industrial)?5:0);})()"
          }
        ]
      }
    ]
  }
}
```

## TypeScript Editor & Sandboxed Execution

### In-Browser TypeScript Editor
- **Editor Choice**: Monaco Editor (VS Code's editor) or CodeMirror with TypeScript support
- **Features**:
  - Syntax highlighting and IntelliSense
  - Type checking and error reporting
  - Auto-completion for scoring API
  - Real-time validation
  - Code snippets and templates

### Scoring API Context
```typescript
// Available in scoring formulas
interface ScoringContext {
  // Current card and zone data
  zones: Zone[];
  card: Card;
  
  // Game state
  board: BoardState;
  adjacentZones: Zone[];
  connectedZones: Zone[];
  
  // Utility functions
  hasRoadConnection: (zones: Zone[]) => boolean;
  countZoneType: (type: string) => number;
  getAdjacentOfType: (zone: Zone, type: string) => Zone[];
  calculateDistance: (zone1: Zone, zone2: Zone) => number;
  
  // Scoring helpers
  baseScore: number;
  multiplier: number;
}
```

### Transpilation Pipeline
1. **Write**: User writes TypeScript in Monaco editor
2. **Validate**: Real-time type checking and linting
3. **Transpile**: On save, use TypeScript compiler API to convert to JS
4. **Minify**: Optional minification for storage efficiency
5. **Store**: Save both source and compiled versions

### Sandbox Execution
- **Security**: Use Web Workers or iframe sandbox for isolation
- **Context Injection**: Provide limited, safe game state access
- **Timeout Protection**: Prevent infinite loops with execution limits
- **Error Handling**: Graceful failure with fallback scoring
- **Performance**: Cache compiled functions, batch executions

### Example Implementation
```typescript
// Sandbox executor
class ScoringSandbox {
  private worker: Worker;
  
  async execute(
    compiledFormula: string, 
    context: ScoringContext
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      // Set timeout for execution
      const timeout = setTimeout(() => {
        reject(new Error('Scoring formula timeout'));
      }, 100); // 100ms max execution time
      
      // Execute in worker
      this.worker.postMessage({
        formula: compiledFormula,
        context: sanitizeContext(context)
      });
      
      this.worker.onmessage = (event) => {
        clearTimeout(timeout);
        resolve(event.data.result);
      };
    });
  }
}
```

## Testing Strategy
- Unit tests for deck validation logic
- Integration tests for import/export
- E2E tests for complete deck creation workflow
- Performance tests for large decks
- Compatibility tests for different deck versions

## Future Enhancements
- Online deck sharing marketplace
- Deck rating and reviews
- Tournament-legal deck validation
- AI deck suggestions based on play style
- Deck statistics and analytics
- Card rarity and collection mechanics
- Themed deck packs