import React, { useState } from 'react';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import { CellType, CellData } from '../../types/game';

interface ZoneEditorProps {
  isOverlay?: boolean;
}

const getCellColor = (type: CellType, deckZoneTypes: any[]): string => {
  const zoneType = deckZoneTypes.find(zt => zt.id === type);
  return zoneType?.color || '#e5e7eb';
};

const getCellLabel = (type: CellType, deckZoneTypes: any[]): string => {
  const zoneType = deckZoneTypes.find(zt => zt.id === type);
  return zoneType?.name || type;
};

export default function ZoneEditor({ isOverlay = false }: ZoneEditorProps) {
  const { editingCard, setEditingCard, pushToUndo, currentDeck } = useDeckEditorStore();
  const [selectedZone, setSelectedZone] = useState<{ row: number; col: number } | null>(null);
  const [customType, setCustomType] = useState('');

  if (!editingCard || !currentDeck) return null;

  const availableZoneTypes = currentDeck.zoneTypes || [];

  const handleZoneClick = (row: number, col: number) => {
    setSelectedZone({ row, col });
    const currentCell = editingCard.cells[row][col];
    const knownZoneIds = availableZoneTypes.map(zt => zt.id);
    if (currentCell.type && !knownZoneIds.includes(currentCell.type)) {
      setCustomType(currentCell.type);
    } else {
      setCustomType('');
    }
  };

  const handleZoneTypeChange = (row: number, col: number, newType: CellType) => {
    pushToUndo(editingCard);
    
    const updatedCells = editingCard.cells.map((cellRow, rowIndex) =>
      cellRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...cell, type: newType };
        }
        return cell;
      })
    );

    setEditingCard({
      ...editingCard,
      cells: updatedCells,
    });
  };

  const handleCustomTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedZone || !customType.trim()) return;

    const { row, col } = selectedZone;
    handleZoneTypeChange(row, col, customType.trim() as CellType);
    setCustomType('');
  };

  // Auto-select top-left zone if none selected
  React.useEffect(() => {
    if (!selectedZone) {
      setSelectedZone({ row: 0, col: 0 });
    }
  }, [selectedZone]);

  if (isOverlay) {
    // Overlay mode for interactive preview
    return (
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        {editingCard.cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="border border-blue-300 cursor-pointer hover:bg-blue-100/30 transition-colors flex items-center justify-center text-xs text-blue-700 font-medium"
              onClick={() => handleZoneClick(rowIndex, colIndex)}
            >
              {selectedZone?.row === rowIndex && selectedZone?.col === colIndex && (
                <div className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs">
                  Selected
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Zone Editor</h4>
      
      {/* Zone Grid */}
      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          Edit each zone in your card (click to select):
        </div>
        <div className="grid grid-cols-2 gap-3">
          {editingCard.cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="space-y-2">
                <div className="text-xs font-medium text-gray-500 text-center">
                  Zone {rowIndex + 1}-{colIndex + 1}
                </div>
                <button
                  className={`
                    w-full aspect-square rounded-lg border-2 p-3 text-sm font-medium transition-all
                    ${selectedZone?.row === rowIndex && selectedZone?.col === colIndex
                      ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                      : 'border-gray-300 hover:border-blue-300'
                    }
                  `}
                  style={{
                    backgroundColor: getCellColor(cell.type, availableZoneTypes),
                    color: ['#6b7280', '#34d399', '#dc2626', '#7c3aed'].includes(getCellColor(cell.type, availableZoneTypes)) ? 'white' : 'black'
                  }}
                  onClick={() => handleZoneClick(rowIndex, colIndex)}
                >
                  {getCellLabel(cell.type, availableZoneTypes)}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Zone Type Selection */}
      {selectedZone && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-blue-900">
              Editing Zone {selectedZone.row + 1}-{selectedZone.col + 1}
            </div>
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: getCellColor(editingCard.cells[selectedZone.row][selectedZone.col].type, availableZoneTypes) }}
            />
          </div>
          
          {/* Preset Types */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-blue-800">Choose Zone Type:</div>
            <div className="grid grid-cols-1 gap-2">
              {availableZoneTypes.map((zoneType) => (
                <button
                  key={zoneType.id}
                  className={`
                    btn btn-sm justify-start gap-3
                    ${editingCard.cells[selectedZone.row][selectedZone.col].type === zoneType.id
                      ? 'btn-primary'
                      : 'btn-outline hover:btn-primary hover:btn-outline-0'
                    }
                  `}
                  onClick={() => handleZoneTypeChange(selectedZone.row, selectedZone.col, zoneType.id as CellType)}
                >
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: zoneType.color }}
                  />
                  {zoneType.name}
                  {zoneType.description && (
                    <span className="text-xs opacity-70">({zoneType.description})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Type Input */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-800">Or Create Custom Type:</div>
            <form onSubmit={handleCustomTypeSubmit} className="flex gap-2">
              <input
                type="text"
                className="input input-bordered input-sm flex-1"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="e.g., office, school, hospital"
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!customType.trim()}
              >
                Apply
              </button>
            </form>
          </div>

          {/* Zone Info */}
          {editingCard.cells[selectedZone.row][selectedZone.col].roads.length > 0 && (
            <div className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-1">
              This zone has {editingCard.cells[selectedZone.row][selectedZone.col].roads.length} road segment{editingCard.cells[selectedZone.row][selectedZone.col].roads.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
        <div className="font-medium mb-1">Tips:</div>
        <ul className="space-y-1">
          <li>• Click any zone to select and edit it</li>
          <li>• Use preset buttons for common zone types</li>
          <li>• Create custom zones with the text input</li>
          <li>• Switch to Road tool to add connections</li>
        </ul>
      </div>
    </div>
  );
}