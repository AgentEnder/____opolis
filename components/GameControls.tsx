interface GameControlsProps {
  isMobile: boolean;
  controlsExpanded: boolean;
  setControlsExpanded: (expanded: boolean) => void;
}

export default function GameControls({ 
  isMobile, 
  controlsExpanded, 
  setControlsExpanded 
}: GameControlsProps) {
  if (isMobile) return null;

  return (
    <div
      className="absolute bottom-4 left-4 transition-all duration-300 ease-in-out z-10"
      onMouseEnter={() => setControlsExpanded(true)}
      onMouseLeave={() => setControlsExpanded(false)}
    >
      <div
        className={`
          bg-white/90 backdrop-blur-sm rounded-lg shadow-lg 
          transition-all duration-300 ease-in-out overflow-hidden
          ${
            controlsExpanded
              ? "w-auto h-auto p-3"
              : "w-10 h-10 p-0 flex items-center justify-center cursor-pointer hover:bg-white/95"
          }
        `}
      >
        {!controlsExpanded ? (
          <div className="text-gray-600 font-bold text-lg">?</div>
        ) : (
          <div className="text-xs animate-fadeIn">
            <div className="font-semibold mb-1">Controls:</div>
            <div className="space-y-0.5">
              <div>• Ctrl+Scroll: Zoom</div>
              <div>• Drag: Pan view</div>
              <div>• Click: Place card</div>
              <div>• R: Rotate card</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}