import { Card, GameState } from "../types/game";
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
  return (
    <>
      {/* Game Stats Panel - Top Left */}
      {gameState && !isMobile && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 min-w-48">
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