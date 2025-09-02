import { useState } from 'react';
import GameCanvas from '../../components/GameCanvas';
import { GameMachineProvider } from '../../providers/GameMachineProvider';

export default Page;

function Page() {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <GameMachineProvider>
        <GameCanvas onExit={() => setIsPlaying(false)} />
      </GameMachineProvider>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Play Opolis</h1>
      
      <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Ready to Build Your City?</h2>
        
        <div className="mb-6 text-gray-600">
          <p className="mb-2">Build your city by placing cards on a grid. Each card has 4 cells with different zone types:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>🟦 Residential zones</li>
            <li>🟧 Commercial zones</li>
            <li>⬜ Industrial zones</li>
            <li>🟩 Parks</li>
            <li>⬛ Roads</li>
          </ul>
        </div>

        <div className="mb-6 text-gray-600">
          <h3 className="font-semibold mb-2">Placement Rules:</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Cards must touch edge-to-edge or overlap</li>
            <li>Cards cannot meet only at corners</li>
            <li>New cards can overlap existing ones</li>
            <li>Cards cannot be tucked under existing cards</li>
          </ul>
        </div>

        <button
          onClick={() => setIsPlaying(true)}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 text-lg font-semibold"
        >
          Start Game
        </button>
      </div>
    </>
  );
}