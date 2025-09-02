import { useSharedGameMachine } from '../providers/GameMachineProvider';

export default function DebugInfo() {
  const { selectors, state } = useSharedGameMachine();
  
  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-3 rounded text-xs font-mono max-w-md">
      <div><strong>State:</strong> {JSON.stringify(state.value)}</div>
      <div><strong>Selected Variations:</strong> {selectors.selectedVariations.length}</div>
      <div><strong>Player Count:</strong> {selectors.playerCount}</div>
      <div><strong>Can Start:</strong> {selectors.canStartGame.toString()}</div>
      <div><strong>Error:</strong> {selectors.error || 'none'}</div>
    </div>
  );
}