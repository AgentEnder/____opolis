import React, { useRef, useEffect, useCallback } from "react";
import { GameState, Card } from "../types/game";
import { useUIStore } from "../stores/uiStore";
import { GameMachineContextValue } from "../providers/GameMachineProvider";
import { RuleTestMachineContextType } from "../providers/RuleTestMachineProvider";
import { renderZoneMetadataOnCanvas } from "../utils/metadataRenderer";
import { CustomMetadataField } from "../types/metadataSystem";

interface GameBoardProps {
  gameState: GameState;
  onCardPlace?: (x: number, y: number) => void;
  // Machine context that provides selectors and actions
  machine: GameMachineContextValue | RuleTestMachineContextType;
  // Optional size constraints for embedded usage
  width?: number;
  height?: number;
  containerRef?: React.RefObject<HTMLElement>;
}

export default function GameBoard({
  gameState,
  onCardPlace,
  machine,
  width,
  height,
  containerRef,
}: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseGridPos, setMouseGridPos] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  // State for card placement dragging
  const [isCardDragging, setIsCardDragging] = React.useState(false);
  const [cardDragStart, setCardDragStart] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  const {
    transform,
    isDragging,
    dragStart,
    setDragging,
    setTransform,
    isPlacing,
    highlightedTiles,
  } = useUIStore();

  // Get state and actions from the passed machine context
  const selectedCard = machine.selectors.selectedCard;
  const cardRotation = machine.selectors.cardRotation || 0;
  const selectedVariations = machine.selectors.selectedVariations || [];
  const actions = machine.actions;

  // Simple validation function - check if position overlaps with existing cards
  const isValidPlacementPosition = (gridX: number, gridY: number): boolean => {
    if (!gameState.board || gameState.board.length === 0) return true;

    // Check if the new card would overlap with existing cards
    return !gameState.board.some((existingCard) => {
      const overlapX =
        gridX < existingCard.x + CARD_WIDTH &&
        gridX + CARD_WIDTH > existingCard.x;
      const overlapY =
        gridY < existingCard.y + CARD_HEIGHT &&
        gridY + CARD_HEIGHT > existingCard.y;
      return overlapX && overlapY;
    });
  };

  // Grid constants - each tile is 3:2 aspect ratio, cards are 2x2 tiles
  const TILE_WIDTH = 60; // 3:2 aspect ratio tile
  const TILE_HEIGHT = 40; // 3:2 aspect ratio tile
  const CARD_WIDTH = 2; // 2 tiles wide
  const CARD_HEIGHT = 2; // 2 tiles tall

  // Get canvas dimensions - use provided dimensions or container/window
  const getCanvasDimensions = useCallback(() => {
    if (width && height) {
      return { width, height };
    }
    if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  }, [width, height, containerRef]);

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on props or container
    const dimensions = getCanvasDimensions();
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context for transform
    ctx.save();

    // Apply transform - center the coordinate system and apply offset/scale
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.translate(centerX + transform.offsetX, centerY + transform.offsetY);
    ctx.scale(transform.scale, transform.scale);

    // Draw grid
    drawGrid(ctx);

    // Draw tiles using tile map approach for better performance (multi-pass rendering)
    if (gameState.board) {
      drawTileMap(ctx, gameState.board);
      // Second pass: draw all roads on top
      drawRoadMap(ctx, gameState.board);
      // Third pass: draw metadata on top of roads
      await drawMetadata(ctx, gameState.board);
    }

    // Draw dimmed tiles for scoring visualization
    if (highlightedTiles && highlightedTiles.length > 0) {
      drawDimmedTiles(ctx, highlightedTiles);
    }

    // Draw placement preview
    if (selectedCard && mouseGridPos) {
      drawCardPreview(
        ctx,
        selectedCard,
        mouseGridPos.x,
        mouseGridPos.y,
        cardRotation
      );
    }

    ctx.restore();
  }, [
    gameState.board,
    transform,
    selectedCard,
    mouseGridPos,
    cardRotation,
    highlightedTiles,
    getCanvasDimensions,
  ]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      draw();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  // Handle keyboard input for card rotation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "r" &&
        selectedCard &&
        !e.metaKey &&
        !e.altKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        actions?.rotateCard();
        console.log("Card rotated");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCard, actions]);

  const drawDimmedTiles = (
    ctx: CanvasRenderingContext2D,
    relevantTiles: Array<{ x: number; y: number }>
  ) => {
    ctx.save();

    // Get all tiles that exist on the board
    const allTiles: Array<{ x: number; y: number }> = [];
    if (gameState.board) {
      gameState.board.forEach((card) => {
        for (let row = 0; row < CARD_HEIGHT; row++) {
          for (let col = 0; col < CARD_WIDTH; col++) {
            if (card.cells && card.cells[row] && card.cells[row][col]) {
              allTiles.push({ x: card.x + col, y: card.y + row });
            }
          }
        }
      });
    }

    // Find tiles that should be dimmed (all tiles except the relevant ones)
    const dimmedTiles = allTiles.filter(
      (tile) =>
        !relevantTiles.some(
          (relevant) => relevant.x === tile.x && relevant.y === tile.y
        )
    );

    // Draw dimming overlay on non-relevant tiles
    dimmedTiles.forEach((tile) => {
      const x = tile.x * TILE_WIDTH;
      const y = tile.y * TILE_HEIGHT;

      // Draw dimming overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // Black with transparency to dim
      ctx.fillRect(x, y, TILE_WIDTH, TILE_HEIGHT);
    });

    ctx.restore();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 1 / transform.scale; // Adjust line width for zoom

    const gridExtent = Math.ceil(30 / transform.scale); // Adjust grid extent based on zoom

    // Vertical lines (use TILE_WIDTH spacing)
    for (let x = -gridExtent; x <= gridExtent; x++) {
      const xPos = x * TILE_WIDTH;
      ctx.beginPath();
      ctx.moveTo(xPos, -gridExtent * TILE_HEIGHT);
      ctx.lineTo(xPos, gridExtent * TILE_HEIGHT);
      ctx.stroke();
    }

    // Horizontal lines (use TILE_HEIGHT spacing)
    for (let y = -gridExtent; y <= gridExtent; y++) {
      const yPos = y * TILE_HEIGHT;
      ctx.beginPath();
      ctx.moveTo(-gridExtent * TILE_WIDTH, yPos);
      ctx.lineTo(gridExtent * TILE_WIDTH, yPos);
      ctx.stroke();
    }

    // Center axis lines (thicker)
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 2 / transform.scale;

    // Center vertical line
    ctx.beginPath();
    ctx.moveTo(0, -gridExtent * TILE_HEIGHT);
    ctx.lineTo(0, gridExtent * TILE_HEIGHT);
    ctx.stroke();

    // Center horizontal line
    ctx.beginPath();
    ctx.moveTo(-gridExtent * TILE_WIDTH, 0);
    ctx.lineTo(gridExtent * TILE_WIDTH, 0);
    ctx.stroke();
  };

  const drawCardPreview = (
    ctx: CanvasRenderingContext2D,
    card: Card,
    gridX: number,
    gridY: number,
    rotation: number = 0
  ) => {
    const x = gridX * TILE_WIDTH;
    const y = gridY * TILE_HEIGHT;
    const width = CARD_WIDTH * TILE_WIDTH;
    const height = CARD_HEIGHT * TILE_HEIGHT;

    // Check if placement is valid
    const isValid = isValidPlacementPosition(gridX, gridY);

    // Semi-transparent preview
    ctx.globalAlpha = 0.8;

    // Save context for rotation
    ctx.save();

    // Apply rotation if needed
    if (rotation !== 0) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }

    // Card background - different color for invalid placement
    ctx.fillStyle = isValid ? "#ffffff" : "#fee2e2"; // Light red for invalid
    ctx.fillRect(x, y, width, height);

    // Card border - thicker and more visible for preview
    ctx.strokeStyle = isValid ? "#22c55e" : "#dc2626"; // Green for valid, red for invalid
    ctx.lineWidth = 4 / transform.scale; // Thicker border
    ctx.strokeRect(x, y, width, height);

    // Additional red border for invalid placements
    if (!isValid) {
      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 2 / transform.scale;
      ctx.strokeRect(x - 2, y - 2, width + 4, height + 4); // Outer red border
    }

    // Draw cell contents
    for (let row = 0; row < CARD_HEIGHT; row++) {
      for (let col = 0; col < CARD_WIDTH; col++) {
        if (card.cells && card.cells[row] && card.cells[row][col]) {
          const cell = card.cells[row][col];
          const cellX = x + col * TILE_WIDTH;
          const cellY = y + row * TILE_HEIGHT;

          // Cell background color
          const cellColor = getCellColor(cell.type);
          ctx.fillStyle = cellColor;
          const borderOffset = 1 / transform.scale;
          ctx.fillRect(
            cellX + borderOffset,
            cellY + borderOffset,
            TILE_WIDTH - 2 * borderOffset,
            TILE_HEIGHT - 2 * borderOffset
          );

          // Draw roads if present
          if (cell.roads && cell.roads.length > 0) {
            // Road thickness should be proportional to tile size (about 12.5% of tile width)
            ctx.lineWidth = TILE_WIDTH * 0.125; // 12.5% of tile width
            cell.roads.forEach((road) => {
              drawRoad(
                ctx,
                cellX,
                cellY,
                TILE_WIDTH,
                TILE_HEIGHT,
                road,
                undefined
              );
            });
          }
        }
      }
    }

    // Card ID label

    // Reset alpha and restore context
    ctx.globalAlpha = 1.0;
    ctx.restore();
  };

  const drawTileMap = (ctx: CanvasRenderingContext2D, cards: Card[]) => {
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
              roads: cell.roads || [],
            });
          }
        }
      }
    });

    // Draw each unique tile once
    ctx.save();

    tileMap.forEach((tile, tileKey) => {
      const [x, y] = tileKey.split(",").map(Number);
      const cellX = x * TILE_WIDTH;
      const cellY = y * TILE_HEIGHT;

      // Cell background color based on type
      const cellColor = getCellColor(tile.type);
      ctx.fillStyle = cellColor;
      ctx.fillRect(cellX, cellY, TILE_WIDTH, TILE_HEIGHT);

      // Cell border
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1 / transform.scale;
      ctx.strokeRect(cellX, cellY, TILE_WIDTH, TILE_HEIGHT);

      // Roads will be drawn in the second pass
    });

    ctx.restore();
  };

  const drawRoadMap = (ctx: CanvasRenderingContext2D, cards: Card[]) => {
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
              roads: cell.roads || [],
            });
          }
        }
      }
    });

    // Second pass: draw all roads
    ctx.save();

    tileMap.forEach((tile, tileKey) => {
      if (tile.roads && tile.roads.length > 0) {
        const [x, y] = tileKey.split(",").map(Number);
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

  const drawMetadata = async (ctx: CanvasRenderingContext2D, cards: Card[]) => {
    // Get metadata schema from current deck variations (if available)
    let metadataFields: CustomMetadataField[] = [];
    for (const variation of selectedVariations) {
      if (variation.metadataSchema?.fields) {
        metadataFields = variation.metadataSchema.fields;
        break;
      }
    }

    if (metadataFields.length === 0) {
      return; // No metadata fields to render
    }

    // Build tile map with metadata from all cards (later cards override earlier ones)
    const tileMap = new Map<string, { 
      type: string; 
      metadata?: any; 
      row: number; 
      col: number;
      cell: any;
    }>();

    cards.forEach((card) => {
      for (let row = 0; row < CARD_HEIGHT; row++) {
        for (let col = 0; col < CARD_WIDTH; col++) {
          if (card.cells && card.cells[row] && card.cells[row][col]) {
            const cell = card.cells[row][col];
            const tileKey = `${card.x + col},${card.y + row}`;
            tileMap.set(tileKey, {
              type: cell.type,
              metadata: cell.customMetadata,
              row: row,
              col: col,
              cell: cell,
            });
          }
        }
      }
    });

    // Third pass: draw metadata on each tile
    for (const [tileKey, tile] of tileMap.entries()) {
      if (!tile.metadata) continue; // Skip tiles without metadata
      
      const [x, y] = tileKey.split(",").map(Number);
      const cellX = x * TILE_WIDTH;
      const cellY = y * TILE_HEIGHT;
      
      try {
        // Render metadata using the new Canvas approach
        await renderZoneMetadataOnCanvas(
          ctx,
          cellX,
          cellY,
          TILE_WIDTH,
          TILE_HEIGHT,
          tile.cell,
          { row: tile.row, col: tile.col },
          metadataFields,
          gameState
        );
      } catch (error) {
        console.warn(`Error rendering metadata for tile ${tileKey}:`, error);
        // Fallback: Draw simple metadata representation
        drawSimpleMetadata(ctx, tile.metadata, cellX, cellY, TILE_WIDTH, TILE_HEIGHT);
      }
    }
  };


  const drawSimpleMetadata = (
    ctx: CanvasRenderingContext2D,
    metadata: any,
    cellX: number,
    cellY: number,
    cellWidth: number,
    cellHeight: number
  ) => {
    if (!metadata || Object.keys(metadata).length === 0) return;

    ctx.save();
    
    // Draw a simple indicator that metadata exists (small dot in top-right corner)
    const dotRadius = Math.max(2, cellWidth / 20);
    const dotX = cellX + cellWidth - dotRadius - 2;
    const dotY = cellY + dotRadius + 2;
    
    ctx.fillStyle = '#ff6b35'; // Orange dot to indicate metadata
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Optionally show first metadata value as text (very small)
    const firstValue = Object.values(metadata)[0];
    if (firstValue !== undefined && firstValue !== null && firstValue !== '') {
      ctx.fillStyle = '#333';
      ctx.font = `${Math.max(8, cellWidth / 15) / transform.scale}px Arial`;
      ctx.textAlign = 'left';
      ctx.fillText(String(firstValue).slice(0, 3), cellX + 2, cellY + 12);
    }
    
    ctx.restore();
  };

  const getCellColor = (type: string): string => {
    // Try to find the zone type color from selected variations
    for (const variation of selectedVariations) {
      if (variation.zoneTypes) {
        const zoneType = variation.zoneTypes.find((zt: any) => zt.id === type);
        if (zoneType) {
          return zoneType.color;
        }
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

  const drawRoad = (
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
          [1, 0], // right
          [0, 1], // bottom
          [-1, 0], // left
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
        ctx.strokeStyle = "#2d3748"; // Dark gray for asphalt
        ctx.lineWidth = roadWidth;
        ctx.lineJoin = "round";

        const isCornerRoad = fromEdge !== toEdge;

        if (isCornerRoad) {
          // For corner roads, draw a smooth curved path
          const cornerRadius = Math.min(
            roadWidth * 0.8,
            Math.min(tileWidth, tileHeight) * 0.3
          );

          ctx.lineCap = "butt"; // Use butt caps for curves to avoid overlap
          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);

          // Create smooth curve through center point
          ctx.arcTo(centerX, centerY, toPos.x, toPos.y, cornerRadius);
          ctx.lineTo(toPos.x, toPos.y);

          // Apply terminal rounding only to actual ends
          if (!fromConnected) {
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.lineTo(fromPos.x, fromPos.y);
            ctx.stroke();
            ctx.lineCap = "butt";
          }

          if (!toConnected) {
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(toPos.x, toPos.y);
            ctx.lineTo(toPos.x, toPos.y);
            ctx.stroke();
            ctx.lineCap = "butt";
          }

          // Draw the main curved road
          ctx.lineCap = "butt";
          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);
          ctx.arcTo(centerX, centerY, toPos.x, toPos.y, cornerRadius);
          ctx.lineTo(toPos.x, toPos.y);
          ctx.stroke();
        } else {
          // For straight roads, draw a simple line
          ctx.lineCap = fromConnected && toConnected ? "butt" : "round";
          if (!fromConnected) ctx.lineCap = "round";
          if (!toConnected) ctx.lineCap = "round";

          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);
          ctx.lineTo(toPos.x, toPos.y);
          ctx.stroke();
        }

        // Draw road markings (center line or edge lines)
        ctx.strokeStyle = "#fbbf24"; // Golden yellow for center lines
        ctx.lineWidth = roadWidth * 0.15; // Thinner marking lines
        ctx.lineCap = "butt"; // Always square caps for markings

        // Different marking patterns based on road type
        if (isCornerRoad) {
          // For corner roads, draw a subtle center guide following the curve
          ctx.setLineDash([roadWidth * 0.3, roadWidth * 0.2]); // Dashed line
          const cornerRadius = Math.min(
            roadWidth * 0.8,
            Math.min(tileWidth, tileHeight) * 0.3
          );

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

  const handleMouseDown = (e: React.MouseEvent) => {
    const canPlace = selectedCard && onCardPlace;
    console.log(
      "GameBoard: Mouse down, isPlacing:",
      isPlacing,
      "selectedCard:",
      !!selectedCard,
      "hasOnCardPlace:",
      !!onCardPlace,
      "canPlace:",
      canPlace
    );

    if (canPlace) {
      // Start card placement tracking (but also allow panning)
      setIsCardDragging(true);
      setCardDragStart({ x: e.clientX, y: e.clientY });
      console.log("Started card drag");
    }

    // Always allow camera dragging (whether or not we have a card selected)
    setDragging(true, { x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update preview position if we have a selected card
    if (selectedCard) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      // Transform to world coordinates using actual canvas center
      const dimensions = getCanvasDimensions();
      const worldX =
        (canvasX - dimensions.width / 2 - transform.offsetX) / transform.scale;
      const worldY =
        (canvasY - dimensions.height / 2 - transform.offsetY) / transform.scale;

      // Convert to grid coordinates - offset by half a card to center the cursor on the card
      const gridX = Math.round(
        (worldX - (CARD_WIDTH * TILE_WIDTH) / 2) / TILE_WIDTH
      );
      const gridY = Math.round(
        (worldY - (CARD_HEIGHT * TILE_HEIGHT) / 2) / TILE_HEIGHT
      );

      setMouseGridPos({ x: gridX, y: gridY });
    } else {
      setMouseGridPos(null);
    }

    // Handle camera dragging
    if (isDragging && dragStart) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setTransform({
        offsetX: transform.offsetX + deltaX,
        offsetY: transform.offsetY + deltaY,
      });

      setDragging(true, { x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isCardDragging && cardDragStart && selectedCard && onCardPlace) {
      // Check if this was a drag (mouse moved significantly) or just a click
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - cardDragStart.x, 2) +
          Math.pow(e.clientY - cardDragStart.y, 2)
      );

      // If it was a short drag/click (less than 5 pixels), treat as placement
      if (dragDistance < 5) {
        console.log("Short click detected - placing card");

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;

        // Transform to world coordinates using actual canvas center
        const dimensions = getCanvasDimensions();
        const worldX =
          (canvasX - dimensions.width / 2 - transform.offsetX) /
          transform.scale;
        const worldY =
          (canvasY - dimensions.height / 2 - transform.offsetY) /
          transform.scale;

        // Convert to grid coordinates - offset by half a card to center the cursor on the card
        const gridX = Math.round(
          (worldX - (CARD_WIDTH * TILE_WIDTH) / 2) / TILE_WIDTH
        );
        const gridY = Math.round(
          (worldY - (CARD_HEIGHT * TILE_HEIGHT) / 2) / TILE_HEIGHT
        );

        console.log("Placing card at grid:", gridX, gridY);
        onCardPlace(gridX, gridY);
      } else {
        console.log("Long drag detected - not placing card");
      }

      // Reset card drag state
      setIsCardDragging(false);
      setCardDragStart(null);
    }

    // Always reset camera drag state
    setDragging(false);
  };

  // Handle wheel events with proper event listener options
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(
        0.1,
        Math.min(3, transform.scale * scaleFactor)
      );

      // Zoom towards mouse position
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      const scaleChange = newScale / transform.scale;
      const newOffsetX =
        transform.offsetX - (mouseX - transform.offsetX) * (scaleChange - 1);
      const newOffsetY =
        transform.offsetY - (mouseY - transform.offsetY) * (scaleChange - 1);

      setTransform({
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      });
    };

    // Add event listener with passive: false to allow preventDefault
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [transform, setTransform]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{
        cursor: selectedCard ? "crosshair" : isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        // Reset all drag states when mouse leaves canvas
        setIsCardDragging(false);
        setCardDragStart(null);
        setDragging(false);
      }}
    />
  );
}
