# Vertical Slice 4: Advanced Deck Editor Features

## Goal
Enhance the dedicated deck editor page with deck testing and balance analysis features for improved deck creation workflow.

## User Story
As a deck creator, I want to test my custom scoring rules and analyze deck balance so I can refine my decks effectively.

## Deliverables

### 1. Rule Testing Environment
- Interactive board setup for testing scoring rules
- Real-time score calculation with current deck
- Visual highlighting of scoring effects on the board
- Single rule isolation for focused testing

### 2. Custom Card Metadata System
- Author-defined custom properties for each card
- Rich metadata types (numbers, text, enums, booleans)
- Visual metadata editor integrated into card designer
- Metadata accessibility in scoring functions via context API

### 3. Deck Analytics Dashboard
- Real-time deck validation and balance analysis
- Zone distribution analysis with visual feedback
- Scoring potential calculations and balance warnings
- Card composition recommendations

## Technical Details

### Enhanced Deck Editor Architecture
```typescript
interface AdvancedDeckEditorState {
  currentDeck: CustomDeck;
  
  // Analytics & Testing
  balanceAnalysis: DeckBalance | null;
  testResults: RuleTestResults | null;
  validationErrors: ValidationError[];
  
  // UI State
  activeTab: 'editor' | 'analytics' | 'testing';
  isDirty: boolean;
}

interface DeckEditorEnhancedProps {
  deckId?: string; // Edit existing deck
}
```

### Card Metadata System
```typescript
interface CustomMetadataField {
  id: string;
  name: string;
  type: 'number' | 'text' | 'boolean' | 'select';
  description?: string;
  defaultValue?: any;
  options?: string[]; // For select type
  min?: number; // For number type
  max?: number; // For number type
  required?: boolean;
}

interface CustomMetadata {
  [fieldId: string]: number | string | boolean;
}

interface EnhancedCard extends CardDefinition {
  customMetadata?: CustomMetadata;
  customScoring?: {
    condition: ScoringCondition;
    visualHints: TileHighlight[];
    description: string;
    expectedScore: number;
  };
}

interface DeckWithMetadata extends CustomDeck {
  cards: EnhancedCard[];
  metadataSchema: CustomMetadataField[]; // Defines available metadata fields
  globalConditions: ScoringCondition[]; // Applied to all cards
  balanceMetrics: DeckBalance;
}
```

### Deck Balance Analysis
```typescript
interface DeckBalance {
  cardCount: number;
  zoneDistribution: Record<string, number>;
  roadComplexity: {
    simple: number;
    medium: number;
    complex: number;
  };
  scoringPotential: {
    min: number;
    max: number;
    average: number;
  };
  recommendedPlayerCount: number[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

class DeckAnalyzer {
  analyzeDeck(deck: DeckWithScoring): DeckBalance {
    // Comprehensive deck analysis
    // Zone type distribution
    // Road network complexity
    // Scoring potential ranges
    // Balance recommendations
  }
  
  suggestImprovements(balance: DeckBalance): Suggestion[] {
    // AI-powered deck improvement suggestions
  }
}
```

### Rule Testing Framework
```typescript
interface RuleTestResults {
  ruleId: string;
  testBoard: Card[];
  calculatedScore: number;
  highlightedTiles: TileHighlight[];
  executionTime: number;
  errors: string[];
}

interface RuleTester {
  testRule(rule: ScoringCondition, board: Card[]): RuleTestResults;
  createTestBoard(deck: CustomDeck, size?: number): Card[];
  highlightScoringTiles(rule: ScoringCondition, board: Card[]): TileHighlight[];
}
```

## UI/UX Design

### Enhanced Deck Editor Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Deck Editor: "My Custom City"              [Save] [Test]   │
├─────────────────────────────────────────────────────────────┤
│  [Editor] [Analytics] [Testing]                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Editor Tab: Card Designer                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Card: "Farm Tile #3"           [Visual Designer]      │ │
│  │  ┌───────────────────┬─────────────────────────────────┐ │ │
│  │  │ Card Zones        │ Custom Metadata                 │ │ │
│  │  │ ▢ Residential     │ Livestock Count: [5    ] 🐄     │ │ │
│  │  │ ▢ Commercial      │ Crop Type: [Wheat  ▼] 🌾       │ │ │
│  │  │ ▢ Roads           │ Seasonal: [☑] Spring Only      │ │ │
│  │  │ ▢ Parks           │ Fertility: [High   ▼] 🌱        │ │ │
│  │  └───────────────────┴─────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  Analytics Tab:                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Deck Balance Analysis                                  │ │
│  │  ⚖️ Overall: Well Balanced (8.2/10)                   │ │
│  │  🎯 Players: 2-4 recommended                           │ │
│  │  📊 Difficulty: Intermediate                           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  Zone Distribution:              Recommendations:            │
│  🏠 Residential: 35% (optimal)   • Add more park zones      │
│  🏢 Commercial: 25% (low)        • Balance road complexity  │
│  🏭 Industrial: 15% (good)       • Consider scoring synergy │
│  🌳 Parks: 25% (good)            • Test individual rules    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Rule Testing Environment
```
┌─────────────────────────────────────────────────────────────┐
│  Testing Tab:                                               │
├─────────────────────────────────────────────────────────────┤
│  Current Rule: "Industrial Zone Bonus" [Select Rule ▼]     │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           Interactive Test Board                        │ │
│  │  [Click to place/remove cards from current deck]       │ │
│  │  [Highlighted tiles show rule scoring effects]         │ │
│  │  [Real-time score calculation: 15 points]             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  Rule Performance:               Board Stats:               │
│  🎯 Score: 15 points            🏠 Cards: 8/20             │
│  ⚡ Execution: 2ms              🛣️ Roads: Connected        │
│  ✅ Status: Valid               📊 Zones: Balanced         │
│                                                             │
│  [Reset Board] [Load Full Deck] [Navigate to Game]        │
└─────────────────────────────────────────────────────────────┘
```

## Core Features

### Rule Testing Integration
```typescript
interface RuleTestEnvironment {
  currentRule: ScoringCondition | null;
  testBoard: Card[];
  availableCards: Card[];
  scoringResults: RuleTestResults | null;
  highlightedTiles: TileHighlight[];
}

class RuleTestController {
  loadRule(ruleId: string): void;
  placeCard(position: BoardPosition, card: Card): void;
  removeCard(position: BoardPosition): void;
  calculateScore(): number;
  highlightScoringEffects(): TileHighlight[];
  resetBoard(): void;
  loadFullDeck(): void;
}
```

### Metadata in Scoring Context
```typescript
// Runtime TypeScript type generation for Monaco editor
class MetadataTypeGenerator {
  // Generates TypeScript definitions as strings at runtime
  generateTypesFromSchema(metadataSchema: CustomMetadataField[]): string {
    const fields = metadataSchema.map(field => {
      let type: string;
      switch (field.type) {
        case 'number': type = 'number'; break;
        case 'text': type = 'string'; break;
        case 'boolean': type = 'boolean'; break;
        case 'select': 
          // Generate union type from options
          type = field.options?.map(opt => `'${opt}'`).join(' | ') || 'string';
          break;
      }
      
      const optional = field.required ? '' : '?';
      const comment = field.description ? `\n  /** ${field.description} */` : '';
      return `${comment}\n  ${field.id}${optional}: ${type};`;
    }).join('\n');
    
    // Return as string to be injected into Monaco's TypeScript worker
    return `
interface CustomCardMetadata {${fields}
}

// Enhanced tile interface with typed metadata
interface TileWithMetadata extends Tile {
  card?: Card & {
    customMetadata?: CustomCardMetadata;
  };
}

// Enhanced context with typed metadata access
interface TypedScoringContext extends ScoringContext {
  getAllTiles(): TileWithMetadata[];
  getTileAt(row: number, col: number): TileWithMetadata | null;
}
`;
  }

  // Inject generated types into Monaco's TypeScript environment
  updateMonacoTypes(monaco: any, typeDefinitions: string): void {
    const uri = monaco.Uri.parse('file:///custom-metadata-types.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      typeDefinitions,
      uri.toString()
    );
  }
}

// Example scoring function with full type safety
function livestockBonusScoring(context: TypedScoringContext): number {
  let totalScore = 0;
  
  for (const tile of context.getAllTiles()) {
    const metadata = tile.card?.customMetadata;
    if (metadata) {
      // Now with full IntelliSense and type checking!
      const livestockCount = metadata.livestockCount; // TypeScript knows this is number
      const cropType = metadata.cropType; // TypeScript knows this is 'wheat' | 'corn' | 'rice'
      const isSeasonal = metadata.seasonal; // TypeScript knows this is boolean
      
      // Scoring logic with type safety
      if (cropType === 'wheat' && livestockCount > 3) {
        totalScore += livestockCount * 2; // Wheat + livestock synergy
      }
      
      if (isSeasonal) {
        totalScore += 5; // Seasonal bonus
      }
    }
  }
  
  return totalScore;
}

// Example for casino-themed deck with typed suits
function cardSuitBonusScoring(context: TypedScoringContext): number {
  const suitCounts = { hearts: 0, spades: 0, diamonds: 0, clubs: 0 };
  
  for (const tile of context.getAllTiles()) {
    const suit = tile.card?.customMetadata?.suit; // TypeScript: 'hearts' | 'spades' | 'diamonds' | 'clubs'
    if (suit && suit in suitCounts) {
      suitCounts[suit]++; // Type-safe access
    }
  }
  
  // Royal flush bonus: 5+ of same suit
  const maxSuitCount = Math.max(...Object.values(suitCounts));
  return maxSuitCount >= 5 ? maxSuitCount * 10 : 0;
}
```

## Acceptance Criteria

1. ✅ User can seamlessly switch between cards, scoring, testing, and analytics
2. ✅ Card changes reflect immediately in deck statistics
3. ✅ Scoring formulas can be assigned to individual cards
4. ✅ Custom metadata fields can be defined and assigned to cards
5. ✅ Metadata is accessible in scoring functions via context API
6. ✅ Monaco editor provides full TypeScript IntelliSense for custom metadata
7. ✅ Rule testing environment validates individual scoring rules with metadata
8. ✅ Balance analysis provides actionable feedback
9. ✅ Test environment allows interactive board manipulation
10. ✅ Real-time score calculation with visual feedback including metadata
11. ✅ Navigation from rule testing to full game experience
12. ✅ All editor components work together without conflicts
13. ✅ Clean, focused UI for efficient deck creation workflow

## File Changes Required

### New Files
- `components/deck-editor/DeckAnalytics.tsx` - Balance analysis dashboard
- `components/deck-editor/RuleTestEnvironment.tsx` - Interactive rule testing
- `components/deck-editor/MetadataEditor.tsx` - Custom metadata field editor
- `components/deck-editor/CardMetadataForm.tsx` - Individual card metadata form
- `utils/deckAnalysis.ts` - Balance analysis algorithms
- `utils/ruleTesting.ts` - Rule testing framework
- `utils/metadataValidation.ts` - Metadata validation utilities
- `utils/monacoTypeGeneration.ts` - Dynamic TypeScript type generation for metadata
- `stores/deckAnalyticsStore.ts` - Analytics state management
- `stores/ruleTestStore.ts` - Rule testing state management
- `stores/metadataStore.ts` - Metadata schema and validation state
- `types/deckAnalytics.ts` - Analytics type definitions
- `types/ruleTesting.ts` - Rule testing type definitions
- `types/metadataSystem.ts` - Base metadata system type definitions (not deck-specific)

### Modified Files
- `components/deck-editor/DeckEditor.tsx` - Add analytics, testing, and metadata tabs
- `components/deck-editor/CardEditor.tsx` - Integrate metadata form
- `stores/customDecksStore.ts` - Add metadata schema and card metadata support
- `pages/deck-editor/+Page.tsx` - Support testing navigation and metadata
- `components/scoring-editor/ScoringEditorModal.tsx` - Replace test runner with navigation to rule testing
- `components/scoring-editor/MonacoEditor.tsx` - Integrate dynamic type generation for metadata
- `utils/scoringContext.ts` - Add metadata access to scoring context API
- `stores/scoringEditorStore.ts` - Integrate metadata schema for type generation
- `types/game.ts` - Update Card interface to include custom metadata

## Testing Strategy
- Integration tests for deck editor and rule testing components
- Performance tests with complex scoring rules
- User experience testing for rule testing workflow
- Cross-browser compatibility testing
- Accessibility testing for interactive board components

## Success Metrics
- Users can test scoring rules effectively in under 5 minutes
- High engagement with rule testing features
- Reduced iteration time for deck refinement
- Zero calculation errors in rule testing
- Smooth workflow from rule creation to testing to game play