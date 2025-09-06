// Utility to load TypeScript definitions for metadata rendering in Monaco Editor

// Import metadata context types as raw string
import metadataContextTypes from "../types/metadata-context.d.ts?raw";

// Function to get processed metadata rendering type definitions
export function getMetadataRenderingApiTypes(): string {
  const combinedTypes: string[] = [];

  // Add header comment
  combinedTypes.push("// TypeScript definitions for Metadata Rendering");
  combinedTypes.push("// Provides IntelliSense for canvas-based metadata rendering");
  combinedTypes.push("");

  let processedContent = metadataContextTypes;

  // Remove import statements (they won't work in Monaco)
  processedContent = processedContent.replace(/^import\s+.*?;?\s*$/gm, "");

  // Remove export keywords but keep the declarations
  processedContent = processedContent.replace(/^export\s+/gm, "declare ");

  // Ensure interface declarations are properly declared
  processedContent = processedContent.replace(/^interface\s/gm, "declare interface ");
  processedContent = processedContent.replace(/^type\s/gm, "declare type ");
  processedContent = processedContent.replace(/^function\s/gm, "declare function ");

  // Clean up double declarations
  processedContent = processedContent.replace(/^declare\s+declare\s+/gm, "declare ");

  // Remove empty lines at start/end
  processedContent = processedContent.trim();

  if (processedContent) {
    combinedTypes.push(processedContent);
  }

  return combinedTypes.join("\n");
}