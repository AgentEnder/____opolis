import { useEffect, useRef, useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { getScoringApiTypes } from '../../utils/monaco-types';
import { MetadataSchema } from '../../types/metadataSystem';
import { MetadataTypeGenerator } from '../../utils/monacoTypeGeneration';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCompile?: (diagnostics: editor.IMarkerData[]) => void;
  readonly?: boolean;
  height?: string;
  metadataSchema?: MetadataSchema | null;
}


export function MonacoEditor({
  value,
  onChange,
  onCompile,
  readonly = false,
  height = "400px",
  metadataSchema = null,
}: MonacoEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isReady, setIsReady] = useState(false);
  const typeGeneratorRef = useRef(new MetadataTypeGenerator());
  const monacoRef = useRef<any>(null);

  // Update metadata types when schema changes
  useEffect(() => {
    if (monacoRef.current && isReady) {
      if (metadataSchema) {
        const metadataTypes = typeGeneratorRef.current.generateTypesFromSchema(metadataSchema);
        typeGeneratorRef.current.updateMonacoTypes(monacoRef.current, metadataTypes);
      }
    }
  }, [metadataSchema, isReady]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Add TypeScript definitions for scoring API
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      getScoringApiTypes(),
      "scoring-api.d.ts"
    );

    // Add custom metadata types if schema is provided
    if (metadataSchema) {
      const metadataTypes = typeGeneratorRef.current.generateTypesFromSchema(metadataSchema);
      typeGeneratorRef.current.updateMonacoTypes(monaco, metadataTypes);
    }

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
    if (model && onCompile) {
      const updateMarkers = () => {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        onCompile(markers);
      };

      // Listen for marker changes
      monaco.editor.onDidChangeMarkers(() => updateMarkers());

      // Initial marker check
      setTimeout(updateMarkers, 500);
    }

    setIsReady(true);
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  // Configure editor options
  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    readOnly: readonly,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on",
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: "on",
    contextmenu: true,
    folding: true,
    suggest: {
      insertMode: "replace",
      snippetsPreventQuickSuggestions: false,
    },
  };

  return (
    <>
      <Editor
        height={height}
        defaultLanguage="typescript"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={editorOptions}
        theme="vs-dark"
      />
      {!isReady && (
        <div className="flex items-center justify-center p-8">
          <span className="loading loading-spinner loading-md"></span>
          <span className="ml-2">Loading TypeScript Editor...</span>
        </div>
      )}
    </>
  );
}
