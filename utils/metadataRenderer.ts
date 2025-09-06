import { compileMetadataCanvasRenderer, validateCompiledCode } from './typescript-compiler';
import { CustomMetadataField } from '../types/metadataSystem';
import { CellData, GameState } from '../types/game';
import type { MetadataRenderContext } from '../types/metadata-context';

// Result of metadata rendering execution
export interface MetadataRenderResult {
  success: boolean;
  error?: string;
  executionTime: number;
  renderedCanvas?: HTMLCanvasElement;
}

// Cache for compiled metadata renderers
const rendererCache = new Map<string, string>();

/**
 * Execute a metadata rendering formula directly on Canvas
 */
export async function executeMetadataRenderer(
  field: CustomMetadataField,
  context: MetadataRenderContext
): Promise<MetadataRenderResult> {
  const startTime = performance.now();

  try {
    // Use cached compiled code if available
    let compiledCode = field.compiledRenderFormula;
    if (!compiledCode && field.renderFormula) {
      const compilation = await compileMetadataCanvasRenderer(field.renderFormula);
      if (!compilation.success) {
        return {
          success: false,
          error: compilation.error || 'Compilation failed',
          executionTime: performance.now() - startTime,
        };
      }
      compiledCode = compilation.compiled;
    }

    if (!compiledCode) {
      return {
        success: false,
        error: 'No compiled render formula available',
        executionTime: performance.now() - startTime,
      };
    }

    // Validate the compiled code for security
    const validation = validateCompiledCode(compiledCode);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || 'Code validation failed',
        executionTime: performance.now() - startTime,
      };
    }

    // Execute the rendering code to get a rendered canvas
    const result = await executeInWorker(compiledCode, context);
    
    return {
      success: !result.error,
      error: result.error,
      executionTime: performance.now() - startTime,
      renderedCanvas: result.canvas,
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown rendering error',
      executionTime: performance.now() - startTime,
    };
  }
}

/**
 * Execute metadata rendering on a dedicated canvas element
 * Users receive their own canvas to draw on, which we then composite
 */
function executeInWorker(
  compiledCode: string,
  context: MetadataRenderContext
): Promise<{ error?: string; canvas?: HTMLCanvasElement }> {
  return new Promise((resolve) => {
    try {
      // Create a dedicated canvas for the user's rendering with tile aspect ratio (3:2)
      const userCanvas = document.createElement('canvas');
      userCanvas.width = 60; // 3:2 aspect ratio to match tile dimensions
      userCanvas.height = 40;
      const userCtx = userCanvas.getContext('2d');
      
      if (!userCtx) {
        resolve({ error: 'Could not create canvas context' });
        return;
      }

      // Create execution context with the user's canvas
      const safeContext = {
        ...context,
        canvas: userCanvas,
        // Also provide direct context access for convenience
        ctx: userCtx,
      };

      // Create a safe function that executes the user code
      const wrappedFunction = new Function(
        'context', 'metadata', 'field', 'zone', 'zonePosition', 'gameState', 
        'canvas', 'ctx', 'cellWidth', 'cellHeight',
        `
        ${compiledCode}
        
        if (typeof renderMetadata === 'function') {
          return renderMetadata(context);
        } else {
          throw new Error('renderMetadata function not found');
        }
        `
      );

      // Execute with timeout protection
      const timeout = setTimeout(() => {
        resolve({ error: 'Metadata rendering timed out' });
      }, 1000); // 1 second timeout for direct execution

      try {
        wrappedFunction(
          safeContext, 
          safeContext.metadata, 
          safeContext.field, 
          safeContext.zone, 
          safeContext.zonePosition, 
          safeContext.gameState,
          userCanvas,
          userCtx,
          safeContext.cellWidth,
          safeContext.cellHeight
        );
        
        clearTimeout(timeout);
        resolve({ canvas: userCanvas }); // Return the rendered canvas
      } catch (error) {
        clearTimeout(timeout);
        resolve({ error: error instanceof Error ? error.message : 'Unknown error' });
      }

    } catch (error) {
      resolve({ error: error instanceof Error ? error.message : 'Execution error' });
    }
  });
}

/**
 * Compile and cache a metadata render formula
 */
export async function compileAndCacheMetadataRenderer(
  field: CustomMetadataField
): Promise<{ success: boolean; error?: string }> {
  if (!field.renderFormula) {
    return { success: true }; // No formula to compile
  }

  try {
    const compilation = await compileMetadataCanvasRenderer(field.renderFormula);
    if (compilation.success) {
      // Update the field with compiled code (this would be persisted by the calling component)
      field.compiledRenderFormula = compilation.compiled;
      rendererCache.set(field.id, compilation.compiled);
      return { success: true };
    } else {
      return { success: false, error: compilation.error };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Compilation error',
    };
  }
}

/**
 * Render all metadata fields for a zone using drawImage composition
 */
export async function renderZoneMetadataOnCanvas(
  ctx: CanvasRenderingContext2D,
  cellX: number,
  cellY: number,
  cellWidth: number,
  cellHeight: number,
  zone: CellData,
  zonePosition: { row: number; col: number },
  metadataFields: CustomMetadataField[],
  gameState?: GameState
): Promise<void> {
  if (!zone.customMetadata) {
    return;
  }

  // Filter fields that have rendering enabled
  const renderableFields = metadataFields.filter(
    field => field.renderOnCard && field.renderFormula
  );

  if (renderableFields.length === 0) {
    return;
  }

  // Execute each field's renderer and composite the results
  for (const field of renderableFields) {
    const context: MetadataRenderContext = {
      metadata: zone.customMetadata,
      field,
      zone,
      zonePosition,
      gameState,
      canvas: document.createElement('canvas'), // Placeholder, will be replaced in executeInWorker
      cellWidth,
      cellHeight,
    };

    try {
      const result = await executeMetadataRenderer(field, context);
      if (result.error) {
        console.warn(`Error rendering metadata field ${field.name}:`, result.error);
      } else if (result.renderedCanvas) {
        // Composite the user's rendered canvas onto the main canvas
        ctx.drawImage(
          result.renderedCanvas,
          0, 0, 60, 40, // Source: full 60x40 user canvas (3:2 aspect ratio)
          cellX, cellY, cellWidth, cellHeight // Destination: scaled to actual cell size
        );
      }
    } catch (error) {
      console.warn(`Error rendering metadata field ${field.name}:`, error);
    }
  }
}