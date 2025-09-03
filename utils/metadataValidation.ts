import { CustomMetadata, CustomMetadataField, ValidationError } from '../types/metadataSystem';

/**
 * Validates custom metadata against a schema
 */
export function validateMetadata(
  metadata: CustomMetadata,
  schema: CustomMetadataField[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check required fields
  for (const field of schema) {
    if (field.required && (metadata[field.id] === undefined || metadata[field.id] === null)) {
      errors.push({
        fieldId: field.id,
        message: `${field.name} is required`
      });
      continue;
    }

    const value = metadata[field.id];
    if (value === undefined || value === null) continue;

    // Type validation
    switch (field.type) {
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push({
            fieldId: field.id,
            message: `${field.name} must be a valid number`
          });
        } else {
          // Range validation
          if (field.min !== undefined && value < field.min) {
            errors.push({
              fieldId: field.id,
              message: `${field.name} must be at least ${field.min}`
            });
          }
          if (field.max !== undefined && value > field.max) {
            errors.push({
              fieldId: field.id,
              message: `${field.name} must be at most ${field.max}`
            });
          }
        }
        break;

      case 'text':
        if (typeof value !== 'string') {
          errors.push({
            fieldId: field.id,
            message: `${field.name} must be text`
          });
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({
            fieldId: field.id,
            message: `${field.name} must be true or false`
          });
        }
        break;

      case 'select':
        if (typeof value !== 'string' || !field.options?.includes(value)) {
          errors.push({
            fieldId: field.id,
            message: `${field.name} must be one of: ${field.options?.join(', ')}`
          });
        }
        break;
    }
  }

  return errors;
}

/**
 * Creates default metadata values from a schema
 */
export function createDefaultMetadata(schema: CustomMetadataField[]): CustomMetadata {
  const metadata: CustomMetadata = {};

  for (const field of schema) {
    if (field.defaultValue !== undefined) {
      metadata[field.id] = field.defaultValue;
    } else if (field.required) {
      // Provide sensible defaults for required fields
      switch (field.type) {
        case 'number':
          metadata[field.id] = field.min ?? 0;
          break;
        case 'text':
          metadata[field.id] = '';
          break;
        case 'boolean':
          metadata[field.id] = false;
          break;
        case 'select':
          metadata[field.id] = field.options?.[0] ?? '';
          break;
      }
    }
  }

  return metadata;
}

/**
 * Validates a metadata schema
 */
export function validateMetadataSchema(schema: CustomMetadataField[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const fieldIds = new Set<string>();

  for (const field of schema) {
    // Check for duplicate IDs
    if (fieldIds.has(field.id)) {
      errors.push({
        fieldId: field.id,
        message: `Field ID "${field.id}" is already used`
      });
    } else {
      fieldIds.add(field.id);
    }

    // Validate field ID format (must be valid TypeScript identifier)
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(field.id)) {
      errors.push({
        fieldId: field.id,
        message: `Field ID "${field.id}" must be a valid identifier (letters, numbers, underscore)`
      });
    }

    // Validate select type has options
    if (field.type === 'select' && (!field.options || field.options.length === 0)) {
      errors.push({
        fieldId: field.id,
        message: `Select field "${field.name}" must have at least one option`
      });
    }

    // Validate number type ranges
    if (field.type === 'number') {
      if (field.min !== undefined && field.max !== undefined && field.min > field.max) {
        errors.push({
          fieldId: field.id,
          message: `Field "${field.name}" minimum value cannot be greater than maximum value`
        });
      }
    }
  }

  return errors;
}