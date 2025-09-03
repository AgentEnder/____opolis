import React, { useState } from 'react';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import { CardDefinition, ZoneType } from '../../types/deck';
import { CellType, RoadSegment } from '../../types/game';

interface EdgePosition {
  zone: { row: number; col: number };
  edge: number; // 0=top, 1=right, 2=bottom, 3=left
}

export default function CardCanvas() {
  const { editingCard, setEditingCard, pushToUndo, currentDeck } = useDeckEditorStore();
  const [isDrawingRoad, setIsDrawingRoad] = useState(false);
  const [startEdge, setStartEdge] = useState<EdgePosition | null>(null);
  const [selectedZoneType, setSelectedZoneType] = useState<string | null>(null);

  if (!editingCard || !currentDeck) return null;

  const availableZoneTypes = currentDeck.zoneTypes || [];

  const handleZoneClick = (row: number, col: number) => {
    if (isDrawingRoad) return; // Don't change zones while drawing roads
    
    if (selectedZoneType) {
      // Apply selected zone type
      pushToUndo(editingCard);
      
      const updatedCells = editingCard.cells.map((cellRow, rowIndex) =>
        cellRow.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...cell, type: selectedZoneType as CellType };
          }
          return cell;
        })
      );

      setEditingCard({
        ...editingCard,
        cells: updatedCells,
      });
    }
  };

  const handleEdgeClick = (row: number, col: number, edge: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const edgePos: EdgePosition = {
      zone: { row, col },
      edge,
    };

    if (!isDrawingRoad) {
      // Start drawing
      setStartEdge(edgePos);
      setIsDrawingRoad(true);
    } else if (startEdge) {
      // Complete drawing
      if (startEdge.zone.row === row && startEdge.zone.col === col && startEdge.edge === edge) {
        // Clicked same edge, cancel
        setIsDrawingRoad(false);
        setStartEdge(null);
        return;
      }

      // Only allow roads within the same zone for now
      if (startEdge.zone.row !== row || startEdge.zone.col !== col) {
        // Different zone - start new road from this edge
        setStartEdge(edgePos);
        return;
      }

      // Create road segment within the same zone
      const roadSegment: RoadSegment = [startEdge.edge, edge];
      
      pushToUndo(editingCard);

      // Add road to the zone
      const updatedCells = editingCard.cells.map((cellRow, rowIndex) =>
        cellRow.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            const existingRoads = cell.roads || [];
            return {
              ...cell,
              roads: [...existingRoads, roadSegment],
            };
          }
          return cell;
        })
      );

      setEditingCard({
        ...editingCard,
        cells: updatedCells,
      });

      setIsDrawingRoad(false);
      setStartEdge(null);
    }
  };

  const getCellColor = (type: CellType): string => {
    const zoneType = availableZoneTypes.find(zt => zt.id === type);
    return zoneType?.color || '#e5e7eb';
  };

  const getEdgeName = (edge: number): string => {
    switch (edge) {
      case 0: return 'Top';
      case 1: return 'Right';
      case 2: return 'Bottom';
      case 3: return 'Left';
      default: return 'Unknown';
    }
  };

  // Zone type selector
  const ZoneTypeSelector = () => (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Zone Type Brush {selectedZoneType && <span className="text-blue-600">(Active)</span>}
      </h4>
      <div className="flex flex-wrap gap-2">
        {availableZoneTypes.map((zoneType) => (
          <button
            key={zoneType.id}
            className={`flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors ${
              selectedZoneType === zoneType.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => setSelectedZoneType(selectedZoneType === zoneType.id ? null : zoneType.id)}
          >
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: zoneType.color }}
            />
            {zoneType.name}
          </button>
        ))}
        {selectedZoneType && (
          <button
            className="px-3 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
            onClick={() => setSelectedZoneType(null)}
          >
            Clear Brush
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <ZoneTypeSelector />

      {/* Status Display */}
      <div className="text-sm text-gray-600">
        {isDrawingRoad && startEdge ? (
          <div className="bg-green-50 border border-green-200 rounded p-3 text-green-800">
            <strong>Drawing road from:</strong> Zone ({startEdge.zone.row + 1}, {startEdge.zone.col + 1}) - {getEdgeName(startEdge.edge)} edge
            <div className="text-xs text-green-600 mt-1">
              Click another edge in the same zone to complete, or a different edge to start over.
            </div>
          </div>
        ) : selectedZoneType ? (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-800">
            <strong>Zone brush active:</strong> Click zones to paint with {availableZoneTypes.find(zt => zt.id === selectedZoneType)?.name}
          </div>
        ) : (
          <div className="text-gray-500">
            Select a zone type above to paint zones, or click zone edges to draw roads.
          </div>
        )}
      </div>

      {/* Expanded Card Canvas */}
      <div className="mx-auto" style={{ width: '280px', height: '280px' }}>
        <div className="relative w-full h-full bg-gray-100 rounded-lg border-2 border-gray-300 p-4">
          {/* 2x2 grid with gutters */}
          <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full w-full">
            {editingCard.cells.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="relative rounded border-2 border-gray-400 cursor-pointer hover:border-gray-600 transition-colors"
                  style={{ backgroundColor: getCellColor(cell.type) }}
                  onClick={() => handleZoneClick(rowIndex, colIndex)}
                >
                  {/* Zone label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/20 text-white text-xs px-1 py-0.5 rounded font-medium">
                      {availableZoneTypes.find(zt => zt.id === cell.type)?.name || cell.type}
                    </div>
                  </div>

                  {/* Edge handles */}
                  {[0, 1, 2, 3].map((edge) => {
                    const handlePositions = [
                      { top: '-8px', left: '50%', transform: 'translateX(-50%)' }, // top
                      { top: '50%', right: '-8px', transform: 'translateY(-50%)' }, // right
                      { bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }, // bottom
                      { top: '50%', left: '-8px', transform: 'translateY(-50%)' }, // left
                    ];

                    const isSelected = startEdge?.zone.row === rowIndex && 
                                     startEdge?.zone.col === colIndex && 
                                     startEdge?.edge === edge;

                    return (
                      <div
                        key={edge}
                        className={`absolute w-4 h-4 rounded-full border-2 cursor-crosshair transition-all z-10 ${
                          isSelected
                            ? 'bg-green-500 border-white shadow-lg scale-125' 
                            : 'bg-white border-gray-600 hover:bg-gray-100 hover:scale-110'
                        }`}
                        style={handlePositions[edge]}
                        onClick={(e) => handleEdgeClick(rowIndex, colIndex, edge, e)}
                        title={`${getEdgeName(edge)} edge`}
                      />
                    );
                  })}

                  {/* Road visualization */}
                  {cell.roads && cell.roads.length > 0 && (
                    <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {cell.roads.map((road, roadIndex) => {
                        const [from, to] = road;
                        const positions = {
                          0: { x: 50, y: 0 },    // top
                          1: { x: 100, y: 50 },  // right
                          2: { x: 50, y: 100 },  // bottom
                          3: { x: 0, y: 50 }     // left
                        };
                        
                        const fromPos = positions[from as keyof typeof positions];
                        const toPos = positions[to as keyof typeof positions];
                        const centerPos = { x: 50, y: 50 };
                        
                        const isStraight = (from + to) % 2 === 0;
                        
                        return (
                          <g key={roadIndex}>
                            {isStraight ? (
                              <line
                                x1={fromPos.x}
                                y1={fromPos.y}
                                x2={toPos.x}
                                y2={toPos.y}
                                stroke="#374151"
                                strokeWidth="4"
                                strokeLinecap="round"
                              />
                            ) : (
                              <polyline
                                points={`${fromPos.x},${fromPos.y} ${centerPos.x},${centerPos.y} ${toPos.x},${toPos.y}`}
                                fill="none"
                                stroke="#374151"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="font-medium mb-2">How to use:</div>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Change zones:</strong> Select a zone type above, then click zone centers</li>
          <li>• <strong>Draw roads:</strong> Click edge handles (circles) to connect them within a zone</li>
          <li>• <strong>Cancel road:</strong> Click the same edge handle to cancel drawing</li>
          <li>• <strong>Multiple roads:</strong> Each zone can have multiple road segments</li>
        </ul>
      </div>
    </div>
  );
}