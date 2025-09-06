import React from 'react';
import { ScoreResult, ScoringDetail } from '../../types/scoring';
import { GameState } from '../../types/game';

interface EnhancedScoringDisplayProps {
  gameState: GameState | null;
  scoreResult: ScoreResult | null;
  onHighlightTiles?: (tiles: Array<{ x: number; y: number }> | null) => void;
  isCustomDeck?: boolean;
}

export default function EnhancedScoringDisplay({
  gameState,
  scoreResult,
  onHighlightTiles,
  isCustomDeck = false
}: EnhancedScoringDisplayProps) {
  if (!gameState || !scoreResult) return null;

  const handleConditionHover = (details?: ScoringDetail) => {
    if (details?.relevantTiles && onHighlightTiles) {
      onHighlightTiles(details.relevantTiles);
    }
  };

  const handleConditionLeave = () => {
    if (onHighlightTiles) {
      onHighlightTiles(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      {/* Score Summary */}
      <div className="border-b pb-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Score Breakdown</h3>
          <div className="text-2xl font-bold text-green-600">
            {scoreResult.totalScore}
          </div>
        </div>
        
        {gameState.scoring && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Target Score:</span>
            <span className={`font-semibold ${
              scoreResult.totalScore >= gameState.scoring.targetScore 
                ? 'text-green-600' 
                : 'text-orange-600'
            }`}>
              {gameState.scoring.targetScore}
            </span>
          </div>
        )}
      </div>

      {/* Base Score Section */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700">Base Scoring</h4>
        
        {/* Cluster Scores */}
        <div className="space-y-1">
          {Object.entries(scoreResult.clusterScores).map(([type, score]) => {
            const cluster = scoreResult.largestClusters?.[type as keyof typeof scoreResult.largestClusters];
            if (!cluster || cluster.size === 0) return null;
            
            return (
              <div
                key={type}
                className="flex justify-between text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                onMouseEnter={() => {
                  if (cluster?.tiles) {
                    const tiles = cluster.tiles.map(t => ({ x: t.x, y: t.y }));
                    onHighlightTiles?.(tiles);
                  }
                }}
                onMouseLeave={handleConditionLeave}
              >
                <span className="capitalize text-gray-600">{type}:</span>
                <span className="font-semibold">{score}</span>
              </div>
            );
          })}
          
          {/* Road Penalty */}
          {scoreResult.roadNetworks && scoreResult.roadNetworks.length > 0 && (
            <div
              className="flex justify-between text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
              onMouseEnter={() => {
                const tiles: Array<{ x: number; y: number }> = [];
                scoreResult.roadNetworks?.forEach(network => {
                  network.segments.forEach(seg => {
                    if (!tiles.some(t => t.x === seg.x && t.y === seg.y)) {
                      tiles.push({ x: seg.x, y: seg.y });
                    }
                  });
                });
                onHighlightTiles?.(tiles);
              }}
              onMouseLeave={handleConditionLeave}
            >
              <span className="text-gray-600">Road Networks:</span>
              <span className="font-semibold text-red-600">
                {scoreResult.roadPenalty}
              </span>
            </div>
          )}
          
          <div className="border-t pt-1 flex justify-between text-sm font-semibold">
            <span>Base Total:</span>
            <span>{scoreResult.baseScore}</span>
          </div>
        </div>
      </div>

      {/* Scoring Conditions */}
      {gameState.scoring && scoreResult.conditionScores.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            Scoring Conditions
            {isCustomDeck && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Custom
              </span>
            )}
          </h4>
          
          <div className="space-y-2">
            {gameState.scoring.activeConditions.map((condition, index) => {
              const condScore = scoreResult.conditionScores[index];
              const hasDetails = condScore?.details?.relevantTiles && 
                               condScore.details.relevantTiles.length > 0;
              
              return (
                <div
                  key={condition.id}
                  className={`border rounded-lg p-3 transition-all ${
                    hasDetails ? 'cursor-pointer hover:shadow-md hover:border-blue-300' : ''
                  } ${isCustomDeck ? 'bg-purple-50 border-purple-200' : 'bg-gray-50'}`}
                  onMouseEnter={() => hasDetails && handleConditionHover(condScore?.details)}
                  onMouseLeave={() => hasDetails && handleConditionLeave()}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{condition.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {condition.description}
                      </div>
                      {condScore?.details?.description && (
                        <div className="text-xs text-gray-500 mt-2">
                          {condScore.details.description}
                        </div>
                      )}
                    </div>
                    <div className={`ml-3 font-bold text-lg ${
                      (condScore?.points || 0) > 0 ? 'text-green-600' : 
                      (condScore?.points || 0) < 0 ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {(condScore?.points || 0) > 0 && '+'}{condScore?.points || 0}
                    </div>
                  </div>
                  
                  {condScore && 'executionTime' in condScore && (
                    <div className="text-xs text-gray-400 mt-1">
                      Evaluated in {Math.round((condScore as any).executionTime || 0)}ms
                    </div>
                  )}
                </div>
              );
            })}
            
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Conditions Total:</span>
              <span className={scoreResult.conditionTotal > 0 ? 'text-green-600' : 
                              scoreResult.conditionTotal < 0 ? 'text-red-600' : ''}>
                {scoreResult.conditionTotal > 0 && '+'}{scoreResult.conditionTotal}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Final Score */}
      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Final Score:</span>
          <span className="text-2xl font-bold text-green-600">
            {scoreResult.totalScore}
          </span>
        </div>
        
        {gameState.scoring && (
          <div className="mt-2">
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full transition-all ${
                  scoreResult.totalScore >= gameState.scoring.targetScore
                    ? 'bg-green-500'
                    : 'bg-orange-500'
                }`}
                style={{
                  width: `${Math.min(100, (scoreResult.totalScore / gameState.scoring.targetScore) * 100)}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>Target: {gameState.scoring.targetScore}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}