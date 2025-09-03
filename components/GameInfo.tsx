import { Card, GameState } from "../types/game";
import { getCurrentScore } from "../utils/gameLogic";
import { useUIStore } from "../stores/uiStore";
import CardPreview from "./CardPreview";

interface GameInfoProps {
  gameState: GameState | null;
  isMobile: boolean;
  isPlacing: boolean;
  selectedCard: Card | null;
  cardRotation: number;
  onRotate: () => void;
  onExit: () => void;
}

export default function GameInfo({
  gameState,
  isMobile,
  isPlacing,
  selectedCard,
  cardRotation,
  onRotate,
  onExit
}: GameInfoProps) {
  // Calculate current score
  const currentScore = gameState ? getCurrentScore(gameState) : null;
  
  // Get highlight actions from UI store
  const { setHighlightedTiles, setHighlightedClusterType, setShowRoadNetworks } = useUIStore();

  return (
    <>
      {/* Game Stats Panel - Top Left */}
      {gameState && !isMobile && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 min-w-48 max-w-64">
          <h3 className="font-bold text-sm mb-2 text-gray-800">Game Stats</h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Current Player:</span>
              <span className="font-semibold text-blue-600">
                {gameState.players[gameState.currentPlayerIndex].name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Turn:</span>
              <span className="font-semibold">{gameState.turnCount + 1}</span>
            </div>
            <div className="flex justify-between">
              <span>Cards in Deck:</span>
              <span className="font-semibold">{gameState.deck.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Cards Placed:</span>
              <span className="font-semibold">{gameState.board.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Players:</span>
              <span className="font-semibold">{gameState.players.length}</span>
            </div>
            
            {/* Scoring Information */}
            {currentScore && gameState.scoring && (
              <>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Score:</span>
                    <span className="font-bold text-lg text-green-600">
                      {currentScore.totalScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Target:</span>
                    <span className="font-semibold text-orange-600">
                      {gameState.scoring.targetScore}
                    </span>
                  </div>
                  
                  {/* Score Breakdown */}
                  <div className="text-xs mt-1 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Base:</span>
                      <span>{currentScore.baseScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conditions:</span>
                      <span>{currentScore.conditionTotal}</span>
                    </div>
                    
                    {/* Cluster scores with hover */}
                    {currentScore.largestClusters && (
                      <div className="border-t pt-1 mt-1 space-y-0.5">
                        {Object.keys(currentScore.largestClusters).map(type => {
                          const cluster = currentScore.largestClusters![type];
                          if (!cluster || cluster.size === 0) return null;
                          return (
                            <div 
                              key={type}
                              className="flex justify-between cursor-pointer hover:bg-gray-100 px-1 -mx-1 rounded"
                              onMouseEnter={() => {
                                const tiles = cluster.tiles.map(t => ({ x: t.x, y: t.y }));
                                setHighlightedTiles(tiles);
                                setHighlightedClusterType(type);
                              }}
                              onMouseLeave={() => {
                                setHighlightedTiles(null);
                                setHighlightedClusterType(null);
                              }}
                            >
                              <span className="capitalize text-xs">{type}:</span>
                              <span className="text-xs font-semibold">{cluster.size}</span>
                            </div>
                          );
                        })}
                        
                        {/* Roads with hover */}
                        {currentScore.roadNetworks && currentScore.roadNetworks.length > 0 && (
                          <div 
                            className="flex justify-between cursor-pointer hover:bg-gray-100 px-1 -mx-1 rounded"
                            onMouseEnter={() => {
                              const tiles: Array<{ x: number; y: number }> = [];
                              currentScore.roadNetworks!.forEach(network => {
                                network.segments.forEach(seg => {
                                  if (!tiles.some(t => t.x === seg.x && t.y === seg.y)) {
                                    tiles.push({ x: seg.x, y: seg.y });
                                  }
                                });
                              });
                              setHighlightedTiles(tiles);
                              setShowRoadNetworks(true);
                            }}
                            onMouseLeave={() => {
                              setHighlightedTiles(null);
                              setShowRoadNetworks(false);
                            }}
                          >
                            <span className="text-xs">Roads:</span>
                            <span className="text-xs font-semibold text-red-600">
                              -{currentScore.roadNetworks.length}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Scoring Conditions Panel - Bottom Left */}
      {gameState?.scoring && !isMobile && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-80">
          <h3 className="font-bold text-sm mb-2 text-gray-800">Scoring Conditions</h3>
          <div className="space-y-2 text-xs">
            {gameState.scoring.activeConditions.map((condition, index) => {
              const conditionScore = currentScore?.conditionScores[index];
              const hasDetails = conditionScore?.details?.relevantTiles && conditionScore.details.relevantTiles.length > 0;
              
              return (
                <div 
                  key={condition.id} 
                  className={`border rounded p-2 bg-gray-50 ${hasDetails ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onMouseEnter={() => {
                    if (hasDetails && conditionScore?.details?.relevantTiles) {
                      setHighlightedTiles(conditionScore.details.relevantTiles);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasDetails) {
                      setHighlightedTiles(null);
                    }
                  }}
                >
                  <div className="font-semibold text-gray-800">{condition.name}</div>
                  <div className="text-gray-600 mt-1">{condition.description}</div>
                  {currentScore && (
                    <div className="mt-1 flex justify-between items-center">
                      {conditionScore?.details?.description && (
                        <span className="text-xs text-gray-500">{conditionScore.details.description}</span>
                      )}
                      <span className="font-semibold text-blue-600">
                        +{conditionScore?.points || 0} pts
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Deck Card */}
      {gameState && gameState.topCard && !isMobile && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3">
          <h3 className="font-bold text-sm mb-1 text-center">
            Top of Deck (Public)
          </h3>
          <CardPreview
            card={gameState.topCard}
            width={120}
            height={80}
            borderColor="border-green-600"
          />
        </div>
      )}

      {/* Selected Card Preview - Enhanced */}
      {isPlacing && selectedCard && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 border-2 border-green-500">
          <div className="mb-2">
            <h3 className="font-bold text-sm text-green-600 text-center">
              Placing Card
            </h3>
          </div>
          <CardPreview
            card={selectedCard}
            width={180}
            height={120}
            rotation={cardRotation}
            borderColor="border-gray-800"
          />
          <div className="mt-3 space-y-2">
            <button
              onClick={onRotate}
              className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 w-full"
            >
              Rotate ({cardRotation}°)
            </button>
            <div className="text-xs text-gray-500 text-center">
              Click board to place • Click card to switch
            </div>
          </div>
        </div>
      )}

      {/* Exit Button */}
      <div
        className="absolute top-4 right-4"
        style={{ marginTop: isPlacing ? "200px" : "0" }}
      >
        <button
          onClick={onExit}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Exit Game
        </button>
      </div>
    </>
  );
}