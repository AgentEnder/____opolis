import { create } from 'zustand';
import type { 
  FormulaEditorState, 
  CompilationResult, 
  ScoringResult, 
  TestCase, 
  CustomScoringCondition,
  FormulaTemplate 
} from '../types/scoring-formulas';

interface ScoringEditorStore extends FormulaEditorState {
  // Modal state
  isOpen: boolean;
  editingCondition?: CustomScoringCondition;
  isGlobal: boolean;
  
  // Formula metadata
  formulaName: string;
  formulaDescription: string;
  targetContribution: number;
  
  // Actions
  openEditor: (condition?: CustomScoringCondition) => void;
  closeEditor: () => void;
  setIsGlobal: (isGlobal: boolean) => void;
  
  // Metadata actions
  updateFormulaName: (name: string) => void;
  updateFormulaDescription: (description: string) => void;
  updateTargetContribution: (target: number) => void;
  
  // Formula editing
  updateFormula: (formula: string) => void;
  compileFormula: (formula: string) => Promise<void>;
  
  // Testing
  addTestCase: (testCase: TestCase) => void;
  removeTestCase: (testCaseId: string) => void;
  runTest: (testCaseId: string) => Promise<void>;
  runAllTests: () => Promise<void>;
  selectTestCase: (testCaseId?: string) => void;
  
  // Save/Cancel
  saveCondition: () => CustomScoringCondition | null;
  cancelEditing: () => void;
  
  // Templates
  loadTemplate: (template: FormulaTemplate) => void;
  
  // Reset
  reset: () => void;
}

const initialState: FormulaEditorState = {
  formula: '',
  testResults: new Map(),
  isCompiling: false,
  isTesting: false,
};

const defaultFormula = `// Custom Scoring Formula
// Available context: gameState, board utilities, scoring helpers

function calculateScore(context: ScoringContext): number {
  const { countZonesOfType, findLargestCluster } = context;
  
  // Example: Bonus for balanced development
  const residential = countZonesOfType('residential');
  const commercial = countZonesOfType('commercial');
  const industrial = countZonesOfType('industrial');
  
  const balance = Math.min(residential, commercial, industrial);
  return balance * 2; // 2 points per balanced zone
}`;

export const useScoringEditorStore = create<ScoringEditorStore>((set, get) => ({
  ...initialState,
  isOpen: false,
  isGlobal: false,
  formulaName: '',
  formulaDescription: '',
  targetContribution: 10,
  
  openEditor: (condition) => {
    set({
      isOpen: true,
      editingCondition: condition,
      isGlobal: condition?.isGlobal || false,
      formulaName: condition?.name || '',
      formulaDescription: condition?.description || '',
      targetContribution: condition?.targetContribution || 10,
      formula: condition?.formula || defaultFormula,
      testResults: new Map(),
      compilationResult: undefined,
      selectedTestCase: undefined,
    });
  },
  
  closeEditor: () => {
    set({
      isOpen: false,
      editingCondition: undefined,
      isGlobal: false,
      formulaName: '',
      formulaDescription: '',
      targetContribution: 10,
      ...initialState,
    });
  },
  
  setIsGlobal: (isGlobal) => {
    set({ isGlobal });
  },
  
  updateFormulaName: (formulaName) => {
    set({ formulaName });
  },
  
  updateFormulaDescription: (formulaDescription) => {
    set({ formulaDescription });
  },
  
  updateTargetContribution: (targetContribution) => {
    set({ targetContribution });
  },
  
  updateFormula: (formula) => {
    set({ formula });
    // Auto-compile after a short delay
    setTimeout(() => {
      if (get().formula === formula) {
        get().compileFormula(formula);
      }
    }, 500);
  },
  
  compileFormula: async (formula) => {
    set({ isCompiling: true });
    
    try {
      // Import compilation logic dynamically
      const { compileTypeScript } = await import('../utils/typescript-compiler');
      const result = await compileTypeScript(formula);
      
      set({ 
        compilationResult: result, 
        isCompiling: false 
      });
      
      // If compilation succeeded, re-run tests
      if (result.success) {
        get().runAllTests();
      }
    } catch (error) {
      set({
        compilationResult: {
          source: formula,
          compiled: '',
          success: false,
          error: error instanceof Error ? error.message : 'Compilation failed',
        },
        isCompiling: false,
      });
    }
  },
  
  addTestCase: (testCase) => {
    const { editingCondition } = get();
    if (editingCondition) {
      editingCondition.testCases.push(testCase);
      set({ editingCondition });
    }
  },
  
  removeTestCase: (testCaseId) => {
    const { editingCondition, testResults } = get();
    if (editingCondition) {
      editingCondition.testCases = editingCondition.testCases.filter(tc => tc.id !== testCaseId);
      testResults.delete(testCaseId);
      set({ editingCondition, testResults: new Map(testResults) });
    }
  },
  
  runTest: async (testCaseId) => {
    const { compilationResult, editingCondition } = get();
    if (!compilationResult?.success || !editingCondition) return;
    
    set({ isTesting: true });
    
    try {
      const testCase = editingCondition.testCases.find(tc => tc.id === testCaseId);
      if (!testCase) return;
      
      // Import execution logic dynamically
      const { executeScoringFormula } = await import('../utils/scoring-sandbox');
      const result = await executeScoringFormula(
        compilationResult.compiled,
        testCase.boardState
      );
      
      const { testResults } = get();
      testResults.set(testCaseId, result);
      set({ testResults: new Map(testResults), isTesting: false });
    } catch (error) {
      const { testResults } = get();
      testResults.set(testCaseId, {
        score: 0,
        executionTime: 0,
        error: error instanceof Error ? error.message : 'Execution failed',
      });
      set({ testResults: new Map(testResults), isTesting: false });
    }
  },
  
  runAllTests: async () => {
    const { editingCondition } = get();
    if (!editingCondition) return;
    
    for (const testCase of editingCondition.testCases) {
      await get().runTest(testCase.id);
    }
  },
  
  selectTestCase: (testCaseId) => {
    const { selectedTestCase } = get();
    set({ selectedTestCase: selectedTestCase === testCaseId ? undefined : testCaseId });
  },
  
  saveCondition: () => {
    const { formula, compilationResult, editingCondition, isGlobal, formulaName, formulaDescription, targetContribution } = get();
    if (!compilationResult?.success) return null;
    
    const now = new Date();
    const condition: CustomScoringCondition = {
      id: editingCondition?.id || `custom_${Date.now()}`,
      name: formulaName || 'Custom Scoring Condition',
      description: formulaDescription || 'Custom TypeScript scoring formula',
      isCustom: true,
      isGlobal,
      formula,
      compiledFormula: compilationResult.compiled,
      testCases: editingCondition?.testCases || [],
      createdAt: editingCondition?.createdAt || now,
      updatedAt: now,
      targetContribution,
      evaluate: () => 0, // Will be replaced with compiled function
      evaluateWithDetails: () => ({ points: 0, relevantTiles: [], description: '' }),
    };
    
    return condition;
  },
  
  cancelEditing: () => {
    get().closeEditor();
  },
  
  loadTemplate: (template) => {
    set({ 
      formula: template.code,
      compilationResult: undefined,
      testResults: new Map(),
    });
    get().compileFormula(template.code);
  },
  
  reset: () => {
    set(initialState);
  },
}));