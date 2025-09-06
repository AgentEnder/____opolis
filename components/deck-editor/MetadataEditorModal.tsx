import { useEffect, useState } from "react";
import { useMetadataStore } from "../../stores/metadataStore";
import { useDeckEditorStore } from "../../stores/deckEditorStore";
import { CustomMetadataField } from "../../types/metadataSystem";
import { MetadataRendererEditor } from "../metadata/MetadataRendererEditor";

interface MetadataEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MetadataEditorModal({ isOpen, onClose }: MetadataEditorModalProps) {
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

  const [newFieldData, setNewFieldData] = useState<
    Partial<CustomMetadataField>
  >({
    name: "",
    type: "text",
    description: "",
    required: false,
  });

  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);

  // Initialize schema from deck when modal opens
  useEffect(() => {
    if (isOpen && currentDeck?.metadataSchema && !currentSchema) {
      setSchema(currentDeck.metadataSchema);
    }
  }, [isOpen, currentDeck?.metadataSchema, currentSchema, setSchema]);

  // Auto-enter editing mode when modal opens
  useEffect(() => {
    if (isOpen && !isEditingSchema) {
      setEditingSchema(true);
    }
  }, [isOpen, isEditingSchema, setEditingSchema]);

  if (!isOpen || !currentDeck) return null;

  const handleSaveSchema = () => {
    if (currentSchema && validationErrors.length === 0) {
      updateMetadataSchema(currentSchema);
      setEditingSchema(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setEditingSchema(false);
    onClose();
  };

  const handleAddField = () => {
    if (!newFieldData.name) return;

    const fieldId = generateFieldId(newFieldData.name);
    const field: CustomMetadataField = {
      id: fieldId,
      name: newFieldData.name,
      type: newFieldData.type || "text",
      description: newFieldData.description,
      required: newFieldData.required || false,
      ...(newFieldData.type === "select" && {
        options: ["Option 1", "Option 2"],
      }),
      ...(newFieldData.type === "number" && { min: 0, max: 100 }),
    };

    addField(field);

    // Auto-expand the new field to show renderer editor
    setExpandedFieldId(field.id);

    // Reset form
    setNewFieldData({
      name: "",
      type: "text",
      description: "",
      required: false,
    });
  };

  const metadataFields = currentSchema?.fields || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold">Custom Metadata Schema</h2>
            <p className="text-gray-600">
              Define custom metadata fields for {currentDeck.name}. Configure rendering to display on cards.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              className="btn btn-ghost"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSaveSchema}
              disabled={validationErrors.length > 0}
            >
              Save & Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="alert alert-error mb-6">
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

          {/* Add New Field Form */}
          <div className="card bg-base-100 shadow-sm mb-6">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Add New Metadata Field</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Field Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={newFieldData.name || ""}
                    onChange={(e) =>
                      setNewFieldData({
                        ...newFieldData,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., Livestock Count"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Field Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={newFieldData.type || "text"}
                    onChange={(e) =>
                      setNewFieldData({
                        ...newFieldData,
                        type: e.target.value as any,
                      })
                    }
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean (True/False)</option>
                    <option value="select">Select (Options)</option>
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={newFieldData.description || ""}
                    onChange={(e) =>
                      setNewFieldData({
                        ...newFieldData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Optional description"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    className="btn btn-primary w-full"
                    onClick={handleAddField}
                    disabled={!newFieldData.name}
                  >
                    Add Field
                  </button>
                </div>
              </div>
              
              <div className="form-control mt-2">
                <label className="label cursor-pointer justify-start">
                  <input
                    type="checkbox"
                    className="checkbox mr-2"
                    checked={newFieldData.required || false}
                    onChange={(e) =>
                      setNewFieldData({
                        ...newFieldData,
                        required: e.target.checked,
                      })
                    }
                  />
                  <span className="label-text">Required field</span>
                </label>
              </div>
            </div>
          </div>

          {/* Existing Fields */}
          <div className="space-y-4">
            {metadataFields.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">
                  No custom fields defined
                </div>
                <p className="text-sm text-gray-400">
                  Add custom fields above to enable zone-specific metadata and rendering
                </p>
              </div>
            ) : (
              metadataFields.map((field) => (
                <div key={field.id} className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-lg">{field.name}</h4>
                          <span className="badge badge-sm">{field.type}</span>
                          {field.required && (
                            <span className="badge badge-error badge-xs">
                              Required
                            </span>
                          )}
                          {field.renderOnCard && (
                            <span className="badge badge-success badge-xs">
                              Renders on Card
                            </span>
                          )}
                        </div>
                        {field.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {field.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          ID: {field.id}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            const newExpandedField = expandedFieldId === field.id ? null : field.id;
                            setExpandedFieldId(newExpandedField);
                          }}
                        >
                          {expandedFieldId === field.id ? 'Hide Config' : 'Configure'}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => removeField(field.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded field configuration - always show renderer editor */}
                    {expandedFieldId === field.id && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <MetadataRendererEditor
                          field={field}
                          onChange={(updates) => updateField(field.id, updates)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Zone Type Defaults Section */}
          {metadataFields.length > 0 && (
            <div className="mt-8">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="text-lg font-semibold mb-4">Zone Type Defaults</h3>
                  <div className="text-sm text-gray-600 mb-4">
                    Set default metadata values for each zone type. These will be
                    applied when creating new zones.
                  </div>
                  <div className="space-y-4">
                    {currentDeck.zoneTypes.map((zoneType) => (
                      <div key={zoneType.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div
                            className="w-6 h-6 rounded-full border-2"
                            style={{ backgroundColor: zoneType.color }}
                          />
                          <div>
                            <h4 className="font-medium">{zoneType.name}</h4>
                            <p className="text-sm text-gray-500">
                              {zoneType.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Zone type metadata defaults would be configured here in
                          individual zone components.
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}