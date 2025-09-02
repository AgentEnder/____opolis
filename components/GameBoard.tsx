import React, { useRef, useEffect, useCallback } from "react";
import { GameState, Card } from "../types/game";
import { useUIStore } from "../stores/uiStore";
import { useSharedGameMachine } from "../providers/GameMachineProvider";

interface GameBoardProps {
  gameState: GameState;
  onCardPlace?: (x: number, y: number) => void;
}

export default function GameBoard({ gameState, onCardPlace }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseGridPos, setMouseGridPos] = React.useState<{
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
  } = useUIStore();

  // Get selected card from game machine
  const { selectors: gameSelectors, actions } = useSharedGameMachine();
  const selectedCard = gameSelectors.selectedCard;
  const cardRotation = gameSelectors.cardRotation;

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

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to full viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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

    // Draw placed cards
    if (gameState.board) {
      gameState.board.forEach((card) => {
        drawCard(ctx, card);
      });
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
  }, [gameState.board, transform, selectedCard, mouseGridPos, cardRotation]);

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
      if (e.key.toLowerCase() === "r" && selectedCard) {
        e.preventDefault();
        actions.rotateCard();
        console.log("Card rotated");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCard, actions]);

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
            ctx.strokeStyle = "#000000";
            // Road thickness should be proportional to tile size (about 20% of tile width)
            ctx.lineWidth = TILE_WIDTH * 0.125; // 20% of tile width
            cell.roads.forEach((road) => {
              drawRoad(ctx, cellX, cellY, TILE_WIDTH, TILE_HEIGHT, road);
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

  const drawCard = (ctx: CanvasRenderingContext2D, card: Card) => {
    const x = card.x * TILE_WIDTH;
    const y = card.y * TILE_HEIGHT;
    const width = CARD_WIDTH * TILE_WIDTH;
    const height = CARD_HEIGHT * TILE_HEIGHT;

    // Save context (no rotation applied - cell data is already rotated)
    ctx.save();

    // Note: We don't apply canvas rotation here because the card's cell data
    // has already been rotated by the rotateCard function. Applying rotation
    // here would result in double rotation.

    // Card background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, width, height);

    // Card border - adjust thickness for zoom
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2 / transform.scale;
    ctx.strokeRect(x, y, width, height);

    // Draw cell contents (simplified)
    for (let row = 0; row < CARD_HEIGHT; row++) {
      for (let col = 0; col < CARD_WIDTH; col++) {
        if (card.cells && card.cells[row] && card.cells[row][col]) {
          const cell = card.cells[row][col];
          const cellX = x + col * TILE_WIDTH;
          const cellY = y + row * TILE_HEIGHT;

          // Cell background color based on type
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
            ctx.strokeStyle = "#000000";
            // Road thickness should be proportional to tile size (about 20% of tile width)
            ctx.lineWidth = TILE_WIDTH * 0.125; // 20% of tile width
            cell.roads.forEach((road) => {
              drawRoad(ctx, cellX, cellY, TILE_WIDTH, TILE_HEIGHT, road);
            });
          }
        }
      }
    }

    // Restore context
    ctx.restore();
  };

  const getCellColor = (type: string): string => {
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
        return "#ffffff"; // White
    }
  };

  const drawRoad = (
    ctx: CanvasRenderingContext2D,
    cellX: number,
    cellY: number,
    tileWidth: number,
    tileHeight: number,
    road: any
  ) => {
    const centerX = cellX + tileWidth / 2;
    const centerY = cellY + tileHeight / 2;

    // Road segments are [from_edge, to_edge] where edges are: top=0, right=1, bottom=2, left=3
    if (Array.isArray(road) && road.length === 2) {
      const [fromEdge, toEdge] = road;

      ctx.beginPath();

      // Draw from center to edges based on road segment
      const edges = [
        { x: centerX, y: cellY }, // top
        { x: cellX + tileWidth, y: centerY }, // right
        { x: centerX, y: cellY + tileHeight }, // bottom
        { x: cellX, y: centerY }, // left
      ];

      if (fromEdge >= 0 && fromEdge < 4 && toEdge >= 0 && toEdge < 4) {
        ctx.moveTo(edges[fromEdge].x, edges[fromEdge].y);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(edges[toEdge].x, edges[toEdge].y);
        ctx.stroke();
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
      // Calculate mouse position in world coordinates using full window size
      const canvasX = e.clientX;
      const canvasY = e.clientY;

      // Transform to world coordinates
      const worldX =
        (canvasX - window.innerWidth / 2 - transform.offsetX) / transform.scale;
      const worldY =
        (canvasY - window.innerHeight / 2 - transform.offsetY) /
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
      // Start dragging
      setDragging(true, { x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update preview position if we have a selected card
    if (selectedCard) {
      // Calculate mouse position in world coordinates
      const canvasX = e.clientX;
      const canvasY = e.clientY;

      // Transform to world coordinates
      const worldX =
        (canvasX - window.innerWidth / 2 - transform.offsetX) / transform.scale;
      const worldY =
        (canvasY - window.innerHeight / 2 - transform.offsetY) /
        transform.scale;

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

    // Handle dragging
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

  const handleMouseUp = () => {
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
      onMouseLeave={handleMouseUp}
    />
  );
}
