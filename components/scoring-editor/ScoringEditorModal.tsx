import { useEffect, useRef } from "react";
import { useScoringEditorStore } from "../../stores/scoringEditorStore";
import { useDeckEditorStore } from "../../stores/deckEditorStore";
import { MonacoEditor } from "./MonacoEditor";
import { FormulaTemplates } from "./FormulaTemplates";
import { TestRunner } from "./TestRunner";
import type { editor } from "monaco-editor";

interface ScoringEditorModalProps {
  onSave?: (condition: any) => void;
  onCancel?: () => void;
}

export function ScoringEditorModal({
  onSave,
  onCancel,
}: ScoringEditorModalProps) {
  const { currentDeck } = useDeckEditorStore();
  const {
    isOpen,
    formula,
    compilationResult,
    isCompiling,
    isGlobal,
    editingCondition,
    formulaName,
    formulaDescription,
    targetContribution,
    updateFormula,
    saveCondition,
    closeEditor,
    setIsGlobal,
    updateFormulaName,
    updateFormulaDescription,
    updateTargetContribution,
  } = useScoringEditorStore();

  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle click outside
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  };

  const handleSave = () => {
    const condition = saveCondition();
    if (condition) {
      onSave?.(condition);
      closeEditor();
    }
  };

  const handleCancel = () => {
    onCancel?.();
    closeEditor();
  };

  const handleCompileResult = () => {
    // Compilation feedback is handled by the Monaco editor
    // Additional UI updates could be added here if needed
  };

  if (!isOpen) return null;

  const hasErrors = compilationResult && !compilationResult.success;
  const canSave = compilationResult?.success && !isCompiling;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white h-full w-full overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-base-100">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-base-content">
              {editingCondition
                ? "Edit Scoring Formula"
                : "Create Custom Scoring Formula"}
            </h2>
            <div className="flex items-center gap-2">
              {isCompiling && (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="text-sm text-base-content/70">
                    Compiling...
                  </span>
                </>
              )}
              {hasErrors && (
                <div className="badge badge-error gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Errors
                </div>
              )}
              {compilationResult?.success && !isCompiling && (
                <div className="badge badge-success gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ready
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className={`btn btn-primary ${!canSave ? "btn-disabled" : ""}`}
              onClick={handleSave}
              disabled={!canSave}
            >
              {editingCondition ? "Update Formula" : "Save Formula"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Formula Metadata - Collapsible */}
          <div className="border-b bg-base-50">
            <details className="collapse bg-transparent group">
              <summary className="collapse-title text-lg font-semibold py-3 px-6 hover:bg-base-100/50 cursor-pointer transition-colors list-none">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-open:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  📝 Formula Details
                  <span className="text-sm text-base-content/60 font-normal ml-auto group-open:hidden">
                    Click to expand
                  </span>
                  <span className="text-sm text-base-content/60 font-normal ml-auto hidden group-open:inline">
                    Click to collapse
                  </span>
                </div>
              </summary>
              <div className="collapse-content px-6 pb-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="formula-name"
                      className="block text-sm font-medium mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="formula-name"
                      className="input input-sm w-full"
                      placeholder="e.g., Balanced Development Bonus"
                      value={formulaName}
                      onChange={(e) => updateFormulaName(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="formula-description"
                      className="block text-sm font-medium mb-1"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      id="formula-description"
                      className="input input-sm w-full"
                      placeholder="Brief description of what this formula rewards..."
                      value={formulaDescription}
                      onChange={(e) => updateFormulaDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      htmlFor="target-contribution"
                      className="block text-sm font-medium mb-1"
                    >
                      Target Points
                    </label>
                    <input
                      type="number"
                      id="target-contribution"
                      className="input input-sm w-full"
                      min="0"
                      step="1"
                      placeholder="10"
                      value={targetContribution}
                      onChange={(e) =>
                        updateTargetContribution(
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                    <p className="text-xs text-base-content/60 mt-1">
                      Expected average contribution to total score
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rule Type
                    </label>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="checkbox"
                        id="global-rule"
                        className="checkbox checkbox-sm"
                        checked={isGlobal}
                        onChange={(e) => setIsGlobal(e.target.checked)}
                      />
                      <label
                        htmlFor="global-rule"
                        className="text-sm cursor-pointer"
                      >
                        Global rule (applies to all games, not tied to specific
                        cards)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 overflow-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-6 min-h-0">
            {/* Left Panel - Code Editor */}
            <div className="xl:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">TypeScript Formula</h3>
                <div className="text-sm text-base-content/70">
                  Write your scoring logic using the available context API
                </div>
              </div>

              <div className="flex-1 min-h-0 border border-base-300 rounded-lg">
                <MonacoEditor
                  value={formula}
                  onChange={updateFormula}
                  onCompile={handleCompileResult}
                  height="100%"
                  metadataSchema={currentDeck?.metadataSchema}
                />
              </div>

              {/* Compilation Errors */}
              {hasErrors && (
                <div className="alert alert-error">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h4 className="font-medium">Compilation Errors:</h4>
                    <pre className="text-sm mt-1 whitespace-pre-wrap">
                      {compilationResult.error}
                    </pre>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {compilationResult?.success &&
                compilationResult.diagnostics &&
                compilationResult.diagnostics.length > 0 && (
                  <div className="alert alert-warning">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="font-medium">Warnings:</h4>
                      <div className="text-sm mt-1">
                        {compilationResult.diagnostics.map((warning, i) => (
                          <div key={i}>{warning}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Right Panel - Templates and Testing */}
            <div className="flex flex-col gap-4 min-h-0">
              {/* Formula Templates */}
              <div
                className="flex flex-col min-h-0"
                style={{ maxHeight: "320px" }}
              >
                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                  <h3 className="text-lg font-semibold">Formula Templates</h3>
                  <div className="flex items-center gap-1 text-xs text-base-content/60">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Scroll for more
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                  <FormulaTemplates />
                </div>
              </div>

              {/* Test Runner */}
              <div className="flex-1 min-h-0 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 flex-shrink-0">
                  Test Your Formula
                </h3>
                <div className="flex-1 min-h-0">
                  <TestRunner />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation Footer */}
        <div className="border-t p-4 bg-base-50">
          <details className="collapse bg-base-100">
            <summary className="collapse-title text-sm font-medium">
              📚 Available API Reference
            </summary>
            <div className="collapse-content text-xs text-base-content/80">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <h4 className="font-medium mb-2">Board Utilities</h4>
                  <ul className="space-y-1 font-mono">
                    <li>getAllTiles()</li>
                    <li>getTileAt(row, col)</li>
                    <li>getAdjacentTiles(row, col)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Zone Analysis</h4>
                  <ul className="space-y-1 font-mono">
                    <li>findClusters(type?)</li>
                    <li>findLargestCluster(type)</li>
                    <li>countZonesOfType(type)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Scoring Helpers</h4>
                  <ul className="space-y-1 font-mono">
                    <li>sum(numbers)</li>
                    <li>max(numbers)</li>
                    <li>min(numbers)</li>
                    <li>count(items, predicate)</li>
                  </ul>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
