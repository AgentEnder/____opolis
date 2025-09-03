import React, { useState } from "react";
import { useDeckEditorStore } from "../../stores/deckEditorStore";
import { useScoringEditorStore } from "../../stores/scoringEditorStore";
import { ScoringEditorModal } from "../scoring-editor/ScoringEditorModal";
import type { CustomScoringCondition } from "../../types/scoring-formulas";
import type { CardDefinition } from "../../types/deck";

export default function ScoringConditionsPanel() {
  const {
    currentDeck,
    addScoringCondition,
    updateScoringCondition,
    removeScoringCondition,
    updateCardInDeck,
  } = useDeckEditorStore();

  const [assigningConditionId, setAssigningConditionId] = useState<
    string | null
  >(null);

  const { openEditor, isOpen } = useScoringEditorStore();

  const handleCreateCondition = () => {
    openEditor();
  };

  const handleEditCondition = (condition: CustomScoringCondition) => {
    openEditor(condition);
  };

  const handleSaveCondition = (condition: CustomScoringCondition) => {
    const existingConditions = currentDeck?.customScoringConditions || [];
    if (existingConditions.some((c) => c.id === condition.id)) {
      // Update existing condition
      updateScoringCondition(condition.id, condition);
    } else {
      // Add new condition
      addScoringCondition(condition);
    }
  };

  const handleDeleteCondition = (conditionId: string) => {
    const condition = currentDeck?.customScoringConditions.find(
      (c) => c.id === conditionId
    );
    if (!condition) return;

    const confirmDelete = confirm(
      `Delete scoring condition "${condition.name}"? This will remove it from any cards that use it.`
    );

    if (confirmDelete) {
      removeScoringCondition(conditionId);
    }
  };

  const conditions = currentDeck?.customScoringConditions || [];

  // Check for unused non-global conditions
  const getUnusedConditions = () => {
    return conditions.filter(
      (condition) =>
        !condition.isGlobal &&
        currentDeck?.baseCards.filter(
          (card) => card.scoringConditionId === condition.id
        ).length === 0
    );
  };

  const unusedConditions = getUnusedConditions();

  // Get cards without scoring conditions
  const getCardsWithoutScoring = (): (CardDefinition & { index: number })[] => {
    if (!currentDeck) return [];
    return currentDeck.baseCards
      .map((card, index) => ({ ...card, index }))
      .filter((card) => !card.scoringConditionId);
  };

  const handleAssignToCard = (cardIndex: number, conditionId: string) => {
    if (!currentDeck) return;

    const card = currentDeck.baseCards[cardIndex];
    if (!card) return;

    const updatedCard = {
      ...card,
      scoringConditionId: conditionId,
    };

    updateCardInDeck(cardIndex, updatedCard);
    setAssigningConditionId(null);
  };

  const handleToggleGlobal = (conditionId: string, isGlobal: boolean) => {
    updateScoringCondition(conditionId, { isGlobal });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Scoring Conditions
          </h3>
          {unusedConditions.length > 0 && (
            <div className="flex items-center gap-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                {unusedConditions.length} unused rule
                {unusedConditions.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleCreateCondition}
          className="btn btn-sm btn-primary"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create Formula
        </button>
      </div>

      {unusedConditions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">
                Unused scoring conditions detected
              </p>
              <p>
                You have {unusedConditions.length} non-global scoring rule
                {unusedConditions.length !== 1 ? "s" : ""} that{" "}
                {unusedConditions.length === 1 ? "is" : "are"} not assigned to
                any cards. These rules will never be active during gameplay.
                Either assign them to cards or make them global rules.
              </p>
            </div>
          </div>
        </div>
      )}

      {conditions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600 mb-2">No custom scoring conditions</p>
          <p className="text-sm text-gray-500 mb-4">
            Create TypeScript scoring formulas to customize your deck's gameplay
          </p>
          <button onClick={handleCreateCondition} className="btn btn-primary">
            Create Your First Formula
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {conditions.map((condition) => {
            const usedByCards =
              currentDeck?.baseCards.filter(
                (card) => card.scoringConditionId === condition.id
              ).length || 0;
            const availableCards = getCardsWithoutScoring();
            const isAssigning = assigningConditionId === condition.id;
            const isUnused = !condition.isGlobal && usedByCards === 0;

            return (
              <div
                key={condition.id}
                className={`bg-white rounded-lg p-4 ${
                  isUnused
                    ? "border-2 border-amber-300 bg-amber-50"
                    : "border border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">
                        {condition.name}
                      </h4>
                      {condition.isGlobal && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Global
                        </span>
                      )}
                      {isUnused && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Unused
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {condition.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        TypeScript
                      </span>
                      <span className="text-xs text-gray-500">
                        Target: {condition.targetContribution} pts
                      </span>
                      <span className="text-xs text-gray-500">
                        Updated {condition.updatedAt?.toLocaleDateString?.()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleEditCondition(condition)}
                      className="btn btn-ghost btn-sm"
                      title="Edit"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCondition(condition.id)}
                      className="btn btn-ghost btn-sm text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Global checkbox and card assignment */}
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                  {/* Global Rule Toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`global-${condition.id}`}
                      className="checkbox checkbox-sm"
                      checked={condition.isGlobal || false}
                      onChange={(e) =>
                        handleToggleGlobal(condition.id, e.target.checked)
                      }
                    />
                    <label
                      htmlFor={`global-${condition.id}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Global rule (applies to all games, not tied to specific
                      cards)
                    </label>
                  </div>

                  {/* Card Assignment - only show if not global */}
                  {!condition.isGlobal && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Used by {usedByCards} card(s)
                        </p>
                        {availableCards.length > 0 && (
                          <button
                            onClick={() =>
                              setAssigningConditionId(
                                isAssigning ? null : condition.id
                              )
                            }
                            className="btn btn-xs btn-outline"
                          >
                            {isAssigning ? "Cancel" : "Assign to Card"}
                          </button>
                        )}
                      </div>

                      {/* Card Assignment Dropdown */}
                      {isAssigning && availableCards.length > 0 && (
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-xs text-gray-600 mb-2">
                            Select a card to assign this condition:
                          </p>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {availableCards.map((card) => (
                              <button
                                key={card.index}
                                onClick={() =>
                                  handleAssignToCard(card.index, condition.id)
                                }
                                className="w-full text-left px-2 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-100 flex items-center justify-between"
                              >
                                <span>
                                  {card.name || `Card ${card.index + 1}`}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {card.count} copies
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {availableCards.length === 0 &&
                        usedByCards === 0 &&
                        !condition.isGlobal && (
                          <p className="text-xs text-amber-600">
                            No cards available for assignment. All cards already
                            have scoring conditions.
                          </p>
                        )}
                    </div>
                  )}

                  {condition.isGlobal && (
                    <p className="text-xs text-purple-600">
                      This global rule will be available in all games using this
                      deck.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scoring Editor Modal */}
      {isOpen && (
        <ScoringEditorModal
          onSave={handleSaveCondition}
          onCancel={() => {
            /* Modal handles its own state */
          }}
        />
      )}
    </div>
  );
}
