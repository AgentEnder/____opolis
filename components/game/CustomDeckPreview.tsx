import React from 'react';
import { CustomDeck } from '../../types/deck';
import CardPreview from '../CardPreview';

interface CustomDeckPreviewProps {
  deck: CustomDeck;
  isOpen: boolean;
  onClose: () => void;
  onAddToGame: () => void;
}

export default function CustomDeckPreview({ 
  deck, 
  isOpen, 
  onClose, 
  onAddToGame 
}: CustomDeckPreviewProps) {
  if (!isOpen) return null;

  // Calculate deck statistics
  const totalCards = deck.baseCards.reduce((sum, card) => sum + card.count, 0);
  const zoneTypes = deck.zoneTypes || [];
  const scoringConditions = deck.customScoringConditions || [];
  
  // Calculate average game length estimate (rough approximation)
  const estimatedTurns = Math.round(totalCards * 0.7); // Assume 70% of cards get played
  const estimatedMinutes = Math.round(estimatedTurns * 1.5); // 1.5 minutes per turn average

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div 
          className="p-4 text-white"
          style={{ backgroundColor: deck.theme.primaryColor }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{deck.name}</h2>
              <p className="text-sm opacity-90 mt-1">
                Created by: {deck.metadata?.author || 'Unknown'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Description */}
          {deck.description && (
            <div className="mb-6">
              <p className="text-gray-700">{deck.description}</p>
            </div>
          )}

          {/* Preview Cards */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Preview Cards</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {deck.baseCards.slice(0, 5).map((cardData, index) => (
                <div key={index} className="flex-shrink-0">
                  <CardPreview
                    card={{
                      id: `preview-${index}`,
                      name: cardData.name,
                      cells: cardData.cells,
                      x: 0,
                      y: 0,
                      rotation: 0
                    }}
                    width={80}
                    height={80}
                    borderColor="border-gray-300"
                  />
                </div>
              ))}
              {deck.baseCards.length > 5 && (
                <div className="flex-shrink-0 w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 text-sm">
                  +{totalCards - 5} more
                </div>
              )}
            </div>
          </div>

          {/* Deck Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold mb-2">Deck Statistics</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cards:</span>
                  <span className="font-semibold">{totalCards}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zone Types:</span>
                  <span className="font-semibold">{zoneTypes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Custom Rules:</span>
                  <span className="font-semibold">{scoringConditions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Game Time:</span>
                  <span className="font-semibold">{estimatedMinutes} min</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <h3 className="font-semibold mb-2">Zone Types</h3>
              <div className="space-y-1">
                {zoneTypes.slice(0, 4).map((zone) => (
                  <div key={zone.id} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: zone.color }}
                    />
                    <span className="text-sm">{zone.name}</span>
                  </div>
                ))}
                {zoneTypes.length > 4 && (
                  <span className="text-sm text-gray-500">
                    +{zoneTypes.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Custom Scoring Preview */}
          {scoringConditions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Custom Scoring Rules</h3>
              <div className="space-y-2">
                {scoringConditions.map((condition) => (
                  <div 
                    key={condition.id}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex items-start gap-2">
                      <div 
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: deck.theme.primaryColor }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{condition.name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {condition.description}
                        </div>
                        {(condition.targetContribution || 0) > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            Target: +{condition.targetContribution || 0} points
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Rating (placeholder for future feature) */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Community Rating</span>
                  <div className="flex text-yellow-400">
                    {'★★★★☆'}
                  </div>
                  <span className="text-sm text-gray-600">(4.2/5)</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Based on 47 plays
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-4 flex gap-3">
          <button
            onClick={onAddToGame}
            className="flex-1 text-white py-2 px-4 rounded-lg font-semibold hover:opacity-90"
            style={{ backgroundColor: deck.theme.primaryColor }}
          >
            Add to Game
          </button>
          <button
            onClick={() => window.location.href = `/deck-editor?deckId=${deck.id}`}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300"
          >
            View Full Deck
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}