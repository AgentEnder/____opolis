import { useEffect, useRef, useState } from "react";
import { useSharedGameMachine } from "../providers/GameMachineProvider";
import { useUIStore } from "../stores/uiStore";
import GameSetup from "./GameSetup";
import GameBoard from "./GameBoard";
import GameInfo from "./GameInfo";
import PlayersList from "./PlayersList";
import GameControls from "./GameControls";
import PlayerHand from "./PlayerHand";
import GameOverDialog from "./GameOverDialog";

interface GameCanvasProps {
  onExit: () => void;
}

export default function GameCanvas({ onExit }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewingMap, setViewingMap] = useState(false);
  
  // State management hooks
  const machineContext = useSharedGameMachine();
  const { selectors, actions } = machineContext;
  const { 
    isMobile,
    setMobile,
    controlsExpanded,
    setControlsExpanded,
  } = useUIStore();
  
  // Destructure game state from selectors
  const {
    isSetup,
    isPlaying,
    isPlacing,
    isGameOver,
    gameState,
    selectedCard,
    cardRotation,
  } = selectors;

  // Mobile detection effect
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Update mobile state
        setMobile(window.innerWidth < 768);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobile]);

  // Show setup screen if in setup state
  if (isSetup) {
    return <GameSetup onExit={onExit} />;
  }

  return (
    <div className="fixed inset-0 bg-gray-900">
      {/* Game Board with Placement Grid */}
      {gameState && (
        <GameBoard 
          gameState={gameState}
          onCardPlace={(x, y) => {
            console.log('GameCanvas: placing card at', x, y);
            actions.placeCard(x, y);
          }}
          machine={machineContext}
        />
      )}

      {/* Game UI Components - hide when viewing map in game over */}
      {!viewingMap && (
        <>
          <GameInfo
            gameState={gameState}
            isMobile={isMobile}
            isPlacing={isPlacing}
            selectedCard={selectedCard}
            cardRotation={cardRotation}
            onRotate={actions.rotateCard}
            onExit={onExit}
          />

          {gameState && (
            <PlayersList gameState={gameState} isMobile={isMobile} />
          )}

          <GameControls
            isMobile={isMobile}
            controlsExpanded={controlsExpanded}
            setControlsExpanded={setControlsExpanded}
          />

          <PlayerHand />
        </>
      )}

      {/* Game Over Dialog */}
      {isGameOver && gameState && !viewingMap && (
        <GameOverDialog
          gameState={gameState}
          onViewMap={() => setViewingMap(true)}
          onNewGame={() => {
            setViewingMap(false);
            actions.restartGame();
          }}
        />
      )}

      {/* Map View Mode - show just the board and a back button */}
      {viewingMap && isGameOver && gameState && (
        <>
          <GameInfo
            gameState={gameState}
            isMobile={isMobile}
            isPlacing={false}
            selectedCard={null}
            cardRotation={0}
            onRotate={() => {}}
            onExit={() => setViewingMap(false)}
          />
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setViewingMap(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold"
            >
              Back to Results
            </button>
          </div>
        </>
      )}
    </div>
  );
}