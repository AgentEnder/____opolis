import React, { useEffect, useState } from 'react';
import { Card } from '../../types/game';
import { CustomMetadataField } from '../../types/metadataSystem';
import { renderZoneMetadata } from '../../utils/metadataRenderer';

interface MetadataSVGOverlayProps {
  cards: Card[];
  metadataFields: CustomMetadataField[];
  tileWidth: number;
  tileHeight: number;
  cardWidth: number;
  cardHeight: number;
  transform: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };
  containerWidth: number;
  containerHeight: number;
}

interface RenderedMetadata {
  tileKey: string;
  x: number;
  y: number;
  jsxElement: React.ReactElement | null;
  error?: string;
}

export function MetadataSVGOverlay({
  cards,
  metadataFields,
  tileWidth,
  tileHeight,
  cardWidth,
  cardHeight,
  transform,
  containerWidth,
  containerHeight,
}: MetadataSVGOverlayProps) {
  const [renderedMetadata, setRenderedMetadata] = useState<RenderedMetadata[]>([]);

  useEffect(() => {
    const renderMetadata = async () => {
      const results: RenderedMetadata[] = [];
      
      // Filter fields that have rendering enabled
      const renderableFields = metadataFields.filter(
        field => field.renderOnCard && field.renderFormula
      );

      if (renderableFields.length === 0) {
        setRenderedMetadata([]);
        return;
      }

      // Build tile map with metadata from all cards
      const tileMap = new Map<string, { 
        type: string; 
        metadata?: any; 
        row: number; 
        col: number;
        x: number;
        y: number;
      }>();

      cards.forEach((card) => {
        for (let row = 0; row < cardHeight; row++) {
          for (let col = 0; col < cardWidth; col++) {
            if (card.cells && card.cells[row] && card.cells[row][col]) {
              const cell = card.cells[row][col];
              const tileKey = `${card.x + col},${card.y + row}`;
              const worldX = (card.x + col) * tileWidth;
              const worldY = (card.y + row) * tileHeight;
              
              tileMap.set(tileKey, {
                type: cell.type,
                metadata: cell.customMetadata,
                row: row,
                col: col,
                x: worldX,
                y: worldY,
              });
            }
          }
        }
      });

      // Render metadata for each tile
      for (const [tileKey, tile] of tileMap.entries()) {
        if (!tile.metadata) continue; // Skip tiles without metadata
        
        // Create mock cell data for the renderer
        const mockCell = {
          type: tile.type as any,
          roads: [],
          customMetadata: tile.metadata
        };
        
        try {
          // Render metadata for this zone
          const elements = await renderZoneMetadata(
            mockCell,
            { row: tile.row, col: tile.col },
            renderableFields
          );
          
          // For now, we'll combine all JSX elements from all fields into a single group
          if (elements.length > 0 && elements[0]) {
            const firstResult = elements[0];
            if (firstResult.jsxElement) {
              results.push({
                tileKey,
                x: tile.x,
                y: tile.y,
                jsxElement: firstResult.jsxElement,
              });
            }
          }
        } catch (error) {
          console.warn(`Error rendering metadata for tile ${tileKey}:`, error);
          results.push({
            tileKey,
            x: tile.x,
            y: tile.y,
            jsxElement: null,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      setRenderedMetadata(results);
    };

    renderMetadata();
  }, [cards, metadataFields, tileWidth, tileHeight, cardWidth, cardHeight]);

  // Calculate SVG transform
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const svgTransform = `translate(${centerX + transform.offsetX}, ${centerY + transform.offsetY}) scale(${transform.scale})`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={containerWidth}
      height={containerHeight}
      style={{ zIndex: 10 }}
    >
      <g transform={svgTransform}>
        {renderedMetadata.map(({ tileKey, x, y, jsxElement, error }) => (
          <g key={tileKey}>
            {/* SVG wrapper for each tile's metadata */}
            <svg
              x={x}
              y={y}
              width={tileWidth}
              height={tileHeight}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {error ? (
                // Error indicator
                <circle
                  cx={90}
                  cy={10}
                  r={3}
                  fill="#ff0000"
                  title={error}
                />
              ) : jsxElement ? (
                // Render the JSX element
                <foreignObject x={0} y={0} width="100%" height="100%">
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {jsxElement}
                  </div>
                </foreignObject>
              ) : (
                // Simple metadata indicator
                <circle
                  cx={90}
                  cy={10}
                  r={2}
                  fill="#ff6b35"
                  opacity={0.7}
                />
              )}
            </svg>
          </g>
        ))}
      </g>
    </svg>
  );
}