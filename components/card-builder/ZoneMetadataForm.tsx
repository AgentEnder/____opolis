import { useState, useEffect } from 'react';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import { MetadataSchema, CustomMetadata, CustomMetadataField } from '../../types/metadataSystem';
import { validateMetadata, createDefaultMetadata } from '../../utils/metadataValidation';
import { CellData } from '../../types/game';

interface ZoneMetadataFormProps {
  zoneData: CellData;
  cardIndex: number;
  zoneRow: number;
  zoneCol: number;
  metadataSchema: MetadataSchema | null;
  onMetadataChange?: (metadata: CustomMetadata) => void;
}

export function ZoneMetadataForm({ 
  zoneData, 
  cardIndex, 
  zoneRow, 
  zoneCol, 
  metadataSchema,
  onMetadataChange 
}: ZoneMetadataFormProps) {
  const { updateZoneMetadata, currentDeck } = useDeckEditorStore();
  const [metadata, setMetadata] = useState<CustomMetadata>(() => {
    if (zoneData.customMetadata) {
      return { ...zoneData.customMetadata };
    }
    
    // Try to get defaults from zone type
    const zoneType = currentDeck?.zoneTypes?.find(zt => zt.id === zoneData.type);
    if (zoneType?.defaultMetadata) {
      return { ...zoneType.defaultMetadata };
    }
    
    return metadataSchema ? createDefaultMetadata(metadataSchema.fields) : {};
  });

  // Update metadata when zone data or schema changes
  useEffect(() => {
    if (zoneData.customMetadata) {
      setMetadata({ ...zoneData.customMetadata });
    } else if (metadataSchema) {
      const zoneType = currentDeck?.zoneTypes?.find(zt => zt.id === zoneData.type);
      const defaultMetadata = zoneType?.defaultMetadata || createDefaultMetadata(metadataSchema.fields);
      setMetadata(defaultMetadata);
    }
  }, [zoneData.customMetadata, zoneData.type, metadataSchema, currentDeck]);

  if (!metadataSchema || metadataSchema.fields.length === 0) {
    return (
      <div className="text-center py-3">
        <div className="text-gray-500 text-sm">No metadata schema defined</div>
      </div>
    );
  }

  const validationErrors = validateMetadata(metadata, metadataSchema.fields);
  const hasErrors = validationErrors.length > 0;

  const handleFieldChange = (fieldId: string, value: any) => {
    const newMetadata = { ...metadata, [fieldId]: value };
    setMetadata(newMetadata);
    onMetadataChange?.(newMetadata);
  };

  const handleSave = () => {
    if (!hasErrors) {
      updateZoneMetadata(cardIndex, zoneRow, zoneCol, metadata);
    }
  };

  const handleReset = () => {
    const zoneType = currentDeck?.zoneTypes?.find(zt => zt.id === zoneData.type);
    const defaultMetadata = zoneType?.defaultMetadata || createDefaultMetadata(metadataSchema.fields);
    setMetadata(defaultMetadata);
    onMetadataChange?.(defaultMetadata);
  };

  const renderFieldEditor = (field: CustomMetadataField) => {
    const value = metadata[field.id];
    const fieldError = validationErrors.find(e => e.fieldId === field.id);

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className={`input input-bordered input-sm w-full ${fieldError ? 'input-error' : ''}`}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className={`input input-bordered input-sm w-full ${fieldError ? 'input-error' : ''}`}
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
                className="checkbox checkbox-sm mr-2"
                checked={(value as boolean) || false}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              />
              <span className="label-text text-sm">
                {(value as boolean) ? 'Yes' : 'No'}
              </span>
            </label>
          </div>
        );

      case 'select':
        return (
          <select
            className={`select select-bordered select-sm w-full ${fieldError ? 'select-error' : ''}`}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          >
            <option value="">Choose...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <div className="text-gray-500 italic text-sm">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-sm">Zone Metadata</h5>
        <div className="flex space-x-1">
          <button
            className="btn btn-ghost btn-xs"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="btn btn-primary btn-xs"
            onClick={handleSave}
            disabled={hasErrors}
          >
            Save
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {hasErrors && (
        <div className="alert alert-error alert-sm py-2">
          <div className="text-xs">
            {validationErrors.map((error, index) => (
              <div key={index}>{error.message}</div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Fields */}
      <div className="space-y-3">
        {metadataSchema.fields.map((field) => {
          const fieldError = validationErrors.find(e => e.fieldId === field.id);
          
          return (
            <div key={field.id} className="space-y-1">
              <label className="label py-1">
                <span className="label-text text-sm flex items-center">
                  {field.name}
                  {field.required && <span className="text-error ml-1">*</span>}
                </span>
                {field.description && (
                  <span className="label-text-alt text-xs text-gray-500">
                    {field.description}
                  </span>
                )}
              </label>
              
              {renderFieldEditor(field)}
              
              {fieldError && (
                <div className="text-error text-xs">{fieldError.message}</div>
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

      {/* Show current metadata indicator */}
      <div className="text-xs text-gray-500 border-t pt-2">
        {Object.keys(metadata).length > 0 ? 'Has custom metadata' : 'Using defaults'}
      </div>
    </div>
  );
}