import CardPreview from "./CardPreview";
import { useSharedGameMachine } from "../providers/GameMachineProvider";
import { useUIStore } from "../stores/uiStore";
import { Card } from "../types/game";

export default function PlayerHand() {
  const { actions, selectors } = useSharedGameMachine();
  const { isMobile, isPlacing } = useUIStore();

  const {
    gameState,
    selectedCard,
    cardRotation,
    currentPlayer,
    isCardSelected,
  } = selectors;

  if (!gameState || !currentPlayer) return null;

  return (
    <div
      className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 ${
        isMobile ? "bottom-2" : "bottom-4"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="text-center mb-2">
          <div className="font-semibold text-sm text-gray-800">
            {currentPlayer.name}'s Turn
          </div>
          <div className="text-xs text-gray-500">
            {currentPlayer.hand.length} cards
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {currentPlayer.hand.map((card: Card) => (
            <div key={card.id} className="relative">
              <button
                onClick={() => actions.selectCard(card)}
                className={`hover:scale-105 transition-transform`}
              >
                <CardPreview
                  card={card}
                  width={isMobile ? 60 : 80}
                  height={isMobile ? 40 : 53}
                  borderColor={
                    selectedCard?.id === card.id
                      ? "border-green-500"
                      : "border-gray-400 hover:border-blue-400"
                  }
                  className={
                    selectedCard?.id === card.id ? "shadow-lg" : ""
                  }
                />
              </button>
              {selectedCard?.id === card.id && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {isPlacing && isMobile && (
          <div className="mt-2">
            <button
              onClick={() => actions.rotateCard()}
              className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 w-full"
            >
              Rotate ({cardRotation}°)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}