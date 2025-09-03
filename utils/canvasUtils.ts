import { Card } from '../types/game';
import { ZoneType } from '../types/deck';

// Grid constants - matching GameBoard.tsx exactly
export const TILE_WIDTH = 60; // 3:2 aspect ratio tile
export const TILE_HEIGHT = 40; // 3:2 aspect ratio tile
export const CARD_WIDTH = 2; // 2 tiles wide
export const CARD_HEIGHT = 2; // 2 tiles tall

/**
 * Get cell color for a zone type
 */
export const getCellColor = (type: string, zoneTypes?: ZoneType[]): string => {
  // Try to find the zone type color from provided zone types
  if (zoneTypes) {
    const zoneType = zoneTypes.find(zt => zt.id === type);
    if (zoneType) {
      return zoneType.color;
    }
  }
  
  // Fallback to hardcoded colors for backwards compatibility
  switch (type) {
    case "residential":
      return "#3b82f6"; // Blue
    case "commercial":
      return "#f97316"; // Orange
    case "industrial":
      return "#6b7280"; // Gray
    case "park":
      return "#22c55e"; // Green
    default:
      return "#e5e7eb"; // Light gray for unknown types
  }
};

/**
 * Draw tile backgrounds for all cards (first pass rendering)
 */
export const drawTileMap = (
  ctx: CanvasRenderingContext2D, 
  cards: Card[], 
  zoneTypes?: ZoneType[],
  scale: number = 1
) => {
  // Build tile map from all cards (later cards override earlier ones)
  const tileMap = new Map<string, { type: string; roads: any[] }>();
  
  cards.forEach((card) => {
    for (let row = 0; row < CARD_HEIGHT; row++) {
      for (let col = 0; col < CARD_WIDTH; col++) {
        if (card.cells && card.cells[row] && card.cells[row][col]) {
          const cell = card.cells[row][col];
          const tileKey = `${card.x + col},${card.y + row}`;
          tileMap.set(tileKey, {
            type: cell.type,
            roads: cell.roads || []
          });
        }
      }
    }
  });
  
  // Draw each unique tile once
  ctx.save();
  
  tileMap.forEach((tile, tileKey) => {
    const [x, y] = tileKey.split(',').map(Number);
    const cellX = x * TILE_WIDTH;
    const cellY = y * TILE_HEIGHT;
    
    // Cell background color based on type
    const cellColor = getCellColor(tile.type, zoneTypes);
    ctx.fillStyle = cellColor;
    ctx.fillRect(cellX, cellY, TILE_WIDTH, TILE_HEIGHT);
    
    // Cell border
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1 / scale;
    ctx.strokeRect(cellX, cellY, TILE_WIDTH, TILE_HEIGHT);
  });
  
  ctx.restore();
};

/**
 * Draw roads for all cards (second pass rendering)
 */
export const drawRoadMap = (
  ctx: CanvasRenderingContext2D, 
  cards: Card[], 
  scale: number = 1
) => {
  // Build tile map from all cards (later cards override earlier ones)
  const tileMap = new Map<string, { type: string; roads: any[] }>();
  
  cards.forEach((card) => {
    for (let row = 0; row < CARD_HEIGHT; row++) {
      for (let col = 0; col < CARD_WIDTH; col++) {
        if (card.cells && card.cells[row] && card.cells[row][col]) {
          const cell = card.cells[row][col];
          const tileKey = `${card.x + col},${card.y + row}`;
          tileMap.set(tileKey, {
            type: cell.type,
            roads: cell.roads || []
          });
        }
      }
    }
  });
  
  // Second pass: draw all roads
  ctx.save();
  
  tileMap.forEach((tile, tileKey) => {
    if (tile.roads && tile.roads.length > 0) {
      const [x, y] = tileKey.split(',').map(Number);
      const cellX = x * TILE_WIDTH;
      const cellY = y * TILE_HEIGHT;
      
      ctx.lineWidth = TILE_WIDTH * 0.125; // 12.5% of tile width
      tile.roads.forEach((road) => {
        drawRoad(ctx, cellX, cellY, TILE_WIDTH, TILE_HEIGHT, road, tileMap);
      });
    }
  });
  
  ctx.restore();
};

/**
 * Draw a single road segment
 */
export const drawRoad = (
  ctx: CanvasRenderingContext2D,
  cellX: number,
  cellY: number,
  tileWidth: number,
  tileHeight: number,
  road: any,
  tileMap?: Map<string, { type: string; roads: any[] }>
) => {
  const centerX = cellX + tileWidth / 2;
  const centerY = cellY + tileHeight / 2;

  // Road segments are [from_edge, to_edge] where edges are: top=0, right=1, bottom=2, left=3
  if (Array.isArray(road) && road.length === 2) {
    const [fromEdge, toEdge] = road;
    const roadWidth = ctx.lineWidth;
    
    // Current tile position
    const currentTileX = Math.round(cellX / tileWidth);
    const currentTileY = Math.round(cellY / tileHeight);
    
    // Check if this edge connects to a road in an adjacent tile
    const hasRoadConnection = (edge: number) => {
      if (!tileMap) return false;
      
      const directions = [
        [0, -1], // top
        [1, 0],  // right
        [0, 1],  // bottom
        [-1, 0]  // left
      ];
      
      const [dx, dy] = directions[edge];
      const adjacentKey = `${currentTileX + dx},${currentTileY + dy}`;
      const adjacentTile = tileMap.get(adjacentKey);
      
      if (!adjacentTile) return false;
      
      // Check if adjacent tile has a road connecting back to this edge
      const oppositeEdge = (edge + 2) % 4; // opposite direction
      return adjacentTile.roads.some((adjacentRoad: any) => {
        if (Array.isArray(adjacentRoad) && adjacentRoad.length === 2) {
          return adjacentRoad.includes(oppositeEdge);
        }
        return false;
      });
    };
    
    // Calculate edge positions with proper terminal insets
    const getEdgePosition = (edge: number, isConnected: boolean) => {
      const inset = isConnected ? 0 : roadWidth * 0.4; // Inset terminal ends
      
      switch (edge) {
        case 0: // top
          return { x: centerX, y: cellY + inset };
        case 1: // right
          return { x: cellX + tileWidth - inset, y: centerY };
        case 2: // bottom
          return { x: centerX, y: cellY + tileHeight - inset };
        case 3: // left
          return { x: cellX + inset, y: centerY };
        default:
          return { x: centerX, y: centerY };
      }
    };

    if (fromEdge >= 0 && fromEdge < 4 && toEdge >= 0 && toEdge < 4) {
      const fromConnected = hasRoadConnection(fromEdge);
      const toConnected = hasRoadConnection(toEdge);
      
      const fromPos = getEdgePosition(fromEdge, fromConnected);
      const toPos = getEdgePosition(toEdge, toConnected);
      
      ctx.save();
      
      // Draw main road segments with smooth corners
      ctx.strokeStyle = '#2d3748'; // Dark gray for asphalt
      ctx.lineWidth = roadWidth;
      ctx.lineJoin = 'round';
      
      const isCornerRoad = fromEdge !== toEdge;
      
      if (isCornerRoad) {
        // For corner roads, draw a smooth curved path
        const cornerRadius = Math.min(roadWidth * 0.8, Math.min(tileWidth, tileHeight) * 0.3);
        
        ctx.lineCap = 'butt'; // Use butt caps for curves to avoid overlap
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        
        // Create smooth curve through center point
        ctx.arcTo(centerX, centerY, toPos.x, toPos.y, cornerRadius);
        ctx.lineTo(toPos.x, toPos.y);
        
        // Apply terminal rounding only to actual ends
        if (!fromConnected) {
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);
          ctx.lineTo(fromPos.x, fromPos.y);
          ctx.stroke();
          ctx.lineCap = 'butt';
        }
        
        if (!toConnected) {
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(toPos.x, toPos.y);
          ctx.lineTo(toPos.x, toPos.y);
          ctx.stroke();
          ctx.lineCap = 'butt';
        }
        
        // Draw the main curved road
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.arcTo(centerX, centerY, toPos.x, toPos.y, cornerRadius);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
        
      } else {
        // For straight roads, draw a simple line
        ctx.lineCap = fromConnected && toConnected ? 'butt' : 'round';
        if (!fromConnected) ctx.lineCap = 'round';
        if (!toConnected) ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
      }
      
      // Draw road markings (center line or edge lines)
      ctx.strokeStyle = '#fbbf24'; // Golden yellow for center lines
      ctx.lineWidth = roadWidth * 0.15; // Thinner marking lines
      ctx.lineCap = 'butt'; // Always square caps for markings
      
      // Different marking patterns based on road type
      if (isCornerRoad) {
        // For corner roads, draw a subtle center guide following the curve
        ctx.setLineDash([roadWidth * 0.3, roadWidth * 0.2]); // Dashed line
        const cornerRadius = Math.min(roadWidth * 0.8, Math.min(tileWidth, tileHeight) * 0.3);
        
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.arcTo(centerX, centerY, toPos.x, toPos.y, cornerRadius);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
      } else {
        // For straight roads, draw solid center line
        ctx.setLineDash([]); // Solid line
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
      }
      
      // Reset line dash
      ctx.setLineDash([]);
      
      ctx.restore();
    }
  }
};

/**
 * Draw a grid background
 */
export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number = 1,
  gridExtent: number = 30
) => {
  ctx.strokeStyle = "#374151";
  ctx.lineWidth = 1 / scale; // Adjust line width for zoom

  const adjustedGridExtent = Math.ceil(gridExtent / scale);

  // Vertical lines (use TILE_WIDTH spacing)
  for (let x = -adjustedGridExtent; x <= adjustedGridExtent; x++) {
    const xPos = x * TILE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(xPos, -adjustedGridExtent * TILE_HEIGHT);
    ctx.lineTo(xPos, adjustedGridExtent * TILE_HEIGHT);
    ctx.stroke();
  }

  // Horizontal lines (use TILE_HEIGHT spacing)
  for (let y = -adjustedGridExtent; y <= adjustedGridExtent; y++) {
    const yPos = y * TILE_HEIGHT;
    ctx.beginPath();
    ctx.moveTo(-adjustedGridExtent * TILE_WIDTH, yPos);
    ctx.lineTo(adjustedGridExtent * TILE_WIDTH, yPos);
    ctx.stroke();
  }

  // Center axis lines (thicker)
  ctx.strokeStyle = "#6b7280";
  ctx.lineWidth = 2 / scale;

  // Center vertical line
  ctx.beginPath();
  ctx.moveTo(0, -adjustedGridExtent * TILE_HEIGHT);
  ctx.lineTo(0, adjustedGridExtent * TILE_HEIGHT);
  ctx.stroke();

  // Center horizontal line
  ctx.beginPath();
  ctx.moveTo(-adjustedGridExtent * TILE_WIDTH, 0);
  ctx.lineTo(adjustedGridExtent * TILE_WIDTH, 0);
  ctx.stroke();
};