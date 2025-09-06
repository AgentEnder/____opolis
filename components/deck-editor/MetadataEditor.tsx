import { useEffect, useState } from "react";
import { useMetadataStore } from "../../stores/metadataStore";
import { useDeckEditorStore } from "../../stores/deckEditorStore";
import { CustomMetadataField } from "../../types/metadataSystem";
import { MetadataFieldModal } from "../metadata/MetadataFieldModal";

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

  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomMetadataField | null>(null);

  // Initialize schema from deck when component mounts
  useEffect(() => {
    console.log("MetadataEditor: Checking if we need to initialize schema", {
      hasCurrentDeckSchema: !!currentDeck?.metadataSchema,
      hasCurrentSchema: !!currentSchema,
      currentDeckName: currentDeck?.name,
    });
    if (currentDeck?.metadataSchema && !currentSchema) {
      console.log(
        "MetadataEditor: Initializing schema from deck",
        currentDeck.metadataSchema
      );
      setSchema(currentDeck.metadataSchema);
    }
  }, [currentDeck?.metadataSchema, currentSchema, setSchema]);

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
    console.log("MetadataEditor: handleSaveSchema called", {
      hasCurrentSchema: !!currentSchema,
      validationErrorsCount: validationErrors.length,
      currentSchema,
    });
    if (currentSchema && validationErrors.length === 0) {
      console.log("MetadataEditor: Saving schema to deck", currentSchema);
      updateMetadataSchema(currentSchema);
      setEditingSchema(false);
      console.log("MetadataEditor: Schema saved successfully");
    } else {
      console.log(
        "MetadataEditor: Cannot save - validation errors or no schema"
      );
    }
  };

  const handleOpenNewFieldModal = () => {
    setEditingField(null);
    setFieldModalOpen(true);
  };

  const handleOpenEditFieldModal = (field: CustomMetadataField) => {
    setEditingField(field);
    setFieldModalOpen(true);
  };

  const handleSaveField = (field: CustomMetadataField) => {
    if (editingField) {
      // Editing existing field
      updateField(field.id, field);
    } else {
      // Creating new field
      addField(field);
    }
    setFieldModalOpen(false);
    setEditingField(null);
  };

  const handleCloseFieldModal = () => {
    setFieldModalOpen(false);
    setEditingField(null);
  };

  const metadataFields = currentSchema?.fields || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Metadata</h2>
          <p className="text-gray-600">
            Define custom metadata schema for {currentDeck.name}. Metadata will
            be applied at the zone level.
          </p>
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

      {/* Schema Definition */}
      <div className="space-y-6">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Metadata Schema</h3>

            {metadataFields.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-gray-500 mb-2">
                  No custom fields defined
                </div>
                <p className="text-sm text-gray-400">
                  Add custom fields to enable card-specific metadata
                </p>
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
                      {isEditingSchema && (
                        <div className="flex space-x-1">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleOpenEditFieldModal(field)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-sm text-error"
                            onClick={() => removeField(field.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Field Button */}
            {isEditingSchema && (
              <div className="mt-6 border-t pt-6">
                <button
                  className="btn btn-primary w-full"
                  onClick={handleOpenNewFieldModal}
                >
                  + Add New Field
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zone Type Defaults Section */}
      <div className="mt-8">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Zone Type Defaults</h3>

            {metadataFields.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-gray-500 mb-2">
                  No metadata schema defined
                </div>
                <p className="text-sm text-gray-400">
                  Define metadata fields first to set zone type defaults
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Set default metadata values for each zone type. These will be
                  applied when creating new zones.
                </div>
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
            )}
          </div>
        </div>
      </div>

      {/* Field Editor Modal */}
      <MetadataFieldModal
        isOpen={fieldModalOpen}
        field={editingField}
        onSave={handleSaveField}
        onClose={handleCloseFieldModal}
        generateFieldId={generateFieldId}
      />
    </div>
  );
}
