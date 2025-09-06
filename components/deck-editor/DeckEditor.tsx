import React, { useEffect, useState } from "react";
import { useCustomDecksStore } from "../../stores/customDecksStore";
import { useDeckEditorStore } from "../../stores/deckEditorStore";
import DeckMetadataEditor from "./DeckMetadataEditor";
import ScoringConditionsPanel from "./ScoringConditionsPanel";
import CardGrid from "./CardGrid";
import CardBuilderModal from "../card-builder/CardBuilderModal";
import { DeckAnalytics } from "./DeckAnalytics";
import { RuleTestEnvironment } from "./RuleTestEnvironment";
import { MetadataEditor } from "./MetadataEditor";
import { RuleTestMachineProvider } from "../../providers/RuleTestMachineProvider";
import { CustomDeck } from "../../types/deck";
import { withBaseUrl } from "../../utils/baseUrl";

interface DeckEditorProps {
  deckId?: string;
}

type TabType = 'editor' | 'analytics' | 'testing' | 'metadata';

export default function DeckEditor({ deckId }: DeckEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('editor');
  
  const { getDeckById, addDeck, updateDeck } = useCustomDecksStore();
  const {
    currentDeck,
    hasUnsavedChanges,
    isCardBuilderOpen,
    setCurrentDeck,
    markUnsavedChanges,
    reset,
  } = useDeckEditorStore();

  // Load deck when deckId changes
  useEffect(() => {
    if (deckId) {
      const deck = getDeckById(deckId);
      if (deck) {
        // Ensure customScoringConditions exists
        if (!deck.customScoringConditions) {
          deck.customScoringConditions = [];
        }
        setCurrentDeck(deck);
      } else {
        // Deck not found, redirect or show error
        console.error(`Deck with id ${deckId} not found`);
        setCurrentDeck(null);
      }
    } else {
      // Creating new deck
      const newDeck: Omit<CustomDeck, "id"> = {
        name: "New Custom Deck",
        description: "A custom deck created with the visual editor",
        type: "custom",
        isCustom: true,
        baseCards: [],
        expansions: [],
        customScoringConditions: [],
        zoneTypes: [
          {
            id: "residential",
            name: "Residential",
            color: "#60a5fa",
            description: "Housing areas",
          },
          {
            id: "commercial",
            name: "Commercial",
            color: "#f59e0b",
            description: "Business districts",
          },
          {
            id: "industrial",
            name: "Industrial",
            color: "#6b7280",
            description: "Manufacturing zones",
          },
          {
            id: "park",
            name: "Park",
            color: "#34d399",
            description: "Green spaces",
          },
        ],
        theme: {
          primaryColor: "#8b5cf6",
          secondaryColor: "#7c3aed",
        },
        metadata: {
          author: "Player",
          created: new Date(),
          modified: new Date(),
          version: "1.0",
        },
      };

      // Create a temporary deck for editing
      const tempDeck: CustomDeck = {
        ...newDeck,
        id: "temp-new-deck",
      };

      setCurrentDeck(tempDeck);
    }

    // Cleanup on unmount
    return () => {
      reset();
    };
  }, [deckId, getDeckById, setCurrentDeck, reset]);

  const handleSaveDeck = () => {
    if (!currentDeck) return;

    if (deckId && deckId !== "temp-new-deck") {
      // Update existing deck
      updateDeck(deckId, {
        name: currentDeck.name,
        description: currentDeck.description,
        baseCards: currentDeck.baseCards,
        customScoringConditions: currentDeck.customScoringConditions,
        zoneTypes: currentDeck.zoneTypes,
        theme: currentDeck.theme,
        metadataSchema: currentDeck.metadataSchema,
      });

      // Update the current deck state with the saved version
      const savedDeck = getDeckById(deckId);
      if (savedDeck) {
        setCurrentDeck(savedDeck);
      }
    } else {
      // Add new deck
      const { id, ...deckData } = currentDeck;
      const newDeckId = addDeck(deckData);

      // Get the newly created deck and update the URL
      const createdDeck = getDeckById(newDeckId);

      if (createdDeck) {
        // Update the URL to reflect the new deck ID without page refresh
        const newUrl = withBaseUrl(`/deck-editor/${newDeckId}`);
        window.history.replaceState({}, "", newUrl);

        // Update the current deck state
        setCurrentDeck(createdDeck);
      }
    }

    // Clear the unsaved changes flag
    markUnsavedChanges(false);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = confirm(
        "You have unsaved changes. Are you sure you want to discard them?"
      );
      if (!confirmDiscard) return;
    }

    // Navigate back to game setup
    window.location.href = withBaseUrl("/");
  };

  if (!currentDeck) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-lg">Loading deck editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deck Editor</h1>
            <p className="text-gray-600 mt-1">
              Design and manage your custom deck
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCancel} className="btn btn-ghost">
              Cancel
            </button>
            <button
              onClick={handleSaveDeck}
              className={`btn ${
                hasUnsavedChanges ? "btn-primary" : "btn-success"
              }`}
              disabled={!hasUnsavedChanges}
            >
              {hasUnsavedChanges ? (
                <>
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save Changes
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Saved
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="tabs tabs-boxed bg-white shadow-sm border-b">
          <button 
            className={`tab tab-lg ${activeTab === 'editor' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            🛠️ Editor
          </button>
          <button 
            className={`tab tab-lg ${activeTab === 'metadata' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('metadata')}
          >
            🏷️ Metadata
          </button>
          <button 
            className={`tab tab-lg ${activeTab === 'analytics' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className={`tab tab-lg ${activeTab === 'testing' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('testing')}
          >
            🧪 Testing
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'editor' && (
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Panel - Deck Settings */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Deck Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <DeckMetadataEditor />
                  </div>
                </div>
              </div>

              {/* Main Content - Card Grid */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Cards in Deck ({currentDeck.baseCards.length})
                    </h2>
                    <button
                      onClick={() =>
                        useDeckEditorStore.getState().openCardBuilder()
                      }
                      className="btn btn-primary"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
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
                      Create Card
                    </button>
                  </div>
                  <div className="p-6">
                    <CardGrid />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Custom Scoring
                    </h2>
                  </div>
                  <div className="p-6">
                    <ScoringConditionsPanel />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'metadata' && <MetadataEditor />}
        {activeTab === 'analytics' && <DeckAnalytics />}
        {activeTab === 'testing' && (
            <RuleTestMachineProvider>
              <RuleTestEnvironment />
            </RuleTestMachineProvider>
          )}
      </div>

      {/* Card Builder Modal */}
      {isCardBuilderOpen && <CardBuilderModal />}
    </div>
  );
}
