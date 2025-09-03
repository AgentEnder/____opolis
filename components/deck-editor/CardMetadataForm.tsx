import { useState, useEffect } from 'react';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import { CardDefinition } from '../../types/deck';
import { MetadataSchema, CustomMetadata, CustomMetadataField } from '../../types/metadataSystem';
import { validateMetadata, createDefaultMetadata } from '../../utils/metadataValidation';

interface CardMetadataFormProps {
  card: CardDefinition;
  cardIndex: number;
  metadataSchema: MetadataSchema | null;
}

export function CardMetadataForm({ card, cardIndex, metadataSchema }: CardMetadataFormProps) {
  const { updateCardMetadata } = useDeckEditorStore();
  const [metadata, setMetadata] = useState<CustomMetadata>(() => {
    if (card.customMetadata) {
      return { ...card.customMetadata };
    }
    return metadataSchema ? createDefaultMetadata(metadataSchema.fields) : {};
  });

  // Update metadata when card or schema changes
  useEffect(() => {
    if (card.customMetadata) {
      setMetadata({ ...card.customMetadata });
    } else if (metadataSchema) {
      setMetadata(createDefaultMetadata(metadataSchema.fields));
    }
  }, [card.customMetadata, metadataSchema]);

  if (!metadataSchema || metadataSchema.fields.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-500">No metadata fields defined</div>
      </div>
    );
  }

  const validationErrors = validateMetadata(metadata, metadataSchema.fields);
  const hasErrors = validationErrors.length > 0;

  const handleFieldChange = (fieldId: string, value: any) => {
    const newMetadata = { ...metadata, [fieldId]: value };
    setMetadata(newMetadata);
  };

  const handleSave = () => {
    if (!hasErrors) {
      updateCardMetadata(cardIndex, metadata);
    }
  };

  const handleReset = () => {
    const defaultMetadata = createDefaultMetadata(metadataSchema.fields);
    setMetadata(defaultMetadata);
  };

  const renderFieldEditor = (field: CustomMetadataField) => {
    const value = metadata[field.id];
    const fieldError = validationErrors.find(e => e.fieldId === field.id);

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className={`input input-bordered w-full ${fieldError ? 'input-error' : ''}`}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className={`input input-bordered w-full ${fieldError ? 'input-error' : ''}`}
            value={(value as number) || ''}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || 0)}
            min={field.min}
            max={field.max}
            step="any"
          />
        );

      case 'boolean':
        return (
          <div className="form-control">
            <label className="label cursor-pointer justify-start">
              <input
                type="checkbox"
                className="checkbox mr-3"
                checked={(value as boolean) || false}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              />
              <span className="label-text">
                {(value as boolean) ? 'Yes' : 'No'}
              </span>
            </label>
          </div>
        );

      case 'select':
        return (
          <select
            className={`select select-bordered w-full ${fieldError ? 'select-error' : ''}`}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          >
            <option value="">Choose an option...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <div className="text-gray-500 italic">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">
          Metadata for: {card.name || `Card ${card.id.slice(-4)}`}
        </h4>
        <div className="flex space-x-2">
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={hasErrors}
          >
            Save
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {hasErrors && (
        <div className="alert alert-error alert-sm">
          <div>
            <div className="font-medium">Please fix the following errors:</div>
            <ul className="list-disc list-inside text-sm mt-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Metadata Fields */}
      <div className="space-y-4">
        {metadataSchema.fields.map((field) => {
          const fieldError = validationErrors.find(e => e.fieldId === field.id);
          
          return (
            <div key={field.id} className="space-y-2">
              <label className="label">
                <span className="label-text flex items-center">
                  {field.name}
                  {field.required && <span className="text-error ml-1">*</span>}
                </span>
                {field.description && (
                  <span className="label-text-alt text-gray-500">
                    {field.description}
                  </span>
                )}
              </label>
              
              {renderFieldEditor(field)}
              
              {fieldError && (
                <div className="text-error text-sm">{fieldError.message}</div>
              )}
              
              {/* Field constraints info */}
              {field.type === 'number' && (field.min !== undefined || field.max !== undefined) && (
                <div className="text-xs text-gray-500">
                  Range: {field.min ?? '−∞'} to {field.max ?? '∞'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Metadata Preview */}
      <div className="mt-6 p-4 bg-base-200 rounded-lg">
        <h5 className="font-medium mb-2">Current Metadata (JSON):</h5>
        <pre className="text-xs bg-base-300 p-2 rounded overflow-x-auto">
          {JSON.stringify(metadata, null, 2)}
        </pre>
      </div>
    </div>
  );
}