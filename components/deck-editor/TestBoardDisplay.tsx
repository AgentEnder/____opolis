import React, { useRef, useEffect } from "react";
import { Card } from "../../types/game";
import { CardDefinition, ZoneType } from "../../types/deck";
import { BoardPosition, RuleTestResults } from "../../types/ruleTesting";
import {
  drawTileMap,
  drawRoadMap,
  drawGrid,
  getCellColor,
  TILE_WIDTH,
  TILE_HEIGHT,
  CARD_WIDTH,
  CARD_HEIGHT,
} from "../../utils/canvasUtils";

interface TestBoardDisplayProps {
  board: Card[];
  selectedCardDef: CardDefinition | null;
  zoneTypes: ZoneType[];
  onCardPlace: (x: number, y: number) => void;
  scoringResults?: RuleTestResults | null;
}

export function TestBoardDisplay({
  board,
  selectedCardDef,
  zoneTypes,
  onCardPlace,
  scoringResults,
}: TestBoardDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants - using GameBoard's exact values
  const SCALE = 1;
  const GRID_EXTENT = 12; // Show a 12x12 tile grid
  const CANVAS_WIDTH = GRID_EXTENT * TILE_WIDTH;
  const CANVAS_HEIGHT = GRID_EXTENT * TILE_HEIGHT;

  // Convert canvas coordinate to board coordinate (tile-based, matching GameBoard)
  const canvasToWorldPosition = (
    canvasX: number,
    canvasY: number
  ): BoardPosition => {
    // Adjust for centered coordinate system
    const worldX = canvasX - CANVAS_WIDTH / 2;
    const worldY = canvasY - CANVAS_HEIGHT / 2;

    // Convert to grid coordinates (matching GameBoard logic)
    const gridX = Math.round(
      (worldX - (CARD_WIDTH * TILE_WIDTH) / 2) / TILE_WIDTH
    );
    const gridY = Math.round(
      (worldY - (CARD_HEIGHT * TILE_HEIGHT) / 2) / TILE_HEIGHT
    );

    return { x: gridX, y: gridY };
  };

  // Draw highlighting overlay for scoring results
  const drawHighlights = (ctx: CanvasRenderingContext2D) => {
    if (
      !scoringResults?.highlightedTiles ||
      scoringResults.highlightedTiles.length === 0
    ) {
      return;
    }

    ctx.save();

    scoringResults.highlightedTiles.forEach((highlight) => {
      const x = highlight.col * TILE_WIDTH;
      const y = highlight.row * TILE_HEIGHT;

      // Draw highlight overlay
      ctx.fillStyle = highlight.color || "#3b82f6";
      ctx.globalAlpha = highlight.intensity || 0.4;
      ctx.fillRect(x, y, TILE_WIDTH, TILE_HEIGHT);

      // Draw highlight border
      ctx.globalAlpha = 1;
      ctx.strokeStyle = highlight.color || "#3b82f6";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, TILE_WIDTH, TILE_HEIGHT);
    });

    ctx.restore();
  };

  // Draw card preview overlay
  const drawCardPreview = (ctx: CanvasRenderingContext2D, card: Card) => {
    ctx.save();

    const x = card.x * TILE_WIDTH;
    const y = card.y * TILE_HEIGHT;
    const width = CARD_WIDTH * TILE_WIDTH;
    const height = CARD_HEIGHT * TILE_HEIGHT;

    // Semi-transparent preview
    ctx.globalAlpha = 0.6;

    // Preview background
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(x, y, width, height);

    // Preview border
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.restore();
  };

  // Main render function
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context for transform
    ctx.save();

    // Apply transform to center the coordinate system
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX, centerY);

    // Draw grid background using GameBoard utilities
    drawGrid(ctx, canvas.width, canvas.height, SCALE, GRID_EXTENT);

    // Draw all placed cards using GameBoard utilities
    if (board.length > 0) {
      // First pass: draw tile backgrounds
      drawTileMap(ctx, board, zoneTypes, SCALE);
      // Second pass: draw roads on top
      drawRoadMap(ctx, board, SCALE);
    }

    // Draw scoring highlights
    drawHighlights(ctx);

    ctx.restore();
  };

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    const worldPos = canvasToWorldPosition(canvasX, canvasY);
    onCardPlace(worldPos.x, worldPos.y);
  };

  // Handle mouse move for preview
  const [mouseGridPos, setMouseGridPos] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedCardDef) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    const worldPos = canvasToWorldPosition(canvasX, canvasY);
    setMouseGridPos(worldPos);
  };

  const handleMouseLeave = () => {
    setMouseGridPos(null);
  };

  // Render effect
  useEffect(() => {
    render();

    // Draw preview card if hovering
    if (mouseGridPos && selectedCardDef && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Apply same transform as main render
        ctx.save();
        const centerX = canvasRef.current.width / 2;
        const centerY = canvasRef.current.height / 2;
        ctx.translate(centerX, centerY);

        const previewCard: Card = {
          id: "preview",
          x: mouseGridPos.x,
          y: mouseGridPos.y,
          cells: selectedCardDef.cells,
          rotation: 0,
        };
        drawCardPreview(ctx, previewCard);

        ctx.restore();
      }
    }
  });

  return (
    <div
      ref={containerRef}
      className="relative bg-gray-50 rounded-lg overflow-hidden border"
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="cursor-pointer"
        onClick={handleCanvasClick}
        onMouseMove={selectedCardDef ? handleMouseMove : undefined}
        onMouseLeave={handleMouseLeave}
        style={{
          imageRendering: "pixelated",
          width: "100%",
          height: "100%",
        }}
      />

      {/* Legend */}
      <div className="absolute top-2 right-2 bg-white bg-opacity-90 p-2 rounded shadow-sm">
        <div className="text-xs font-medium mb-1">Zones</div>
        <div className="space-y-1">
          {zoneTypes.map((zone) => (
            <div key={zone.id} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: zone.color }}
              />
              <span className="text-xs">{zone.name}</span>
            </div>
          ))}
        </div>

        {scoringResults?.calculatedScore !== undefined && (
          <div className="mt-2 pt-2 border-t">
            <div className="text-xs font-medium">Score</div>
            <div className="text-lg font-bold text-primary">
              {scoringResults.calculatedScore}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
