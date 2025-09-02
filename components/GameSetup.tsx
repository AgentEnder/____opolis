import React from 'react';
import { GAME_VARIATIONS, GameVariation } from '../types/deck';
import { useSharedGameMachine } from '../providers/GameMachineProvider';
import { useUIStore } from '../stores/uiStore';

interface GameSetupProps {
  onExit: () => void;
}

export default function GameSetup({ onExit }: GameSetupProps) {
  const { actions, selectors } = useSharedGameMachine();
  const { showNotificationMessage } = useUIStore();

  const {
    selectedVariations,
    selectedExpansions, 
    playerCount,
    canStartGame,
    error
  } = selectors;


  // Get all available expansions from selected variations
  const availableExpansions = selectedVariations.flatMap(v => v.expansions);

  const toggleVariation = (variation: GameVariation) => {
    const isSelected = selectedVariations.some(v => v.id === variation.id);
    const newVariations = isSelected
      ? selectedVariations.filter(v => v.id !== variation.id)
      : [...selectedVariations, variation];
    
    actions.setVariations(newVariations);
    
    // Clear expansions that are no longer available
    const availableExpansionIds = newVariations.flatMap(v => v.expansions.map(e => e.id));
    const validExpansions = selectedExpansions.filter(id => availableExpansionIds.includes(id));
    if (validExpansions.length !== selectedExpansions.length) {
      actions.setExpansions(validExpansions);
    }
  };

  const toggleExpansion = (expansionId: string) => {
    const newExpansions = selectedExpansions.includes(expansionId)
      ? selectedExpansions.filter(id => id !== expansionId)
      : [...selectedExpansions, expansionId];
    
    actions.setExpansions(newExpansions);
  };

  const handleStartGame = () => {
    if (!canStartGame) {
      showNotificationMessage('Please select at least one city variation', 'error');
      return;
    }
    actions.startGame();
  };

  // Show error notifications
  React.useEffect(() => {
    if (error) {
      showNotificationMessage(error, 'error');
      actions.clearError();
    }
  }, [error, showNotificationMessage, actions]);
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Setup *opolis Game</h2>
        
        {/* Game Variation Selection */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3">Choose Your Cities (Select Multiple)</label>
          <div className="grid gap-4">
            {GAME_VARIATIONS.map((variation) => {
              const isSelected = selectedVariations.some(v => v.id === variation.id);
              return (
                <button
                  key={variation.id}
                  onClick={() => toggleVariation(variation)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by button onClick
                        className="mr-2"
                        style={{ pointerEvents: 'none' }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: variation.theme.primaryColor }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{variation.name}</h3>
                      <p className="text-gray-600 text-sm">{variation.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {variation.baseCards.reduce((sum, card) => sum + card.count, 0)} base cards
                        {variation.expansions.length > 0 && ` • ${variation.expansions.length} expansions available`}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Expansion Selection */}
        {availableExpansions.length > 0 && (
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3">Expansions (Optional)</label>
            <div className="space-y-2">
              {availableExpansions.map((expansion) => {
                const parentVariation = selectedVariations.find(v => 
                  v.expansions.some(e => e.id === expansion.id)
                );
                return (
                  <label
                    key={expansion.id}
                    className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedExpansions.includes(expansion.id)}
                      onChange={() => toggleExpansion(expansion.id)}
                      className="mt-1"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{expansion.name}</h4>
                        {parentVariation && (
                          <span 
                            className="text-xs px-2 py-1 rounded text-white"
                            style={{ backgroundColor: parentVariation.theme.primaryColor }}
                          >
                            {parentVariation.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{expansion.description}</p>
                      <p className="text-xs text-gray-500">
                        +{expansion.cards.reduce((sum, card) => sum + card.count, 0)} cards
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Game Settings */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3">Players</label>
          <select 
            value={playerCount} 
            onChange={(e) => actions.setPlayerCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-lg"
          >
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
          </select>
        </div>
        
        {/* Deck Summary */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Deck Summary</h4>
          <div className="mb-2">
            {selectedVariations.map((variation, index) => (
              <span key={variation.id}>
                <strong style={{ color: variation.theme.primaryColor }}>{variation.name}</strong>
                {index < selectedVariations.length - 1 && ' + '}
              </span>
            ))}
            <span className="text-sm text-gray-600 ml-2">with {selectedExpansions.length} expansion(s)</span>
          </div>
          <p className="text-sm text-gray-600">
            Total cards: {selectedVariations.reduce((total, variation) => 
              total + variation.baseCards.reduce((sum, card) => sum + card.count, 0), 0
            ) + selectedExpansions.reduce((sum, expId) => {
              const exp = availableExpansions.find(e => e.id === expId);
              return sum + (exp?.cards.reduce((s, card) => s + card.count, 0) || 0);
            }, 0)}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleStartGame}
            disabled={!canStartGame}
            className={`flex-1 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-opacity ${
              canStartGame ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ 
              background: selectedVariations.length === 1 
                ? selectedVariations[0].theme.primaryColor
                : selectedVariations.length > 1 
                  ? `linear-gradient(45deg, ${selectedVariations.map(v => v.theme.primaryColor).join(', ')})` 
                  : '#9ca3af'
            }}
          >
            Start {selectedVariations.length === 1 
              ? selectedVariations[0].name 
              : `${selectedVariations.length} Cities`}
          </button>
          <button
            onClick={onExit}
            className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 text-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}