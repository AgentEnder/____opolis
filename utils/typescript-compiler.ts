import type { CompilationResult } from '../types/scoring-formulas';

// Browser-based TypeScript compilation
export async function compileTypeScript(source: string): Promise<CompilationResult> {
  try {
    // Dynamically import TypeScript compiler for browser use
    const ts = await import('typescript');
    
    // Validate that the source contains a calculateScore function
    if (!source.includes('calculateScore')) {
      return {
        source,
        compiled: '',
        success: false,
        error: 'Formula must contain a "calculateScore" function',
        diagnostics: ['Missing required "calculateScore" function'],
      };
    }
    
    // Wrap the user's code in a module-like structure
    const wrappedSource = `
${source}

// Export the calculate function for execution
if (typeof calculateScore === 'function') {
  self.calculateScore = calculateScore;
} else {
  throw new Error('calculateScore function not found or not properly defined');
}
`;
    
    // Configure compiler options for browser execution
    const compilerOptions: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None, // No modules for Web Worker execution
      lib: ['ES2020'],
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noImplicitReturns: true,
      noUnusedLocals: false, // Allow unused variables for user convenience
      noUnusedParameters: false,
      removeComments: false, // Keep comments for debugging
    };
    
    // Compile the TypeScript
    const result = ts.transpileModule(wrappedSource, {
      compilerOptions,
      reportDiagnostics: true,
    });
    
    // Check for compilation errors
    const errors = result.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error) || [];
    const warnings = result.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Warning) || [];
    
    if (errors.length > 0) {
      return {
        source,
        compiled: '',
        success: false,
        error: formatDiagnostics(errors, ts),
        diagnostics: errors.map(d => formatSingleDiagnostic(d, ts)),
      };
    }
    
    // Validate compiled output
    const compiled = result.outputText;
    if (!compiled || compiled.trim().length === 0) {
      return {
        source,
        compiled: '',
        success: false,
        error: 'Compilation produced empty output',
      };
    }
    
    return {
      source,
      compiled,
      success: true,
      diagnostics: warnings.map(d => formatSingleDiagnostic(d, ts)),
    };
    
  } catch (error) {
    return {
      source,
      compiled: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown compilation error',
    };
  }
}

// Format TypeScript diagnostics for user display
function formatDiagnostics(diagnostics: any[], ts: typeof import('typescript')): string {
  return diagnostics
    .map(diagnostic => formatSingleDiagnostic(diagnostic, ts))
    .join('\n');
}

function formatSingleDiagnostic(diagnostic: any, ts: typeof import('typescript')): string {
  if (diagnostic.file && diagnostic.start !== undefined) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    return `Line ${line + 1}, Column ${character + 1}: ${message}`;
  } else {
    return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  }
}

// Validate compiled JavaScript for basic security
export function validateCompiledCode(compiled: string): { isValid: boolean; error?: string } {
  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /\beval\s*\(/,
    /\bFunction\s*\(/,
    /\bsetTimeout\s*\(/,
    /\bsetInterval\s*\(/,
    /\bimportScripts\s*\(/,
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\bWebSocket\b/,
    /\blocation\b/,
    /\bwindow\b/,
    /\bdocument\b/,
    /\bnavigator\b/,
    /\blocalstorage\b/i,
    /\bsessionstorage\b/i,
    /\bindexeddb\b/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(compiled)) {
      return {
        isValid: false,
        error: `Security violation: Code contains forbidden pattern: ${pattern.source}`,
      };
    }
  }
  
  // Check for excessive complexity (simple heuristics)
  const lines = compiled.split('\n').length;
  if (lines > 1000) {
    return {
      isValid: false,
      error: 'Code is too complex (exceeds 1000 lines)',
    };
  }
  
  return { isValid: true };
}