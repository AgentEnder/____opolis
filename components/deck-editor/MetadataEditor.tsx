import { useState } from 'react';
import { useMetadataStore } from '../../stores/metadataStore';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import { CustomMetadataField } from '../../types/metadataSystem';
import { CardMetadataForm } from './CardMetadataForm';

export function MetadataEditor() {
  const { currentDeck, updateMetadataSchema } = useDeckEditorStore();
  const {
    currentSchema,
    validationErrors,
    isEditingSchema,
    setSchema,
    addField,
    updateField,
    removeField,
    setEditingSchema,
    generateFieldId,
  } = useMetadataStore();

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [newFieldData, setNewFieldData] = useState<Partial<CustomMetadataField>>({
    name: '',
    type: 'text',
    description: '',
    required: false,
  });

  // Initialize schema from deck when component mounts
  useState(() => {
    if (currentDeck?.metadataSchema && !currentSchema) {
      setSchema(currentDeck.metadataSchema);
    }
  });

  if (!currentDeck) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🏷️</div>
          <h3 className="text-lg font-medium mb-2">No deck selected</h3>
          <p>Select or create a deck to manage metadata</p>
        </div>
      </div>
    );
  }

  const handleSaveSchema = () => {
    if (currentSchema && validationErrors.length === 0) {
      updateMetadataSchema(currentSchema);
      setEditingSchema(false);
    }
  };

  const handleAddField = () => {
    if (!newFieldData.name) return;

    const fieldId = generateFieldId(newFieldData.name);
    const field: CustomMetadataField = {
      id: fieldId,
      name: newFieldData.name,
      type: newFieldData.type || 'text',
      description: newFieldData.description,
      required: newFieldData.required || false,
      ...(newFieldData.type === 'select' && { options: ['Option 1', 'Option 2'] }),
      ...(newFieldData.type === 'number' && { min: 0, max: 100 }),
    };

    addField(field);
    
    // Reset form
    setNewFieldData({
      name: '',
      type: 'text',
      description: '',
      required: false,
    });
  };

  const metadataFields = currentSchema?.fields || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Metadata</h2>
          <p className="text-gray-600">Define custom properties for cards in {currentDeck.name}</p>
        </div>
        <div className="flex space-x-2">
          {isEditingSchema && (
            <>
              <button
                className="btn btn-ghost"
                onClick={() => setEditingSchema(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveSchema}
                disabled={validationErrors.length > 0}
              >
                Save Schema
              </button>
            </>
          )}
          {!isEditingSchema && (
            <button
              className="btn btn-outline"
              onClick={() => setEditingSchema(true)}
            >
              ✏️ Edit Schema
            </button>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="alert alert-error">
          <div>
            <h4 className="font-medium">Schema validation errors:</h4>
            <ul className="list-disc list-inside text-sm">
              {validationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schema Definition */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Metadata Schema</h3>
              
              {metadataFields.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-gray-500 mb-2">No custom fields defined</div>
                  <p className="text-sm text-gray-400">Add custom fields to enable card-specific metadata</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {metadataFields.map((field) => (
                    <div key={field.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{field.name}</h4>
                            <span className="badge badge-sm">{field.type}</span>
                            {field.required && <span className="badge badge-error badge-xs">Required</span>}
                          </div>
                          {field.description && (
                            <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                          )}
                          <div className="text-xs text-gray-400 mt-1">ID: {field.id}</div>
                        </div>
                        {isEditingSchema && (
                          <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => removeField(field.id)}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Field Form */}
              {isEditingSchema && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="font-medium mb-3">Add New Field</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="label">
                        <span className="label-text">Field Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={newFieldData.name || ''}
                        onChange={(e) => setNewFieldData({ ...newFieldData, name: e.target.value })}
                        placeholder="e.g., Livestock Count"
                      />
                    </div>
                    
                    <div>
                      <label className="label">
                        <span className="label-text">Field Type</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={newFieldData.type || 'text'}
                        onChange={(e) => setNewFieldData({ ...newFieldData, type: e.target.value as any })}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean (True/False)</option>
                        <option value="select">Select (Options)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="label">
                        <span className="label-text">Description (Optional)</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        value={newFieldData.description || ''}
                        onChange={(e) => setNewFieldData({ ...newFieldData, description: e.target.value })}
                        placeholder="Describe what this field represents"
                        rows={2}
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Required field</span>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={newFieldData.required || false}
                          onChange={(e) => setNewFieldData({ ...newFieldData, required: e.target.checked })}
                        />
                      </label>
                    </div>
                    
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleAddField}
                      disabled={!newFieldData.name}
                    >
                      Add Field
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Metadata Editor */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Card Metadata</h3>
              
              {metadataFields.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-gray-500 mb-2">No metadata schema defined</div>
                  <p className="text-sm text-gray-400">Define metadata fields first to edit card properties</p>
                </div>
              ) : currentDeck.baseCards.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-gray-500 mb-2">No cards in deck</div>
                  <p className="text-sm text-gray-400">Create cards to add custom metadata</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="label">
                      <span className="label-text">Select Card to Edit</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={selectedCardIndex ?? ''}
                      onChange={(e) => setSelectedCardIndex(e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option value="">Choose a card...</option>
                      {currentDeck.baseCards.map((card, index) => (
                        <option key={card.id} value={index}>
                          {card.name || `Card ${card.id.slice(-4)}`} (x{card.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCardIndex !== null && (
                    <CardMetadataForm
                      card={currentDeck.baseCards[selectedCardIndex]}
                      cardIndex={selectedCardIndex}
                      metadataSchema={currentSchema}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}