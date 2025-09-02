import { GameState } from "../types/game";

interface PlayersListProps {
  gameState: GameState;
  isMobile: boolean;
}

export default function PlayersList({ gameState, isMobile }: PlayersListProps) {
  if (isMobile) return null;

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
      <h3 className="font-bold text-sm mb-2">Players</h3>
      <div className="space-y-1">
        {gameState.players.map((player, idx) => (
          <div
            key={player.id}
            className={`text-sm p-1 rounded ${
              idx === gameState.currentPlayerIndex
                ? "bg-blue-100 font-semibold"
                : ""
            }`}
          >
            <span>{player.name}</span>
            <span className="ml-2 text-gray-500">
              ({player.hand.length} cards)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}