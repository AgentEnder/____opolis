import { create } from 'zustand';
import { CustomMetadataField, MetadataSchema, ValidationError } from '../types/metadataSystem';
import { validateMetadataSchema } from '../utils/metadataValidation';

interface MetadataStoreState {
  currentSchema: MetadataSchema | null;
  validationErrors: ValidationError[];
  isEditingSchema: boolean;

  // Actions
  setSchema: (schema: MetadataSchema) => void;
  updateSchema: (fields: CustomMetadataField[]) => void;
  addField: (field: CustomMetadataField) => void;
  updateField: (fieldId: string, field: Partial<CustomMetadataField>) => void;
  removeField: (fieldId: string) => void;
  validateSchema: () => ValidationError[];
  clearSchema: () => void;
  setEditingSchema: (editing: boolean) => void;

  // Helper functions
  getFieldById: (fieldId: string) => CustomMetadataField | undefined;
  generateFieldId: (baseName: string) => string;
}

export const useMetadataStore = create<MetadataStoreState>()((set, get) => ({
  currentSchema: null,
  validationErrors: [],
  isEditingSchema: false,

  setSchema: (schema: MetadataSchema) => {
    const errors = validateMetadataSchema(schema.fields);
    set({
      currentSchema: schema,
      validationErrors: errors,
    });
  },

  updateSchema: (fields: CustomMetadataField[]) => {
    const schema: MetadataSchema = {
      fields,
      version: '1.0.0',
    };
    const errors = validateMetadataSchema(fields);
    set({
      currentSchema: schema,
      validationErrors: errors,
    });
  },

  addField: (field: CustomMetadataField) => {
    const { currentSchema } = get();
    const fields = currentSchema?.fields || [];
    const newFields = [...fields, field];
    const errors = validateMetadataSchema(newFields);
    
    set({
      currentSchema: {
        fields: newFields,
        version: currentSchema?.version || '1.0.0',
      },
      validationErrors: errors,
    });
  },

  updateField: (fieldId: string, updates: Partial<CustomMetadataField>) => {
    const { currentSchema } = get();
    if (!currentSchema) return;

    const newFields = currentSchema.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    const errors = validateMetadataSchema(newFields);

    set({
      currentSchema: {
        ...currentSchema,
        fields: newFields,
      },
      validationErrors: errors,
    });
  },

  removeField: (fieldId: string) => {
    const { currentSchema } = get();
    if (!currentSchema) return;

    const newFields = currentSchema.fields.filter(field => field.id !== fieldId);
    const errors = validateMetadataSchema(newFields);

    set({
      currentSchema: {
        ...currentSchema,
        fields: newFields,
      },
      validationErrors: errors,
    });
  },

  validateSchema: () => {
    const { currentSchema } = get();
    if (!currentSchema) return [];

    const errors = validateMetadataSchema(currentSchema.fields);
    set({ validationErrors: errors });
    return errors;
  },

  clearSchema: () => {
    set({
      currentSchema: null,
      validationErrors: [],
    });
  },

  setEditingSchema: (editing: boolean) => {
    set({ isEditingSchema: editing });
  },

  getFieldById: (fieldId: string) => {
    const { currentSchema } = get();
    return currentSchema?.fields.find(field => field.id === fieldId);
  },

  generateFieldId: (baseName: string) => {
    const { currentSchema } = get();
    const existingIds = new Set(currentSchema?.fields.map(f => f.id) || []);
    
    // Convert base name to camelCase identifier
    let baseId = baseName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    if (!baseId) {
      baseId = 'field';
    }

    // Ensure it starts with a letter
    if (!/^[a-zA-Z]/.test(baseId)) {
      baseId = 'field' + baseId.charAt(0).toUpperCase() + baseId.slice(1);
    }

    // Find a unique ID
    let counter = 1;
    let candidateId = baseId;
    while (existingIds.has(candidateId)) {
      candidateId = `${baseId}${counter}`;
      counter++;
    }

    return candidateId;
  },
}));