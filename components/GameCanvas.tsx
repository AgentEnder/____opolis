import { useEffect, useRef } from "react";
import { useSharedGameMachine } from "../providers/GameMachineProvider";
import { useUIStore } from "../stores/uiStore";
import GameSetup from "./GameSetup";
import GameBoard from "./GameBoard";
import GameInfo from "./GameInfo";
import PlayersList from "./PlayersList";
import GameControls from "./GameControls";
import PlayerHand from "./PlayerHand";

interface GameCanvasProps {
  onExit: () => void;
}

export default function GameCanvas({ onExit }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State management hooks
  const { selectors, actions } = useSharedGameMachine();
  const { 
    isMobile,
    setMobile,
    controlsExpanded,
    setControlsExpanded,
  } = useUIStore();
  
  // Destructure game state from selectors
  const {
    isSetup,
    isPlacing,
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
        />
      )}

      {/* Game UI Components */}
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
    </div>
  );
}