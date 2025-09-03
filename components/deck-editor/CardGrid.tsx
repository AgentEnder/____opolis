import React from 'react';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import CardPreview from '../CardPreview';
import { CardDefinition } from '../../types/deck';

export default function CardGrid() {
  const {
    currentDeck,
    openCardBuilder,
    removeCardFromDeck,
    duplicateCardInDeck,
  } = useDeckEditorStore();

  if (!currentDeck) return null;

  const handleEditCard = (card: CardDefinition, index: number) => {
    openCardBuilder(card, index);
  };

  const handleDuplicateCard = (index: number) => {
    duplicateCardInDeck(index);
  };

  const handleDeleteCard = (index: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this card?');
    if (confirmDelete) {
      removeCardFromDeck(index);
    }
  };

  if (currentDeck.baseCards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No cards in deck</h3>
        <p className="text-gray-600 mb-6">Start building your deck by adding cards from the library or creating new ones.</p>
        <button
          onClick={() => openCardBuilder()}
          className="btn btn-primary"
        >
          Create Your First Card
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {currentDeck.baseCards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
          >
            {/* Card Preview */}
            <div className="flex justify-center mb-3">
              <CardPreview
                card={card}
                width={80}
                height={80}
                showBorder={true}
                borderColor="border-gray-300"
                className="group-hover:shadow-md transition-shadow"
                zoneTypes={currentDeck?.zoneTypes}
              />
            </div>

            {/* Card Info */}
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {card.name || `Card ${index + 1}`}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Count: {card.count}
              </p>
            </div>

            {/* Action Buttons - Show on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCard(card, index)}
                  className="btn btn-sm btn-primary"
                  title="Edit card"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => handleDuplicateCard(index)}
                  className="btn btn-sm btn-secondary"
                  title="Duplicate card"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => handleDeleteCard(index)}
                  className="btn btn-sm btn-error"
                  title="Delete card"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deck Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Deck Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-600">Total Cards:</span>
            <span className="ml-2 font-medium">{currentDeck.baseCards.length}</span>
          </div>
          <div>
            <span className="text-blue-600">Total Count:</span>
            <span className="ml-2 font-medium">
              {currentDeck.baseCards.reduce((sum, card) => sum + card.count, 0)}
            </span>
          </div>
          <div>
            <span className="text-blue-600">Unique Cards:</span>
            <span className="ml-2 font-medium">{currentDeck.baseCards.length}</span>
          </div>
          <div>
            <span className="text-blue-600">Theme:</span>
            <span className="ml-2 flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded border"
                style={{ backgroundColor: currentDeck.theme.primaryColor }}
              />
              <div 
                className="w-3 h-3 rounded border"
                style={{ backgroundColor: currentDeck.theme.secondaryColor }}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}