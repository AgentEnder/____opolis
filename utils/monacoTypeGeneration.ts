import { CustomMetadataField, MetadataSchema } from '../types/metadataSystem';

/**
 * Generates TypeScript type definitions for custom metadata
 * These types are injected into Monaco Editor for IntelliSense
 */
export class MetadataTypeGenerator {
  /**
   * Generates TypeScript definitions from metadata schema
   */
  generateTypesFromSchema(metadataSchema: MetadataSchema): string {
    if (!metadataSchema.fields || metadataSchema.fields.length === 0) {
      return this.generateEmptyTypes();
    }

    const fields = metadataSchema.fields.map(field => {
      const type = this.getTypeScriptType(field);
      const optional = field.required ? '' : '?';
      const comment = field.description ? `\n  /** ${field.description} */` : '';
      return `${comment}\n  ${field.id}${optional}: ${type};`;
    }).join('\n');

    return `
// Auto-generated metadata types for Monaco Editor
interface CustomCardMetadata {${fields}
}

// Enhanced tile interface with typed metadata
interface TileWithMetadata extends Tile {
  card?: Card & {
    customMetadata?: CustomCardMetadata;
  };
}

// Enhanced context with typed metadata access
interface TypedScoringContext extends ScoringContext {
  getAllTiles(): TileWithMetadata[];
  getTileAt(row: number, col: number): TileWithMetadata | null;
  getAdjacentTiles(row: number, col: number): TileWithMetadata[];
  getTilesInRadius(center: {row: number; col: number}, radius: number): TileWithMetadata[];
}

// Override the global ScoringContext type to include metadata support
declare const context: TypedScoringContext;
`;
  }

  /**
   * Converts a metadata field to TypeScript type
   */
  private getTypeScriptType(field: CustomMetadataField): string {
    switch (field.type) {
      case 'number':
        return 'number';
      case 'text':
        return 'string';
      case 'boolean':
        return 'boolean';
      case 'select':
        if (field.options && field.options.length > 0) {
          // Generate union type from options
          return field.options.map(opt => `'${opt}'`).join(' | ');
        }
        return 'string';
      default:
        return 'any';
    }
  }

  /**
   * Generates empty types when no metadata schema exists
   */
  private generateEmptyTypes(): string {
    return `
// No custom metadata defined
interface CustomCardMetadata {}

// Enhanced tile interface with typed metadata
interface TileWithMetadata extends Tile {
  card?: Card & {
    customMetadata?: CustomCardMetadata;
  };
}

// Enhanced context with typed metadata access
interface TypedScoringContext extends ScoringContext {
  getAllTiles(): TileWithMetadata[];
  getTileAt(row: number, col: number): TileWithMetadata | null;
  getAdjacentTiles(row: number, col: number): TileWithMetadata[];
  getTilesInRadius(center: {row: number; col: number}, radius: number): TileWithMetadata[];
}

// Override the global ScoringContext type to include metadata support
declare const context: TypedScoringContext;
`;
  }

  /**
   * Injects generated types into Monaco's TypeScript environment
   */
  updateMonacoTypes(monaco: any, typeDefinitions: string): void {
    try {
      const uri = monaco.Uri.parse('file:///custom-metadata-types.d.ts');
      
      // Remove existing extra lib if it exists
      const existingModels = monaco.editor.getModels();
      for (const model of existingModels) {
        if (model.uri.toString() === uri.toString()) {
          model.dispose();
          break;
        }
      }

      // Add updated types
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        typeDefinitions,
        uri.toString()
      );
    } catch (error) {
      console.error('Failed to update Monaco types:', error);
    }
  }

  /**
   * Generates example scoring function with metadata usage
   */
  generateExampleUsage(metadataSchema: MetadataSchema): string {
    if (!metadataSchema.fields || metadataSchema.fields.length === 0) {
      return `
// Example: Basic scoring without custom metadata
function calculateScore(context: ScoringContext): number {
  const tiles = context.getAllTiles();
  return tiles.length * 2;
}
`;
    }

    const exampleField = metadataSchema.fields[0];
    const exampleUsage = this.generateFieldUsageExample(exampleField);

    return `
// Example: Scoring with custom metadata
function calculateScore(context: TypedScoringContext): number {
  let totalScore = 0;
  
  for (const tile of context.getAllTiles()) {
    const metadata = tile.card?.customMetadata;
    if (metadata) {
      ${exampleUsage}
    }
  }
  
  return totalScore;
}
`;
  }

  /**
   * Generates example usage for a specific metadata field
   */
  private generateFieldUsageExample(field: CustomMetadataField): string {
    switch (field.type) {
      case 'number':
        return `// ${field.description || field.name}
      const ${field.id} = metadata.${field.id}; // TypeScript knows this is number
      totalScore += ${field.id} * 2;`;

      case 'boolean':
        return `// ${field.description || field.name}
      if (metadata.${field.id}) {
        totalScore += 5; // Bonus when ${field.name} is true
      }`;

      case 'select':
        const firstOption = field.options?.[0] || 'option1';
        return `// ${field.description || field.name}
      if (metadata.${field.id} === '${firstOption}') {
        totalScore += 10; // Bonus for ${firstOption}
      }`;

      case 'text':
        return `// ${field.description || field.name}
      if (metadata.${field.id}.length > 0) {
        totalScore += 3; // Bonus for having ${field.name}
      }`;

      default:
        return `// Use ${field.name}
      totalScore += 1;`;
    }
  }
}