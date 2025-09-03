import React, { useState } from 'react';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import { RoadSegment } from '../../types/game';

interface RoadEditorProps {
  isOverlay?: boolean;
}

interface EdgePosition {
  zone: { row: number; col: number };
  edge: number; // 0=top, 1=right, 2=bottom, 3=left
  x: number;
  y: number;
}

export default function RoadEditor({ isOverlay = false }: RoadEditorProps) {
  const { editingCard, setEditingCard, pushToUndo } = useDeckEditorStore();
  const [selectedZone, setSelectedZone] = useState<{ row: number; col: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startEdge, setStartEdge] = useState<EdgePosition | null>(null);

  if (!editingCard) return null;

  const getEdgePosition = (row: number, col: number, edge: number): { x: number; y: number } => {
    const baseX = col * 100 + 50; // Center of zone
    const baseY = row * 100 + 50;
    
    switch (edge) {
      case 0: return { x: baseX, y: baseY - 50 }; // top
      case 1: return { x: baseX + 50, y: baseY }; // right
      case 2: return { x: baseX, y: baseY + 50 }; // bottom
      case 3: return { x: baseX - 50, y: baseY }; // left
      default: return { x: baseX, y: baseY };
    }
  };

  const handleEdgeClick = (row: number, col: number, edge: number) => {
    const edgePos: EdgePosition = {
      zone: { row, col },
      edge,
      ...getEdgePosition(row, col, edge),
    };

    if (!isDrawing) {
      // Start drawing
      setStartEdge(edgePos);
      setIsDrawing(true);
    } else if (startEdge) {
      // Complete drawing
      if (startEdge.zone.row === row && startEdge.zone.col === col && startEdge.edge === edge) {
        // Clicked same edge, cancel
        setIsDrawing(false);
        setStartEdge(null);
        return;
      }

      // Create road segment
      const roadSegment: RoadSegment = [startEdge.edge, edge];
      
      pushToUndo(editingCard);

      // Add road to the starting zone
      const updatedCells = editingCard.cells.map((cellRow, rowIndex) =>
        cellRow.map((cell, colIndex) => {
          if (rowIndex === startEdge.zone.row && colIndex === startEdge.zone.col) {
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

      setIsDrawing(false);
      setStartEdge(null);
    }
  };

  const handleZoneClick = (row: number, col: number) => {
    setSelectedZone({ row, col });
    // Cancel any active drawing
    setIsDrawing(false);
    setStartEdge(null);
  };

  const removeRoadFromZone = (zoneRow: number, zoneCol: number, roadIndex: number) => {
    pushToUndo(editingCard);

    const updatedCells = editingCard.cells.map((cellRow, rowIndex) =>
      cellRow.map((cell, colIndex) => {
        if (rowIndex === zoneRow && colIndex === zoneCol) {
          const roads = cell.roads || [];
          return {
            ...cell,
            roads: roads.filter((_, index) => index !== roadIndex),
          };
        }
        return cell;
      })
    );

    setEditingCard({
      ...editingCard,
      cells: updatedCells,
    });
  };

  const clearAllRoadsFromZone = (zoneRow: number, zoneCol: number) => {
    pushToUndo(editingCard);

    const updatedCells = editingCard.cells.map((cellRow, rowIndex) =>
      cellRow.map((cell, colIndex) => {
        if (rowIndex === zoneRow && colIndex === zoneCol) {
          return { ...cell, roads: [] };
        }
        return cell;
      })
    );

    setEditingCard({
      ...editingCard,
      cells: updatedCells,
    });
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

  if (isOverlay) {
    // Overlay mode for interactive preview
    return (
      <div className="absolute inset-0">
        {/* Zone click areas */}
        <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
          {editingCard.cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`zone-${rowIndex}-${colIndex}`}
                className="relative border border-green-300 cursor-pointer hover:bg-green-100/30 transition-colors"
                onClick={() => handleZoneClick(rowIndex, colIndex)}
              >
                {/* Circular edge handles */}
                {[0, 1, 2, 3].map((edge) => {
                  const handlePositions = [
                    { top: '-6px', left: '50%', transform: 'translateX(-50%)' }, // top
                    { top: '50%', right: '-6px', transform: 'translateY(-50%)' }, // right
                    { bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }, // bottom
                    { top: '50%', left: '-6px', transform: 'translateY(-50%)' }, // left
                  ];

                  const isSelected = startEdge?.zone.row === rowIndex && 
                                   startEdge?.zone.col === colIndex && 
                                   startEdge?.edge === edge;

                  return (
                    <div
                      key={edge}
                      className={`absolute w-3 h-3 rounded-full border-2 cursor-crosshair transition-all z-10 ${
                        isSelected
                          ? 'bg-green-500 border-white shadow-lg scale-125' 
                          : 'bg-white border-green-500 hover:bg-green-100 hover:scale-110'
                      }`}
                      style={handlePositions[edge]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdgeClick(rowIndex, colIndex, edge);
                      }}
                      title={`${getEdgeName(edge)} edge`}
                    />
                  );
                })}

                {/* Selection indicator */}
                {selectedZone?.row === rowIndex && selectedZone?.col === colIndex && (
                  <div className="absolute inset-0 border-2 border-green-500 bg-green-100/20 flex items-center justify-center">
                    <div className="bg-green-500 text-white px-1 py-0.5 rounded text-xs">
                      Selected
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Drawing indicator */}
        {isDrawing && startEdge && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none">
            Drawing from {getEdgeName(startEdge.edge)} edge...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Road Editor</h4>

      {/* Drawing Status */}
      {isDrawing && startEdge ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-sm text-green-800">
            <strong>Drawing road from:</strong> Zone ({startEdge.zone.row + 1}, {startEdge.zone.col + 1}) - {getEdgeName(startEdge.edge)} edge
          </div>
          <div className="text-xs text-green-600 mt-1">
            Click another edge to complete the road, or click the same edge to cancel.
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          Click on zone edges in the preview to draw roads.
        </div>
      )}

      {/* Zone Selection */}
      <div className="space-y-3">
        <div className="text-sm text-gray-600">Click on a zone to manage its roads:</div>
        <div className="grid grid-cols-2 gap-2">
          {editingCard.cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const roadCount = cell.roads?.length || 0;
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    aspect-square rounded border-2 p-2 text-xs font-medium transition-all
                    ${selectedZone?.row === rowIndex && selectedZone?.col === colIndex
                      ? 'border-green-500 ring-2 ring-green-200 bg-green-50'
                      : 'border-gray-300 hover:border-green-300'
                    }
                  `}
                  onClick={() => handleZoneClick(rowIndex, colIndex)}
                >
                  <div>Zone ({rowIndex + 1}, {colIndex + 1})</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {roadCount} road{roadCount !== 1 ? 's' : ''}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Selected Zone Roads Management */}
      {selectedZone && (
        <div className="bg-green-50 rounded-lg p-4 space-y-3">
          <div className="text-sm font-medium text-green-900">
            Roads in Zone ({selectedZone.row + 1}, {selectedZone.col + 1})
          </div>

          {(() => {
            const zone = editingCard.cells[selectedZone.row][selectedZone.col];
            const roads = zone.roads || [];

            if (roads.length === 0) {
              return (
                <div className="text-xs text-green-600">
                  No roads in this zone. Click on edges in the preview to add roads.
                </div>
              );
            }

            return (
              <div className="space-y-2">
                {roads.map((road, roadIndex) => (
                  <div
                    key={roadIndex}
                    className="flex items-center justify-between bg-white rounded p-2 text-xs"
                  >
                    <span>
                      {getEdgeName(road[0])} → {getEdgeName(road[1])}
                    </span>
                    <button
                      onClick={() => removeRoadFromZone(selectedZone.row, selectedZone.col, roadIndex)}
                      className="btn btn-xs btn-error"
                      title="Remove road"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {roads.length > 1 && (
                  <button
                    onClick={() => clearAllRoadsFromZone(selectedZone.row, selectedZone.col)}
                    className="btn btn-xs btn-error btn-outline w-full"
                  >
                    Clear All Roads
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
        <div className="font-medium mb-1">Tips:</div>
        <ul className="space-y-1">
          <li>• Click zone edges in the preview to draw roads</li>
          <li>• Roads connect from one edge to another within the same zone</li>
          <li>• Click a zone below to manage its existing roads</li>
          <li>• Use the zone view to remove individual roads</li>
        </ul>
      </div>
    </div>
  );
}