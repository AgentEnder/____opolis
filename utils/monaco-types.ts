// Utility to combine multiple TypeScript definition files for Monaco Editor

// Import all relevant type files as raw strings
const typeFiles = import.meta.glob(["../types/**/*.ts"], {
  query: "?raw",
  import: "default",
  eager: true,
});

// Function to combine and process type definitions
export function getScoringApiTypes(): string {
  const combinedTypes: string[] = [];

  // Add a header comment
  combinedTypes.push("// Combined TypeScript definitions for Monaco Editor");
  combinedTypes.push("// Generated from multiple type files");
  combinedTypes.push("");

  // Process each type file
  Object.entries(typeFiles).forEach(([filePath, content]) => {
    const fileName =
      filePath
        .split("/")
        .pop()
        ?.replace(/\.(ts|d\.ts)$/, "") || "unknown";

    // Add file header
    combinedTypes.push(`// From ${fileName}`);

    let processedContent = content as string;

    // Remove import statements (they won't work in Monaco)
    processedContent = processedContent.replace(/^import\s+.*?;?\s*$/gm, "");

    // Remove export keywords but keep the declarations
    processedContent = processedContent.replace(/^export\s+/gm, "declare ");

    // Ensure interface declarations are properly declared
    processedContent = processedContent.replace(
      /^interface\s/gm,
      "declare interface "
    );
    processedContent = processedContent.replace(/^type\s/gm, "declare type ");
    processedContent = processedContent.replace(
      /^function\s/gm,
      "declare function "
    );

    // Clean up double declarations
    processedContent = processedContent.replace(
      /^declare\s+declare\s+/gm,
      "declare "
    );

    // Remove empty lines at start/end
    processedContent = processedContent.trim();

    if (processedContent) {
      combinedTypes.push(processedContent);
      combinedTypes.push(""); // Add spacing between files
    }
  });

  return combinedTypes.join("\n");
}
