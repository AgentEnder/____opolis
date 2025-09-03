import React from 'react';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import CardCanvas from './CardCanvas';
import CardPreview from '../CardPreview';
import { CardDefinition } from '../../types/deck';

export default function CardBuilderModal() {
  const {
    isCardBuilderOpen,
    editingCard,
    editingCardIndex,
    currentDeck,
    setEditingCard,
    closeCardBuilder,
    addCardToDeck,
    updateCardInDeck,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useDeckEditorStore();


  if (!isCardBuilderOpen || !editingCard) return null;

  const handleSaveCard = () => {
    if (!editingCard) return;

    const cardToSave: CardDefinition = {
      ...editingCard,
      name: editingCard.name || `Custom Card`,
      count: editingCard.count || 1,
    };

    if (editingCardIndex !== null) {
      // Update existing card
      updateCardInDeck(editingCardIndex, cardToSave);
    } else {
      // Add new card
      addCardToDeck(cardToSave);
    }

    closeCardBuilder();
  };

  const handleCancel = () => {
    const hasChanges = undoStack.length > 0;
    if (hasChanges) {
      const confirmDiscard = confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmDiscard) return;
    }
    closeCardBuilder();
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      name: e.target.value,
    });
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCard) return;
    const count = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
    setEditingCard({
      ...editingCard,
      count,
    });
  };

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const handleScoringConditionChange = (conditionId: string) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      scoringConditionId: conditionId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingCardIndex !== null ? 'Edit Card' : 'Create Card'}
            </h2>
            
            {/* Undo/Redo */}
            <div className="flex gap-1">
              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="btn btn-sm btn-ghost"
                title="Undo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="btn btn-sm btn-ghost"
                title="Redo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCard}
              className="btn btn-primary"
            >
              Save Card
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* Left Panel - Card Canvas */}
          <div className="p-6 border-r border-gray-200 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Card Editor</h3>
            <CardCanvas />
          </div>

          {/* Right Panel - Card Settings */}
          <div className="p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-6">Card Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editingCard.name || ''}
                  onChange={handleCardNameChange}
                  placeholder="Enter card name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Count in Deck
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="input input-bordered w-full"
                  value={editingCard.count || 1}
                  onChange={handleCountChange}
                />
              </div>

              {/* Scoring Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scoring Condition
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editingCard.scoringConditionId || ''}
                  onChange={(e) => handleScoringConditionChange(e.target.value)}
                >
                  <option value="">No scoring condition</option>
                  {currentDeck?.customScoringConditions?.map((condition) => (
                    <option key={condition.id} value={condition.id}>
                      {condition.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  Scoring conditions are managed at the deck level. 
                  {currentDeck?.customScoringConditions?.length === 0 && (
                    <span className="text-yellow-600"> No conditions available - create them in the deck editor.</span>
                  )}
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
              <div className="flex justify-center">
                <CardPreview
                  card={editingCard}
                  width={120}
                  height={120}
                  showBorder={true}
                  borderColor="border-gray-300"
                  className="shadow-sm"
                  zoneTypes={currentDeck?.zoneTypes}
                />
              </div>
            </div>

            {/* Card Validation */}
            <div className="mt-6 bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Card Status</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700">All zones defined</span>
                </div>
                
                {editingCard.cells.some(row => 
                  row.some(cell => cell.roads && cell.roads.length > 0)
                ) ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700">Roads present</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-700">No roads yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}