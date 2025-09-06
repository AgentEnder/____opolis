import React, { useEffect, useRef } from 'react';
import { ScoreResult } from '../../types/scoring';

interface ScoringVisualizationProps {
  scoreResult: ScoreResult | null;
  isVisible: boolean;
  position?: { x: number; y: number };
}

interface ScoreAnimation {
  id: string;
  points: number;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  progress: number;
  color: string;
  label: string;
}

export default function ScoringVisualization({ 
  scoreResult, 
  isVisible,
  position = { x: 0, y: 0 }
}: ScoringVisualizationProps) {
  const [animations, setAnimations] = React.useState<ScoreAnimation[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isVisible || !scoreResult) {
      setAnimations([]);
      return;
    }

    // Create animations for score changes
    const newAnimations: ScoreAnimation[] = [];
    
    // Add animations for cluster scores
    if (scoreResult.clusterScores) {
      Object.entries(scoreResult.clusterScores).forEach(([type, score], index) => {
        if (score > 0) {
          newAnimations.push({
            id: `cluster-${type}`,
            points: score,
            startPos: { 
              x: position.x + (index * 30), 
              y: position.y 
            },
            endPos: { 
              x: window.innerWidth - 200, 
              y: 100 + (index * 30) 
            },
            progress: 0,
            color: getColorForType(type),
            label: type
          });
        }
      });
    }

    // Add animations for condition scores
    if (scoreResult.conditionScores) {
      scoreResult.conditionScores.forEach((condScore, index) => {
        if (condScore.points !== 0) {
          newAnimations.push({
            id: `condition-${condScore.condition.id}`,
            points: condScore.points,
            startPos: { 
              x: position.x, 
              y: position.y + 50 
            },
            endPos: { 
              x: 100, 
              y: window.innerHeight - 200 - (index * 40) 
            },
            progress: 0,
            color: condScore.points > 0 ? '#10b981' : '#ef4444',
            label: condScore.condition.name
          });
        }
      });
    }

    setAnimations(newAnimations);

    // Animate the scores
    let startTime: number | null = null;
    const duration = 1500; // 1.5 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimations(prev => prev.map(anim => ({
        ...anim,
        progress: easeOutCubic(progress)
      })));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Remove animations after completion
        setTimeout(() => setAnimations([]), 500);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, scoreResult, position]);

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  React.useEffect(() => {
    // Component cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const getColorForType = (type: string): string => {
    const colors: Record<string, string> = {
      residential: '#60a5fa',
      commercial: '#f59e0b',
      industrial: '#6b7280',
      park: '#34d399'
    };
    return colors[type] || '#8b5cf6';
  };

  if (!isVisible || animations.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {animations.map(anim => {
        const x = anim.startPos.x + (anim.endPos.x - anim.startPos.x) * anim.progress;
        const y = anim.startPos.y + (anim.endPos.y - anim.startPos.y) * anim.progress;
        const opacity = anim.progress < 0.9 ? 1 : 1 - ((anim.progress - 0.9) * 10);
        const scale = 1 + (anim.progress * 0.2);

        return (
          <div
            key={anim.id}
            className="absolute flex items-center gap-2"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              transition: 'none'
            }}
          >
            <div 
              className="px-3 py-1 rounded-full font-bold text-white shadow-lg"
              style={{ 
                backgroundColor: anim.color,
                boxShadow: `0 0 20px ${anim.color}40`
              }}
            >
              {anim.points > 0 ? '+' : ''}{anim.points}
            </div>
            <div className="text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded shadow">
              {anim.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Tile highlight overlay component
export function TileHighlightOverlay({ 
  highlightedTiles,
  tileSize = 40,
  boardOffset = { x: 0, y: 0 }
}: {
  highlightedTiles: Array<{ x: number; y: number }> | null;
  tileSize?: number;
  boardOffset?: { x: number; y: number };
}) {
  if (!highlightedTiles || highlightedTiles.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {highlightedTiles.map((tile, index) => (
        <div
          key={`${tile.x}-${tile.y}-${index}`}
          className="absolute animate-pulse"
          style={{
            left: `${boardOffset.x + tile.x * tileSize}px`,
            top: `${boardOffset.y + tile.y * tileSize}px`,
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            border: '3px solid #fbbf24',
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
            borderRadius: '4px'
          }}
        />
      ))}
    </div>
  );
}