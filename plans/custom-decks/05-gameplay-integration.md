# Vertical Slice 5: Complete Gameplay Integration

## Goal
Fully integrate custom decks into the core game experience with seamless gameplay, scoring, and UI that matches the quality of built-in variations.

## User Story
As a player, I want to play games with my custom decks that feel just as polished and smooth as the original game variations, with proper scoring, visual effects, and game flow.

## Deliverables

### 1. Enhanced Game Setup
- Custom deck preview with detailed information accessed from deck editor
- Deck validation before game start
- Mix-and-match capability (custom + built-in variations)
- Quick-start options for recently played custom decks
- Direct navigation to deck editor from game setup for deck management

### 2. In-Game Custom Scoring
- Real-time custom scoring formula execution
- Visual scoring feedback and tile highlighting  
- Custom scoring explanations and tooltips
- Performance optimization for complex formulas

### 3. Game Flow Integration  
- Custom deck loading and initialization
- Hand management with custom cards
- Turn progression with custom scoring
- Game over screens with custom deck statistics

### 4. Polish & Performance
- Visual consistency with built-in game themes
- Smooth animations and transitions
- Error handling and graceful degradation
- Mobile optimization for custom deck features

## Technical Details

### Enhanced Game Machine Integration
```typescript
interface GameContext {
  // Existing properties...
  customDeck?: CustomDeck;
  customScoringConditions: ScoringCondition[];
  scoringCache: Map<string, number>; // Performance optimization
  customCards: EnhancedCard[];
}

// Extend game machine states
const gameMachine = createMachine({
  states: {
    setup: {
      // Add custom deck validation
      entry: 'validateCustomDecks',
      on: {
        SELECT_CUSTOM_DECK: {
          actions: 'loadCustomDeck',
          target: 'setup'
        }
      }
    },
    playing: {
      // Integrate custom scoring
      entry: 'initializeCustomScoring',
      on: {
        PLACE_CARD: {
          actions: ['placeCard', 'calculateCustomScore'],
          target: 'playing'
        }
      }
    }
  }
});
```

### Custom Scoring Integration
```typescript
class CustomScoringEngine {
  private sandbox: ScoringSandbox;
  private cache: Map<string, number> = new Map();
  
  async calculateScore(
    board: Card[], 
    conditions: ScoringCondition[]
  ): Promise<ScoreResult> {
    const baseScore = await this.calculateBaseScore(board);
    const customScores = await Promise.all(
      conditions.map(condition => this.evaluateCondition(condition, board))
    );
    
    return {
      baseScore,
      conditionScores: customScores,
      totalScore: baseScore + customScores.reduce((sum, score) => sum + score.points, 0),
      // ... other score result properties
    };
  }
  
  private async evaluateCondition(
    condition: ScoringCondition, 
    board: Card[]
  ): Promise<ConditionScore> {
    const cacheKey = `${condition.id}-${this.hashBoard(board)}`;
    
    if (this.cache.has(cacheKey)) {
      return { condition, points: this.cache.get(cacheKey)!, fromCache: true };
    }
    
    try {
      const points = await this.sandbox.executeFormula(
        condition.compiledFormula,
        this.createScoringContext(board)
      );
      
      this.cache.set(cacheKey, points);
      return { condition, points, executionTime: performance.now() };
      
    } catch (error) {
      console.warn(`Custom scoring error for ${condition.name}:`, error);
      return { condition, points: 0, error: error.message };
    }
  }
}
```

### Enhanced Game Setup UI
```typescript
interface EnhancedGameSetupProps {
  availableDecks: (GameVariation | CustomDeck)[];
  onDeckSelect: (decks: (GameVariation | CustomDeck)[]) => void;
  onGameStart: (config: GameConfig) => void;
}

interface GameConfig {
  variations: GameVariation[];
  customDecks: CustomDeck[];
  playerCount: number;
  difficulty: 'easy' | 'normal' | 'hard';
  enableCustomScoring: boolean;
}
```

### Visual Scoring Feedback
```typescript
interface ScoringVisualization {
  highlightedTiles: TileHighlight[];
  scoreAnimations: ScoreAnimation[];
  explanationTooltips: ScoringTooltip[];
}

interface TileHighlight {
  position: { x: number, y: number };
  color: string;
  intensity: number;
  reason: string;
}

interface ScoreAnimation {
  startPosition: { x: number, y: number };
  endPosition: { x: number, y: number };
  points: number;
  duration: number;
  easing: string;
}
```

## UI Enhancements

### Enhanced Game Setup Screen
```
┌─────────────────────────────────────────────────────────────┐
│                    Choose Your Game                         │
├─────────────────────────────────────────────────────────────┤
│  Built-in Variations:                                      │
│  ☑️ Sprawopolis    ☑️ Agropolis    ☐ Casinopolis          │
│                                                             │
│  Custom Decks:                                              │
│  ┌─────────────┬─────────────┬─────────────┐              │
│  │ Modern City │ Steampunk   │ Eco Village │              │
│  │ 18 cards    │ 24 cards    │ 15 cards    │              │
│  │ ⭐⭐⭐⭐⭐      │ ⭐⭐⭐⭐        │ ⭐⭐⭐         │              │
│  │ [Preview]   │ [Preview]   │ [Preview]   │              │
│  └─────────────┴─────────────┴─────────────┘              │
│                                                             │
│  Mixed Deck Configuration:                                  │
│  • Total Cards: 42                                         │
│  • Scoring Rules: 6 (3 built-in + 3 custom)              │
│  • Estimated Play Time: 25-35 minutes                      │
│                                                             │
│  Players: [2] [3] [4]    Difficulty: [●●○] Normal         │
│                                                             │
│        [Quick Start] [Customize Settings] [Start Game]     │
└─────────────────────────────────────────────────────────────┘
```

### In-Game Scoring Display
```
┌─────────────────────────────────────────────────────────────┐
│  Score: 34  │  Turn 8/15  │  Player: Alice  │  [Menu] [Help]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Game Board with custom deck cards]                       │
│                                                             │
│  Recent Scoring:                                            │
│  🟦 +5  Industrial Synergy (Custom)                        │
│  🟧 +3  Commercial Cluster                                 │
│  🛣️ -2  Road Network Penalty                               │
│                                                             │
│  Active Custom Rules:                                       │
│  ★ Adjacent Industrial Bonus: +2 per pair                  │
│  ★ Tech Hub Multiplier: x1.5 for tech zones              │
│  ★ Green Corridor: +1 per connected park                  │
└─────────────────────────────────────────────────────────────┘
```

### Custom Deck Preview Modal
```
┌─────────────────────────────────────────────────────────────┐
│                   Modern City Deck                          │
│                 Created by: PlayerOne                       │
├─────────────────────────────────────────────────────────────┤
│  Preview Cards:                                             │
│  [Card1] [Card2] [Card3] [Card4] [Card5] [+13 more...]    │
│                                                             │
│  Deck Statistics:                                           │
│  • Total Cards: 18                                         │
│  • Zone Types: Residential, Commercial, Industrial,        │
│                Tech, Entertainment, Green Space             │
│  • Custom Scoring Rules: 3                                 │
│  • Average Game Length: 30 minutes                         │
│  • Difficulty: ★★★☆☆ (Intermediate)                       │
│                                                             │
│  Custom Scoring Preview:                                    │
│  🏭 Industrial Synergy: Adjacent industrial zones get      │
│     +2 points each                                          │
│  🌆 Tech Hub Bonus: Tech zones with 3+ roads get x1.5     │
│  🌳 Green Corridor: Connected parks create scoring chains   │
│                                                             │
│  Community Rating: ⭐⭐⭐⭐☆ (4.2/5) - 47 plays            │
│                                                             │
│         [Add to Game] [View Full Deck] [Cancel]            │
└─────────────────────────────────────────────────────────────┘
```

## Advanced Features

### Performance Optimization
```typescript
class GamePerformanceOptimizer {
  // Precompile scoring formulas during deck load
  async precompileScoring(deck: CustomDeck): Promise<CompiledDeck> {
    const compiledConditions = await Promise.all(
      deck.scoringConditions.map(condition => 
        this.compileFormula(condition.formula)
      )
    );
    
    return { ...deck, compiledConditions };
  }
  
  // Cache scoring results for identical board states  
  private scoringCache = new Map<string, number>();
  
  // Batch scoring calculations for better performance
  async batchCalculateScores(
    boards: Card[][], 
    conditions: ScoringCondition[]
  ): Promise<number[]> {
    // Parallel execution of scoring formulas
  }
}
```

### Error Recovery System
```typescript
class CustomDeckErrorHandler {
  handleScoringError(error: Error, condition: ScoringCondition): number {
    // Log error for debugging
    console.error(`Scoring error in ${condition.name}:`, error);
    
    // Provide fallback scoring
    return condition.fallbackScore || 0;
  }
  
  handleDeckLoadError(deck: CustomDeck, error: Error): GameVariation {
    // Show user-friendly error message
    this.notificationStore.addNotification({
      type: 'error',
      message: `Custom deck "${deck.name}" could not be loaded. Using default deck.`,
      duration: 5000
    });
    
    // Fall back to default variation
    return this.getDefaultVariation();
  }
}
```

### Mobile Optimization
```typescript
interface MobileCustomDeckFeatures {
  // Simplified UI for mobile screens
  compactDeckSelection: boolean;
  
  // Touch-optimized interactions
  swipeToPreview: boolean;
  pinchToZoomCards: boolean;
  
  // Performance adaptations
  reducedAnimations: boolean;
  limitedParallelScoring: boolean;
  
  // Offline support
  cachedCustomDecks: CustomDeck[];
  offlineScoringCache: Map<string, number>;
}
```

## Acceptance Criteria

1. ✅ Custom decks load and play identically to built-in variations
2. ✅ Custom scoring formulas execute within 50ms on average
3. ✅ Visual scoring feedback matches built-in game quality  
4. ✅ Mixed decks (custom + built-in) work seamlessly
5. ✅ Error handling gracefully falls back to safe alternatives
6. ✅ Mobile experience is smooth with custom deck features
7. ✅ Game performance is identical with/without custom decks
8. ✅ Custom deck statistics integrate with game over screens
9. ✅ All UI animations and transitions work with custom content
10. ✅ Players can't distinguish custom from built-in content quality

## File Changes Required

### New Files
- `components/game/CustomScoringEngine.tsx` - Custom scoring integration
- `components/game/EnhancedGameSetup.tsx` - Improved setup screen
- `components/game/CustomDeckPreview.tsx` - Deck preview modal
- `components/game/ScoringVisualization.tsx` - Visual scoring effects
- `utils/gamePerformance.ts` - Performance optimization utilities
- `utils/customDeckValidation.ts` - Runtime deck validation
- `stores/customGameStore.ts` - Custom game state management

### Modified Files
- `providers/GameMachineProvider.tsx` - Add custom deck support
- `components/GameBoard.tsx` - Custom scoring visualization
- `components/GameSetup.tsx` - Add deck editor navigation links
- `components/GameInfo.tsx` - Custom scoring display
- `utils/scoring.ts` - Integrate custom scoring engine
- `stores/uiStore.ts` - Custom deck notifications

## Testing Strategy
- Load testing with complex custom formulas
- Integration testing with mixed built-in/custom decks  
- Performance testing on mobile devices
- Error injection testing for formula failures
- A/B testing for UI/UX with custom vs built-in content

## Performance Requirements
- Custom scoring execution: <50ms average, <100ms maximum
- Deck loading: <2 seconds for decks up to 50 cards
- UI responsiveness: No frame drops during scoring animations
- Memory usage: <50MB additional for custom deck features
- Mobile performance: Identical to built-in variations

## Success Metrics
- Custom deck games have identical completion rates to built-in games
- Custom scoring errors occur in <0.1% of turns
- User satisfaction ratings for custom decks match built-in content
- Performance metrics remain within 10% of baseline
- Zero critical bugs in production for 30 days post-launch