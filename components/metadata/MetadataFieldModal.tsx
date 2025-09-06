import { useState, useEffect } from 'react';
import { CustomMetadataField } from '../../types/metadataSystem';
import { MetadataRendererEditor } from './MetadataRendererEditor';

interface MetadataFieldModalProps {
  isOpen: boolean;
  field?: CustomMetadataField | null; // null for creating new field
  onSave: (field: CustomMetadataField) => void;
  onClose: () => void;
  generateFieldId: (baseName: string) => string;
}

export function MetadataFieldModal({
  isOpen,
  field,
  onSave,
  onClose,
  generateFieldId,
}: MetadataFieldModalProps) {
  const [formData, setFormData] = useState<Partial<CustomMetadataField>>({
    name: '',
    type: 'text',
    description: '',
    required: false,
    renderOnCard: false,
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'rendering'>('basic');
  const [errors, setErrors] = useState<string[]>([]);

  // Initialize form data when modal opens or field changes
  useEffect(() => {
    if (isOpen) {
      if (field) {
        // Editing existing field
        setFormData({ ...field });
        // Auto-switch to rendering tab if field has render formula
        if (field.renderFormula) {
          setActiveTab('rendering');
        }
      } else {
        // Creating new field
        setFormData({
          name: '',
          type: 'text',
          description: '',
          required: false,
          renderOnCard: false,
        });
        setActiveTab('basic');
      }
      setErrors([]);
    }
  }, [isOpen, field]);

  if (!isOpen) return null;

  const isEditing = !!field;

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.name?.trim()) {
      newErrors.push('Field name is required');
    }
    
    if (!formData.type) {
      newErrors.push('Field type is required');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const finalField: CustomMetadataField = {
      id: field?.id || generateFieldId(formData.name!),
      name: formData.name!,
      type: formData.type || 'text',
      description: formData.description,
      required: formData.required || false,
      renderOnCard: formData.renderOnCard || false,
      renderFormula: formData.renderFormula,
      compiledRenderFormula: formData.compiledRenderFormula,
      ...(formData.type === 'select' && {
        options: formData.options || ['Option 1', 'Option 2'],
      }),
      ...(formData.type === 'number' && {
        min: formData.min ?? 0,
        max: formData.max ?? 100,
      }),
    };

    onSave(finalField);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const updateFormData = (updates: Partial<CustomMetadataField>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold">
              {isEditing ? 'Edit Metadata Field' : 'Create Metadata Field'}
            </h2>
            <p className="text-gray-600">
              {isEditing ? `Editing "${field?.name}"` : 'Define a new custom metadata field with rendering options'}
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
              onClick={handleSave}
              disabled={errors.length > 0}
            >
              {isEditing ? 'Save Changes' : 'Create Field'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="tabs tabs-boxed bg-gray-100">
            <button
              className={`tab ${activeTab === 'basic' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              📝 Basic Settings
            </button>
            <button
              className={`tab ${activeTab === 'rendering' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('rendering')}
            >
              🎨 Card Rendering
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="alert alert-error mb-6">
              <div>
                <h4 className="font-medium">Please fix the following errors:</h4>
                <ul className="list-disc list-inside text-sm">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Basic Settings Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field Name */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Field Name *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.name || ''}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    placeholder="e.g., Livestock Count"
                  />
                  <div className="label">
                    <span className="label-text-alt text-gray-500">
                      This will be displayed in the UI
                    </span>
                  </div>
                </div>

                {/* Field Type */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Field Type *</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.type || 'text'}
                    onChange={(e) => updateFormData({ type: e.target.value as any })}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean (True/False)</option>
                    <option value="select">Select (Options)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={formData.description || ''}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Describe what this field represents..."
                  rows={3}
                />
              </div>

              {/* Type-specific Settings */}
              {formData.type === 'select' && (
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Options</span>
                  </label>
                  <div className="space-y-2">
                    {(formData.options || ['Option 1', 'Option 2']).map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(formData.options || [])];
                            newOptions[index] = e.target.value;
                            updateFormData({ options: newOptions });
                          }}
                        />
                        <button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => {
                            const newOptions = (formData.options || []).filter((_, i) => i !== index);
                            updateFormData({ options: newOptions });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const newOptions = [...(formData.options || []), 'New Option'];
                        updateFormData({ options: newOptions });
                      }}
                    >
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              {formData.type === 'number' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Minimum Value</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={formData.min ?? 0}
                      onChange={(e) => updateFormData({ min: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Maximum Value</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={formData.max ?? 100}
                      onChange={(e) => updateFormData({ max: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start">
                    <input
                      type="checkbox"
                      className="checkbox mr-3"
                      checked={formData.required || false}
                      onChange={(e) => updateFormData({ required: e.target.checked })}
                    />
                    <div>
                      <span className="label-text font-medium">Required field</span>
                      <div className="text-xs text-gray-500">Users must provide a value for this field</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Rendering Tab */}
          {activeTab === 'rendering' && (
            <div className="space-y-6">
              {formData as CustomMetadataField && (
                <MetadataRendererEditor
                  field={formData as CustomMetadataField}
                  onChange={updateFormData}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}