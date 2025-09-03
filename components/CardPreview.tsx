import React from 'react';
import { Card, CellType, RoadSegment } from '../types/game';
import { CardDefinition, ZoneType } from '../types/deck';
import { rotateCard } from '../utils/gameLogic';

// Union type that works with both Card and CardDefinition
type CardLike = Card | (CardDefinition & { x?: number; y?: number; rotation?: number });

interface CardPreviewProps {
  card: CardLike;
  width: number;
  height: number;
  rotation?: number;
  showBorder?: boolean;
  borderColor?: string;
  className?: string;
  zoneTypes?: ZoneType[];
  showLabels?: boolean;
}

const getCellColor = (type: CellType, zoneTypes?: ZoneType[]): string => {
  if (zoneTypes) {
    const zoneType = zoneTypes.find(zt => zt.id === type);
    if (zoneType) return zoneType.color;
  }
  
  // Fallback to hardcoded colors for backwards compatibility
  switch (type) {
    case 'residential': return '#60a5fa';
    case 'commercial': return '#f59e0b';
    case 'industrial': return '#6b7280';
    case 'park': return '#34d399';
    default: return '#e5e7eb';
  }
};

// Mini road component for card previews
const MiniRoadSegment = ({ 
  segment, 
  cellWidth, 
  cellHeight 
}: { 
  segment: RoadSegment;
  cellWidth: number;
  cellHeight: number;
}) => {
  const [from, to] = segment;
  
  // Define positions as percentages for scalability
  const positions = {
    0: { x: 50, y: 0 },    // top
    1: { x: 100, y: 50 },  // right
    2: { x: 50, y: 100 },  // bottom
    3: { x: 0, y: 50 }     // left
  };
  
  const fromPos = positions[from as keyof typeof positions];
  const toPos = positions[to as keyof typeof positions];
  const centerPos = { x: 50, y: 50 };
  
  // Create SVG path for the road
  const isStraight = (from + to) % 2 === 0; // opposite edges
  const roadWidth = Math.max(2, Math.min(cellWidth, cellHeight) * 0.2);
  const centerLineWidth = Math.max(1, roadWidth * 0.15);
  
  if (isStraight) {
    // Straight road
    return (
      <svg 
        className="absolute inset-0 pointer-events-none" 
        style={{ zIndex: 1 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1={fromPos.x}
          y1={fromPos.y}
          x2={toPos.x}
          y2={toPos.y}
          stroke="#374151"
          strokeWidth={roadWidth}
          strokeLinecap="round"
        />
        <line
          x1={fromPos.x}
          y1={fromPos.y}
          x2={toPos.x}
          y2={toPos.y}
          stroke="#fbbf24"
          strokeWidth={centerLineWidth}
          strokeLinecap="round"
        />
      </svg>
    );
  } else {
    // L-shaped road through center
    return (
      <svg 
        className="absolute inset-0 pointer-events-none" 
        style={{ zIndex: 1 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          points={`${fromPos.x},${fromPos.y} ${centerPos.x},${centerPos.y} ${toPos.x},${toPos.y}`}
          fill="none"
          stroke="#374151"
          strokeWidth={roadWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={`${fromPos.x},${fromPos.y} ${centerPos.x},${centerPos.y} ${toPos.x},${toPos.y}`}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={centerLineWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
};

export default function CardPreview({
  card,
  width,
  height,
  rotation = 0,
  showBorder = true,
  borderColor = 'border-gray-400',
  className = '',
  zoneTypes,
  showLabels = true
}: CardPreviewProps) {
  // Only rotate if we have a full Card object with x,y,rotation properties
  const displayCard = rotation !== 0 && 'x' in card && 'y' in card && 'rotation' in card 
    ? rotateCard(card as Card, rotation) 
    : card;
  const cellWidth = width / 2;
  const cellHeight = height / 2;

  return (
    <div
      className={`${showBorder ? `border-2 ${borderColor}` : ''} rounded overflow-hidden ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
        {displayCard.cells.map((row, rowIndex) =>
          row.map((cellData, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="relative"
              style={{
                backgroundColor: getCellColor(cellData.type, zoneTypes),
              }}
            >
              {cellData.roads.map((roadSegment, roadIndex) => (
                <MiniRoadSegment
                  key={roadIndex}
                  segment={roadSegment}
                  cellWidth={cellWidth}
                  cellHeight={cellHeight}
                />
              ))}
            </div>
          ))
        ).flat()}
      </div>
    </div>
  );
}