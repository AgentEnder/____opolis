# Vertical Slice 3: TypeScript Scoring Editor

## Goal
Create a TypeScript editor for custom scoring formulas with transpilation and sandboxed execution that provides immediate visual feedback.

## User Story
As an advanced player, I want to write custom scoring logic in TypeScript so I can create sophisticated scoring rules that are executed safely during gameplay.

## Deliverables

### 1. In-Browser TypeScript Editor
- Monaco Editor integration for full TypeScript editing experience
- Syntax highlighting, IntelliSense, and error detection
- Auto-completion for game state API and scoring utilities
- Real-time type checking and validation

### 2. Transpilation Pipeline
- TypeScript compiler API integration for browser compilation
- Source-to-JavaScript transformation with error handling
- Minification and optimization for storage efficiency
- Source map generation for debugging support

### 3. Sandboxed Execution Environment
- Web Worker-based isolation for security
- Controlled game state injection with limited API surface
- Execution timeout protection and resource limits
- Error handling with graceful fallbacks

### 4. Scoring Formula Testing
- Live preview with sample board states
- Visual highlighting of affected tiles
- Score calculation debugging and step-through
- Test case creation for formula validation

## Technical Details

### Monaco Editor Integration
```typescript
import * as monaco from 'monaco-editor';

interface ScoringEditorProps {
  initialFormula?: string;
  onFormulaChange: (formula: string, compiled: string) => void;
  gameContext: ScoringContext;
}

// TypeScript definitions for scoring API
const scoringAPITypes = `
declare interface ScoringContext {
  zones: Zone[];
  board: Card[];
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

declare function calculateScore(context: ScoringContext): number;
`;
```

### Transpilation System
```typescript
class TypeScriptCompiler {
  private compiler: typeof monaco.languages.typescript;
  
  async compile(source: string): Promise<CompilationResult> {
    try {
      // Configure TypeScript compiler options
      const compilerOptions: monaco.languages.typescript.CompilerOptions = {
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        strict: true,
        noImplicitAny: true,
        allowJs: false
      };
      
      // Compile TypeScript to JavaScript
      const result = await this.compiler.transpile(source, compilerOptions);
      
      // Validate compilation
      if (result.diagnostics?.length) {
        throw new CompilationError(result.diagnostics);
      }
      
      return {
        source,
        compiled: result.outputText,
        sourceMap: result.sourceMapText,
        success: true
      };
      
    } catch (error) {
      return {
        source,
        compiled: '',
        error: error.message,
        success: false
      };
    }
  }
}
```

### Sandboxed Execution
```typescript
class ScoringSandbox {
  private worker: Worker;
  private executionTimeout = 100; // 100ms max
  
  constructor() {
    this.worker = new Worker('/workers/scoring-sandbox.js');
  }
  
  async executeFormula(
    compiledJS: string, 
    context: ScoringContext
  ): Promise<ScoringResult> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Scoring formula execution timeout'));
      }, this.executionTimeout);
      
      // Sanitize context for security
      const safeContext = this.sanitizeContext(context);
      
      this.worker.postMessage({
        id: Date.now(),
        formula: compiledJS,
        context: safeContext
      });
      
      this.worker.onmessage = (event) => {
        clearTimeout(timeoutId);
        const { result, error } = event.data;
        
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      };
    });
  }
  
  private sanitizeContext(context: ScoringContext): SafeContext {
    // Remove dangerous references and limit API surface
    return {
      zones: JSON.parse(JSON.stringify(context.zones)),
      board: JSON.parse(JSON.stringify(context.board)),
      // ... other safe properties
    };
  }
}
```

### Scoring API for Formulas
```typescript
// Available in user's TypeScript formulas
interface ScoringAPI {
  // Board analysis
  getAllZonesOfType: (type: string) => Zone[];
  getAdjacentZones: (zone: Zone) => Zone[];
  getConnectedRoadNetworks: () => RoadNetwork[];
  findLargestCluster: (zoneType: string) => Zone[];
  
  // Geometric utilities
  getDistance: (zone1: Zone, zone2: Zone) => number;
  isAdjacent: (zone1: Zone, zone2: Zone) => boolean;
  getZonesInRadius: (center: Zone, radius: number) => Zone[];
  
  // Scoring helpers
  countMatches: <T>(items: T[], predicate: (item: T) => boolean) => number;
  sum: (numbers: number[]) => number;
  max: (numbers: number[]) => number;
  min: (numbers: number[]) => number;
}
```

### Live Testing Interface
```typescript
interface FormulaTestingProps {
  formula: string;
  compiledFormula: string;
  testBoardStates: BoardState[];
  onTestRun: (results: TestResult[]) => void;
}

interface TestResult {
  boardState: BoardState;
  score: number;
  executionTime: number;
  error?: string;
  highlightedTiles?: TilePosition[];
  explanation?: string;
}
```

## UI Design

### Editor Layout
```
┌─────────────────────────────────────────────────────────┐
│                    Scoring Formula Editor                │
├─────────────────────┬───────────────────────────────────┤
│                     │          Test Results             │
│  Monaco Editor      │  ┌─────────────────────────────┐  │
│                     │  │  Board State 1: 15 points  │  │
│  [TypeScript Code]  │  │  Board State 2: 8 points   │  │
│                     │  │  Board State 3: ERROR      │  │
│                     │  └─────────────────────────────┘  │
│                     │                                   │
│  Compilation:       │  Visual Preview:                  │
│  ✅ Success         │  [Board visualization with        │
│  0 errors, 0 warns │   highlighted scoring tiles]      │
├─────────────────────┼───────────────────────────────────┤
│                     │                                   │
│  Example Formulas:  │  Formula Documentation:           │
│  • Adjacency Bonus │  • Available functions            │
│  • Road Network     │  • Context properties             │
│  • Cluster Scoring  │  • Common patterns                │
└─────────────────────┴───────────────────────────────────┘
```

### Formula Templates
```typescript
const formulaTemplates = {
  adjacencyBonus: `// Adjacency Bonus
function calculateScore(context: ScoringContext): number {
  const { zones, getAdjacentZones, countZoneType } = context;
  
  let bonus = 0;
  for (const zone of zones) {
    if (zone.type === 'commercial') {
      const adjacent = getAdjacentZones(zone);
      const residentialNearby = adjacent.filter(z => z.type === 'residential').length;
      bonus += residentialNearby * 2;
    }
  }
  
  return bonus;
}`,

  roadNetworkBonus: `// Road Network Bonus
function calculateScore(context: ScoringContext): number {
  const { getConnectedRoadNetworks } = context;
  
  const networks = getConnectedRoadNetworks();
  const largestNetwork = Math.max(...networks.map(n => n.segments.length));
  
  return largestNetwork > 5 ? 10 : 0;
}`,

  diversityBonus: `// Zone Diversity Bonus
function calculateScore(context: ScoringContext): number {
  const { zones } = context;
  
  const zoneTypes = new Set(zones.map(z => z.type));
  const uniqueTypes = zoneTypes.size;
  
  return uniqueTypes >= 4 ? 15 : uniqueTypes * 3;
}`
};
```

## Acceptance Criteria

1. ✅ User can write TypeScript code with full IDE features
2. ✅ Code compiles to JavaScript with error reporting
3. ✅ Compiled formulas execute safely in sandbox
4. ✅ Formula execution times out after 100ms maximum
5. ✅ Test board states show live scoring results
6. ✅ Visual preview highlights affected tiles
7. ✅ Example formulas provide learning templates
8. ✅ Custom formulas integrate with existing scoring system
9. ✅ Compilation errors show helpful messages
10. ✅ Runtime errors don't crash the application

## File Changes Required

### New Files
- `components/scoring-editor/ScoringEditorModal.tsx` - Modal-based scoring editor
- `components/scoring-editor/MonacoEditor.tsx` - TypeScript editor wrapper
- `components/scoring-editor/FormulaTestRunner.tsx` - Live testing interface
- `components/scoring-editor/BoardPreview.tsx` - Visual scoring preview
- `utils/typescript-compiler.ts` - Browser TS compilation
- `workers/scoring-sandbox.js` - Web worker for safe execution
- `stores/scoringEditorStore.ts` - Editor state management
- `types/scoring-formulas.ts` - Formula type definitions

### Modified Files
- `types/scoring.ts` - Extend ScoringCondition for custom formulas
- `utils/scoring.ts` - Support custom formula execution
- `components/deck-editor/DeckEditor.tsx` - Integrate scoring editor modal
- `components/card-builder/CardBuilderModal.tsx` - Add scoring editor access

## Testing Strategy
- Unit tests for TypeScript compilation pipeline
- Sandbox execution tests with malicious code attempts
- Performance tests for formula execution limits
- Integration tests with existing scoring system
- E2E tests for complete formula creation workflow

## Security Considerations
- Web Worker isolation prevents DOM access
- Context sanitization removes sensitive references
- Execution timeouts prevent infinite loops
- No access to browser APIs or external resources
- Compiled code validation before execution

## Success Metrics
- Advanced users can create complex scoring logic
- Formula execution performance under 50ms average
- Zero security vulnerabilities from custom code
- High user satisfaction with editor experience
- Custom scoring formulas work seamlessly in gameplay