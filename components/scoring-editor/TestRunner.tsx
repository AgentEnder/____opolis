import { useState } from 'react';
import { useScoringEditorStore } from '../../stores/scoringEditorStore';
import type { TestCase } from '../../types/scoring-formulas';
import type { GameState } from '../../types/game';

// Sample board states for testing
const SAMPLE_BOARD_STATES: TestCase[] = [
  {
    id: 'empty_board',
    name: 'Empty Board',
    description: 'No cards placed',
    boardState: {
      players: [],
      currentPlayerIndex: 0,
      deck: [],
      board: [],
      topCard: null,
      gamePhase: 'playing' as const,
      turnCount: 0,
      scoring: { activeConditions: [], targetScore: 0 },
    } as GameState,
    expectedScore: 0,
  },
  {
    id: 'simple_layout',
    name: 'Simple Layout',
    description: 'Basic 2x2 mixed development',
    boardState: {
      players: [],
      currentPlayerIndex: 0,
      deck: [],
      board: [
        {
          id: 'test_card_1',
          cells: [
            [{ type: 'residential', roads: [] }, { type: 'commercial', roads: [] }],
            [{ type: 'park', roads: [] }, { type: 'industrial', roads: [] }],
          ],
          x: 0,
          y: 0,
          rotation: 0,
        },
      ],
      topCard: null,
      gamePhase: 'playing' as const,
      turnCount: 0,
      scoring: { activeConditions: [], targetScore: 50 },
    } as GameState,
  },
  {
    id: 'large_development',
    name: 'Large Development',
    description: 'Multiple cards with roads',
    boardState: {
      players: [],
      currentPlayerIndex: 0,
      deck: [],
      board: [
        {
          id: 'test_card_2',
          cells: [
            [{ type: 'residential', roads: [[0, 1]] }, { type: 'residential', roads: [[3, 2]] }],
            [{ type: 'commercial', roads: [[0]] }, { type: 'commercial', roads: [[1]] }],
          ],
          x: 0,
          y: 0,
          rotation: 0,
        },
        {
          id: 'test_card_3',
          cells: [
            [{ type: 'park', roads: [] }, { type: 'industrial', roads: [[2]] }],
            [{ type: 'industrial', roads: [[0, 1]] }, { type: 'park', roads: [[3]] }],
          ],
          x: 2,
          y: 0,
          rotation: 0,
        },
      ],
      topCard: null,
      gamePhase: 'playing' as const,
      turnCount: 0,
      scoring: { activeConditions: [], targetScore: 100 },
    } as GameState,
  },
];

export function TestRunner() {
  const {
    compilationResult,
    testResults,
    isTesting,
    selectedTestCase,
    runTest,
    runAllTests,
    selectTestCase,
    editingCondition,
  } = useScoringEditorStore();

  const [customTestName, setCustomTestName] = useState('');

  // Combine sample test cases with custom ones
  const allTestCases = [
    ...SAMPLE_BOARD_STATES,
    ...(editingCondition?.testCases || []),
  ];

  const handleRunTest = async (testCaseId: string) => {
    await runTest(testCaseId);
  };

  const handleRunAllTests = async () => {
    await runAllTests();
  };

  const handleSelectTest = (testCaseId: string) => {
    selectTestCase(selectedTestCase === testCaseId ? undefined : testCaseId);
  };

  const isCompiled = compilationResult?.success;
  const canTest = isCompiled && !isTesting;

  return (
    <div className="space-y-4">
      {/* Test Controls */}
      <div className="flex items-center gap-2">
        <button
          className={`btn btn-sm btn-primary flex-1 ${!canTest ? 'btn-disabled' : ''}`}
          onClick={handleRunAllTests}
          disabled={!canTest}
        >
          {isTesting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Testing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run All Tests
            </>
          )}
        </button>
      </div>

      {/* Test Cases List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {allTestCases.map((testCase) => {
          const result = testResults.get(testCase.id);
          const isSelected = selectedTestCase === testCase.id;
          
          return (
            <div key={testCase.id} className="space-y-2">
              {/* Test Case Header */}
              <div 
                className={`flex items-center justify-between p-3 border border-base-300 rounded cursor-pointer transition-colors ${
                  isSelected ? 'bg-primary/10 border-primary' : 'bg-base-100 hover:bg-base-200'
                }`}
                onClick={() => handleSelectTest(testCase.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{testCase.name}</h4>
                    {result && (
                      <div className={`badge badge-sm ${
                        result.error ? 'badge-error' : 'badge-success'
                      }`}>
                        {result.error ? 'Error' : `${result.score} pts`}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-base-content/70 mt-1">{testCase.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    className={`btn btn-xs ${!canTest ? 'btn-disabled' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunTest(testCase.id);
                    }}
                    disabled={!canTest}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  <svg 
                    className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Test Results Details */}
              {isSelected && result && (
                <div className="ml-4 p-3 bg-base-100 border border-base-300 rounded">
                  {result.error ? (
                    <div className="alert alert-error alert-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{result.error}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Score: <strong>{result.score} points</strong></span>
                        <span className="text-base-content/70">
                          Execution time: {result.executionTime.toFixed(1)}ms
                        </span>
                      </div>
                      
                      {testCase.expectedScore !== undefined && (
                        <div className={`text-xs p-2 rounded ${
                          result.score === testCase.expectedScore
                            ? 'bg-success/20 text-success-content'
                            : 'bg-warning/20 text-warning-content'
                        }`}>
                          Expected: {testCase.expectedScore} points {' '}
                          {result.score === testCase.expectedScore ? '✓' : '⚠'}
                        </div>
                      )}

                      {result.details && result.details.length > 0 && (
                        <div className="text-xs">
                          <strong>Details:</strong>
                          <ul className="mt-1 space-y-1">
                            {result.details.map((detail, i) => (
                              <li key={i} className="flex justify-between">
                                <span>{detail.description}</span>
                                <span>{detail.points} pts</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      {!isCompiled && (
        <div className="text-xs text-base-content/60 p-2 bg-base-200 rounded">
          💡 Compile your formula first to run tests
        </div>
      )}

      {allTestCases.length === 0 && (
        <div className="text-center text-base-content/60 py-8">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-sm">No test cases available</p>
          <p className="text-xs">Sample test cases will appear here</p>
        </div>
      )}
    </div>
  );
}