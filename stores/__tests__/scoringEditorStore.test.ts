import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useScoringEditorStore } from '../scoringEditorStore';
import type { FormulaTemplate, CustomScoringCondition } from '../../types/scoring-formulas';

// Mock the compilation and execution modules
vi.mock('../../utils/typescript-compiler', () => ({
  compileTypeScript: vi.fn(() => Promise.resolve({
    source: 'test code',
    compiled: 'compiled code',
    success: true
  }))
}));

vi.mock('../../utils/scoring-sandbox', () => ({
  executeScoringFormula: vi.fn(() => Promise.resolve({
    score: 15,
    executionTime: 25,
    highlightedTiles: []
  }))
}));

describe('Scoring Editor Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useScoringEditorStore.getState();
    store.reset();
  });

  describe('modal state management', () => {
    it('should start with modal closed', () => {
      const { isOpen } = useScoringEditorStore.getState();
      expect(isOpen).toBe(false);
    });

    it('should open modal with default formula', () => {
      const { openEditor, isOpen, formula } = useScoringEditorStore.getState();
      
      openEditor();
      
      const state = useScoringEditorStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.formula).toContain('calculateScore');
    });

    it('should open modal with existing condition', () => {
      const mockCondition: CustomScoringCondition = {
        id: 'test_condition',
        name: 'Test Condition',
        description: 'Test',
        isCustom: true,
        formula: 'custom formula',
        compiledFormula: 'compiled custom formula',
        testCases: [],
        targetContribution: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        evaluate: () => 0,
        evaluateWithDetails: () => ({ score: 0, tiles: [], description: '' }),
      };

      const { openEditor } = useScoringEditorStore.getState();
      
      openEditor(mockCondition);
      
      const state = useScoringEditorStore.getState();
      expect(state.isOpen).toBe(true);
      expect(state.formula).toBe('custom formula');
      expect(state.editingCondition).toEqual(mockCondition);
    });

    it('should close modal and reset state', () => {
      const { openEditor, closeEditor } = useScoringEditorStore.getState();
      
      openEditor();
      closeEditor();
      
      const state = useScoringEditorStore.getState();
      expect(state.isOpen).toBe(false);
      expect(state.editingCondition).toBeUndefined();
      expect(state.formula).toBe('');
    });
  });

  describe('formula editing', () => {
    it('should update formula', () => {
      const { openEditor, updateFormula } = useScoringEditorStore.getState();
      
      openEditor();
      updateFormula('new formula');
      
      const { formula } = useScoringEditorStore.getState();
      expect(formula).toBe('new formula');
    });

    it('should compile formula', async () => {
      const { openEditor, compileFormula } = useScoringEditorStore.getState();
      
      openEditor();
      await compileFormula('test formula');
      
      const { compilationResult } = useScoringEditorStore.getState();
      expect(compilationResult).toBeDefined();
      expect(compilationResult?.success).toBe(true);
    });
  });

  describe('template loading', () => {
    it('should load template formula', () => {
      const mockTemplate: FormulaTemplate = {
        id: 'test_template',
        name: 'Test Template',
        description: 'Test template',
        category: 'adjacency',
        code: 'template code',
        explanation: 'Test explanation'
      };

      const { openEditor, loadTemplate } = useScoringEditorStore.getState();
      
      openEditor();
      loadTemplate(mockTemplate);
      
      const { formula } = useScoringEditorStore.getState();
      expect(formula).toBe('template code');
    });
  });

  describe('test case management', () => {
    it('should start with empty test results', () => {
      const { testResults } = useScoringEditorStore.getState();
      expect(testResults.size).toBe(0);
    });

    it('should select test cases', () => {
      const { openEditor, selectTestCase } = useScoringEditorStore.getState();
      
      openEditor();
      selectTestCase('test_case_1');
      
      const { selectedTestCase } = useScoringEditorStore.getState();
      expect(selectedTestCase).toBe('test_case_1');
    });

    it('should deselect when selecting same test case', () => {
      const store = useScoringEditorStore.getState();
      
      store.openEditor();
      store.selectTestCase('test_case_1');
      
      // Verify it's selected first
      expect(useScoringEditorStore.getState().selectedTestCase).toBe('test_case_1');
      
      // Select the same test case again to deselect
      store.selectTestCase('test_case_1');
      
      const { selectedTestCase } = useScoringEditorStore.getState();
      expect(selectedTestCase).toBeUndefined();
    });
  });

  describe('save condition', () => {
    it('should return null if compilation failed', () => {
      const { openEditor, saveCondition } = useScoringEditorStore.getState();
      
      openEditor();
      // No compilation result set
      
      const result = saveCondition();
      expect(result).toBeNull();
    });

    it('should create new condition if compilation succeeded', async () => {
      const store = useScoringEditorStore.getState();
      
      store.openEditor();
      store.updateFormula('test formula');
      await store.compileFormula('test formula');
      
      const result = store.saveCondition();
      expect(result).not.toBeNull();
      expect(result?.formula).toBe('test formula');
      expect(result?.isCustom).toBe(true);
    });
  });

  describe('reset functionality', () => {
    it('should reset to initial state', () => {
      const { openEditor, updateFormula, reset } = useScoringEditorStore.getState();
      
      // Modify state
      openEditor();
      updateFormula('test formula');
      
      // Reset
      reset();
      
      const state = useScoringEditorStore.getState();
      expect(state.formula).toBe('');
      expect(state.testResults.size).toBe(0);
      expect(state.isCompiling).toBe(false);
      expect(state.isTesting).toBe(false);
      expect(state.selectedTestCase).toBeUndefined();
    });
  });
});