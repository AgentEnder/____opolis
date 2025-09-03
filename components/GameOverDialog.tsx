import { GameState } from "../types/game";
import { getCurrentScore } from "../utils/gameLogic";

interface GameOverDialogProps {
  gameState: GameState;
  onViewMap: () => void;
  onNewGame: () => void;
}

export default function GameOverDialog({ gameState, onViewMap, onNewGame }: GameOverDialogProps) {
  const finalScore = getCurrentScore(gameState);
  
  // Determine if target was reached
  const targetReached = finalScore.totalScore >= finalScore.targetScore;
  const scorePercentage = Math.round((finalScore.totalScore / finalScore.targetScore) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Header */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Game Over!
          </h2>
          
          {/* Result Status */}
          <div className={`text-6xl mb-4 ${targetReached ? 'text-green-500' : 'text-orange-500'}`}>
            {targetReached ? '🎉' : '🏙️'}
          </div>
          
          {/* Score Summary */}
          <div className="mb-6">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {finalScore.totalScore}
              <span className="text-lg text-gray-500 ml-2">
                / {finalScore.targetScore}
              </span>
            </div>
            
            <div className={`text-lg font-semibold mb-2 ${
              targetReached 
                ? 'text-green-600' 
                : scorePercentage >= 80 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
            }`}>
              {targetReached 
                ? '🎯 Target Reached!' 
                : scorePercentage >= 80
                  ? '📈 Almost There!'
                  : '💪 Room to Grow!'
              }
            </div>
            
            <div className="text-gray-600">
              You scored {scorePercentage}% of the target
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-3 text-center">Final Score Breakdown</h3>
            
            <div className="space-y-2 text-sm">
              {/* Base Score */}
              <div className="flex justify-between">
                <span>Base Score:</span>
                <span className="font-semibold">{finalScore.baseScore}</span>
              </div>
              
              {/* Cluster Scores */}
              <div className="border-t pt-2 space-y-1">
                <div className="text-xs text-gray-500 mb-1">Largest Clusters:</div>
                {Object.keys(finalScore.clusterScores).map(type => {
                  const score = finalScore.clusterScores[type];
                  if (score === 0) return null;
                  return (
                    <div key={type} className="flex justify-between pl-2">
                      <span className="capitalize">{type}:</span>
                      <span>+{score}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Road Penalty */}
              {finalScore.roadPenalty < 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Road Networks:</span>
                  <span>{finalScore.roadPenalty}</span>
                </div>
              )}
              
              {/* Condition Scores */}
              {finalScore.conditionTotal > 0 && (
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span>Scoring Conditions:</span>
                    <span className="font-semibold text-blue-600">+{finalScore.conditionTotal}</span>
                  </div>
                  {finalScore.conditionScores.map((conditionScore, index) => {
                    if (conditionScore.points === 0) return null;
                    return (
                      <div key={index} className="flex justify-between pl-2 text-xs text-gray-600">
                        <span className="truncate">{conditionScore.condition.name}:</span>
                        <span>+{conditionScore.points}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Total */}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total Score:</span>
                <span className="text-green-600">{finalScore.totalScore}</span>
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm">
            <h3 className="font-semibold text-gray-700 mb-2">Game Statistics</h3>
            <div className="grid grid-cols-2 gap-2 text-gray-600">
              <div>
                <div className="font-medium">{gameState.turnCount}</div>
                <div className="text-xs">Turns Played</div>
              </div>
              <div>
                <div className="font-medium">{gameState.board.length}</div>
                <div className="text-xs">Cards Placed</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onViewMap}
              className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 font-semibold transition-colors"
            >
              📍 View Map
            </button>
            <button
              onClick={onNewGame}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 font-semibold transition-colors"
            >
              🎮 New Game
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            View the map to explore your scoring breakdown with interactive highlights
          </div>
        </div>
      </div>
    </div>
  );
}