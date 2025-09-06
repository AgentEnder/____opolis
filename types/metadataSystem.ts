/**
 * Base types for the custom metadata system
 * These types define the foundation for card-level custom properties
 */

export interface CustomMetadataField {
  id: string;
  name: string;
  type: 'number' | 'text' | 'boolean' | 'select';
  description?: string;
  defaultValue?: any;
  options?: string[]; // For select type
  min?: number; // For number type
  max?: number; // For number type
  required?: boolean;
  // Rendering configuration
  renderOnCard?: boolean; // Whether to render this field on cards
  renderFormula?: string; // TypeScript code for rendering
  compiledRenderFormula?: string; // Compiled JavaScript for rendering
}

export interface CustomMetadata {
  [fieldId: string]: number | string | boolean;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}

export interface MetadataSchema {
  fields: CustomMetadataField[];
  version: string;
}