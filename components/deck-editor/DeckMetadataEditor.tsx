import React from 'react';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import ZoneTypeEditor from './ZoneTypeEditor';

export default function DeckMetadataEditor() {
  const { currentDeck, updateDeckMetadata } = useDeckEditorStore();

  if (!currentDeck) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateDeckMetadata({ name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateDeckMetadata({ description: e.target.value });
  };

  const handleThemeColorChange = (colorType: 'primaryColor' | 'secondaryColor', color: string) => {
    updateDeckMetadata({
      theme: {
        ...currentDeck.theme,
        [colorType]: color,
      },
    });
  };

  const presetColors = [
    { name: 'Purple', primary: '#8b5cf6', secondary: '#7c3aed' },
    { name: 'Blue', primary: '#3b82f6', secondary: '#1e40af' },
    { name: 'Green', primary: '#22c55e', secondary: '#15803d' },
    { name: 'Orange', primary: '#f59e0b', secondary: '#d97706' },
    { name: 'Red', primary: '#ef4444', secondary: '#dc2626' },
    { name: 'Teal', primary: '#14b8a6', secondary: '#0d9488' },
  ];

  return (
    <div className="space-y-4">
      {/* Deck Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Deck Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={currentDeck.name}
          onChange={handleNameChange}
          placeholder="Enter deck name"
        />
      </div>

      {/* Deck Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Description</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-20 resize-none"
          value={currentDeck.description}
          onChange={handleDescriptionChange}
          placeholder="Describe your deck..."
        />
      </div>

      {/* Theme Colors */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Theme Colors</span>
        </label>
        
        {/* Color Presets */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {presetColors.map((preset) => (
            <button
              key={preset.name}
              className={`btn btn-sm justify-start ${
                currentDeck.theme.primaryColor === preset.primary 
                  ? 'btn-primary' 
                  : 'btn-outline'
              }`}
              onClick={() => handleThemeColorChange('primaryColor', preset.primary)}
              onDoubleClick={() => {
                handleThemeColorChange('primaryColor', preset.primary);
                handleThemeColorChange('secondaryColor', preset.secondary);
              }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded border border-gray-300"
                  style={{ backgroundColor: preset.primary }}
                />
                {preset.name}
              </div>
            </button>
          ))}
        </div>

        {/* Custom Color Inputs */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-16">Primary:</label>
            <input
              type="color"
              className="input input-bordered input-sm w-16 h-8 p-1"
              value={currentDeck.theme.primaryColor}
              onChange={(e) => handleThemeColorChange('primaryColor', e.target.value)}
            />
            <input
              type="text"
              className="input input-bordered input-sm flex-1"
              value={currentDeck.theme.primaryColor}
              onChange={(e) => handleThemeColorChange('primaryColor', e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-16">Secondary:</label>
            <input
              type="color"
              className="input input-bordered input-sm w-16 h-8 p-1"
              value={currentDeck.theme.secondaryColor}
              onChange={(e) => handleThemeColorChange('secondaryColor', e.target.value)}
            />
            <input
              type="text"
              className="input input-bordered input-sm flex-1"
              value={currentDeck.theme.secondaryColor}
              onChange={(e) => handleThemeColorChange('secondaryColor', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Zone Types */}
      <div className="form-control">
        <ZoneTypeEditor />
      </div>

      {/* Metadata Display */}
      <div className="text-sm text-gray-500 space-y-1 pt-4 border-t">
        <p><strong>Author:</strong> {currentDeck.metadata.author}</p>
        <p><strong>Version:</strong> {currentDeck.metadata.version}</p>
        <p><strong>Created:</strong> {new Date(currentDeck.metadata.created).toLocaleDateString()}</p>
        <p><strong>Modified:</strong> {new Date(currentDeck.metadata.modified).toLocaleDateString()}</p>
      </div>
    </div>
  );
}