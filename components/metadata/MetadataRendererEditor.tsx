import { useState, useEffect, useRef } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import { compileMetadataCanvasRenderer } from "../../utils/typescript-compiler";
import { CustomMetadataField } from "../../types/metadataSystem";
import { getMetadataRenderingApiTypes } from "../../utils/monaco-metadata-types";
import type { editor } from "monaco-editor";

interface MetadataRendererEditorProps {
  field: CustomMetadataField;
  onChange: (field: Partial<CustomMetadataField>) => void;
}

const DEFAULT_RENDERER_CODE = `/**
 * Render metadata on the card using Canvas 2D API
 * 
 * @param context - Rendering context with canvas and metadata
 * 
 * Available context properties:
 * - context.canvas: Your own 60x40 canvas element to draw on (3:2 aspect ratio)
 * - context.ctx: 2D rendering context for the canvas  
 * - context.metadata: All metadata values for this zone
 * - context.field: The current field definition
 * - context.zone: Zone data (type, roads, etc.)
 * - context.zonePosition: Position {row, col} in the card grid
 * - context.cellWidth, context.cellHeight: Actual zone dimensions
 * 
 * Coordinate system: 60x40 pixels (0,0 = top-left, 60,40 = bottom-right)
 */
function renderMetadata(context: MetadataRenderContext) {
  const { metadata, field, ctx } = context;
  const fieldValue = metadata[field.id];
  
  // Example: Display the field value as text in the top-left corner
  if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 8px Arial';
    ctx.fillText(String(fieldValue), 3, 12);
  }
  
  // Example: Draw a colored badge with number in top-right corner
  // ctx.fillStyle = '#ff6b35';
  // ctx.beginPath();
  // ctx.arc(54, 6, 5, 0, 2 * Math.PI); // Circle at (54,6) with radius 5
  // ctx.fill();
  // 
  // ctx.fillStyle = 'white';
  // ctx.font = 'bold 6px Arial';
  // ctx.textAlign = 'center';
  // ctx.fillText(String(fieldValue), 54, 9);
}`;

export function MetadataRendererEditor({
  field,
  onChange,
}: MetadataRendererEditorProps) {
  const [code, setCode] = useState(
    field.renderFormula || DEFAULT_RENDERER_CODE
  );
  const [compilationErrors, setCompilationErrors] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Auto-compile on code change
  useEffect(() => {
    const compileCode = async () => {
      if (!code.trim()) return;

      setIsCompiling(true);
      try {
        const result = await compileMetadataCanvasRenderer(code);
        if (result.success) {
          setCompilationErrors([]);
          onChange({
            renderFormula: code,
            compiledRenderFormula: result.compiled,
          });
        } else {
          setCompilationErrors(
            result.diagnostics || [result.error || "Compilation failed"]
          );
        }
      } catch (error) {
        setCompilationErrors([
          error instanceof Error ? error.message : "Unknown error",
        ]);
      } finally {
        setIsCompiling(false);
      }
    };

    const debounceTimer = setTimeout(compileCode, 1000); // Debounce compilation
    return () => clearTimeout(debounceTimer);
  }, [code, onChange]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add TypeScript definitions for metadata rendering API
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      getMetadataRenderingApiTypes(),
      "metadata-rendering-api.d.ts"
    );

    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noImplicitReturns: true,
      noUnusedLocals: false, // Allow unused variables for user convenience
      noUnusedParameters: false,
      esModuleInterop: true,
    });

    // Set up model markers listener for compilation feedback
    const model = editor.getModel();
    if (model) {
      const updateMarkers = () => {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        const errors = markers
          .filter((d) => d.severity >= 8) // Error severity
          .map((d) => `Line ${d.startLineNumber}: ${d.message}`);

        if (
          errors.length !== compilationErrors.length ||
          !errors.every((error, i) => error === compilationErrors[i])
        ) {
          setCompilationErrors(errors);
        }
      };

      // Listen for marker changes
      monaco.editor.onDidChangeMarkers(() => updateMarkers());

      // Initial marker check
      setTimeout(updateMarkers, 500);
    }
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      setCode(newValue);
    }
  };

  const handleRenderOnCardChange = (checked: boolean) => {
    onChange({ renderOnCard: checked });
  };

  return (
    <div className="space-y-4">
      {/* Enable/Disable Rendering */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">
            Show this field on cards
            <div className="text-xs text-gray-500 mt-1">
              When enabled, the render formula below will be executed to display
              this field on cards
            </div>
          </span>
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={field.renderOnCard || false}
            onChange={(e) => handleRenderOnCardChange(e.target.checked)}
          />
        </label>
      </div>

      {field.renderOnCard && (
        <>
          {/* Compilation Status */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Render Formula</h4>
            <div className="flex items-center space-x-2">
              {isCompiling && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <span className="loading loading-spinner loading-xs"></span>
                  <span>Compiling...</span>
                </div>
              )}
              {!isCompiling && compilationErrors.length === 0 && (
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <span>✓</span>
                  <span>Ready</span>
                </div>
              )}
              {!isCompiling && compilationErrors.length > 0 && (
                <div className="flex items-center space-x-1 text-sm text-red-600">
                  <span>✗</span>
                  <span>
                    {compilationErrors.length} error
                    {compilationErrors.length === 1 ? "" : "s"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="300px"
              language="typescript"
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                readOnly: false,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                tabSize: 2,
                insertSpaces: true,
                renderWhitespace: "selection",
                lineNumbers: "on",
                glyphMargin: false,
                folding: false,
                contextmenu: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Compilation Errors */}
          {compilationErrors.length > 0 && (
            <div className="alert alert-error">
              <div>
                <h4 className="font-medium">Compilation Errors:</h4>
                <ul className="list-disc list-inside text-sm mt-1">
                  {compilationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
