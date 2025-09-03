import React, { useState } from "react";
import { useCustomDecksStore } from "../../stores/customDecksStore";
import { useUIStore } from "../../stores/uiStore";
import { CustomDeck, CardDefinition } from "../../types/deck";

interface DeckImportExportProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeckImportExport({
  isOpen,
  onClose,
}: DeckImportExportProps) {
  const { customDecks, exportDeck, importDeck, addDeck } =
    useCustomDecksStore();
  const { showNotificationMessage } = useUIStore();
  const [activeTab, setActiveTab] = useState<"import" | "export" | "create">(
    "create"
  );
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Create deck form state
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckAuthor, setDeckAuthor] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleImport = async () => {
    if (!importText.trim()) {
      showNotificationMessage("Please paste deck JSON to import", "error");
      return;
    }

    setIsImporting(true);
    try {
      await importDeck(importText);
      showNotificationMessage("Deck imported successfully!", "success");
      setImportText("");
      onClose();
    } catch (error) {
      showNotificationMessage(`Import failed: ${error}`, "error");
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = (deckId: string) => {
    try {
      const jsonString = exportDeck(deckId);

      // Download as file
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const deck = customDecks.find((d) => d.id === deckId);
      link.href = url;
      link.download = `${deck?.name || "custom-deck"}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotificationMessage("Deck exported successfully!", "success");
    } catch (error) {
      showNotificationMessage(`Export failed: ${error}`, "error");
    }
  };

  const handleCreateBasicDeck = async () => {
    if (!deckName.trim()) {
      showNotificationMessage("Deck name is required", "error");
      return;
    }

    setIsCreating(true);
    try {
      // Create a basic deck with simple cards
      const basicCards: CardDefinition[] = [
        {
          id: "basic-001",
          name: "Mixed Block 1",
          count: 3,
          cells: [
            [
              { type: "residential", roads: [] },
              { type: "commercial", roads: [] },
            ],
            [
              { type: "park", roads: [] },
              { type: "industrial", roads: [] },
            ],
          ],
        },
        {
          id: "basic-002",
          name: "Residential Area",
          count: 2,
          cells: [
            [
              { type: "residential", roads: [] },
              { type: "residential", roads: [] },
            ],
            [
              { type: "residential", roads: [] },
              { type: "park", roads: [] },
            ],
          ],
        },
        {
          id: "basic-003",
          name: "Commercial Strip",
          count: 2,
          cells: [
            [
              { type: "commercial", roads: [[3, 1]] },
              { type: "commercial", roads: [[3, 1]] },
            ],
            [
              { type: "park", roads: [] },
              { type: "park", roads: [] },
            ],
          ],
        },
        {
          id: "basic-004",
          name: "Industrial Zone",
          count: 2,
          cells: [
            [
              { type: "industrial", roads: [] },
              { type: "industrial", roads: [] },
            ],
            [
              { type: "industrial", roads: [] },
              { type: "park", roads: [] },
            ],
          ],
        },
      ];

      const newDeck: Omit<CustomDeck, "id"> = {
        name: deckName.trim(),
        description:
          deckDescription.trim() || "Custom deck created with basic cards",
        type: "custom",
        isCustom: true,
        baseCards: basicCards,
        expansions: [],
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
          author: deckAuthor.trim() || "Anonymous",
          created: new Date(),
          modified: new Date(),
          version: "1.0",
        },
        customScoringConditions: [],
      };

      addDeck(newDeck);
      showNotificationMessage(`Created deck "${deckName}"!`, "success");

      // Reset form
      setDeckName("");
      setDeckDescription("");
      setDeckAuthor("");
      onClose();
    } catch (error) {
      showNotificationMessage(`Failed to create deck: ${error}`, "error");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Deck Management</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* DaisyUI Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button
            onClick={() => setActiveTab("create")}
            className={`tab ${activeTab === "create" ? "tab-active" : ""}`}
          >
            Create Basic Deck
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`tab ${activeTab === "import" ? "tab-active" : ""}`}
          >
            Import Deck
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`tab ${activeTab === "export" ? "tab-active" : ""}`}
          >
            Export Decks
          </button>
        </div>

        {/* Create Tab */}
        {activeTab === "create" && (
          <div className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Deck Name *</span>
              </label>
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter deck name"
                maxLength={50}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
                placeholder="Brief description of your deck"
                rows={3}
                maxLength={200}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Author</span>
              </label>
              <input
                type="text"
                value={deckAuthor}
                onChange={(e) => setDeckAuthor(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Your name (optional)"
                maxLength={30}
              />
            </div>

            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <h4 className="font-medium mb-2">Basic Deck Contents</h4>
                <p className="text-sm">
                  This will create a deck with 9 basic cards including mixed
                  development, residential areas, commercial strips, and
                  industrial zones. Perfect for getting started!
                </p>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={handleCreateBasicDeck}
                disabled={isCreating || !deckName.trim()}
                className={`btn btn-primary ${isCreating ? "loading" : ""}`}
              >
                {isCreating ? "Creating..." : "Create Basic Deck"}
              </button>
              <button onClick={onClose} className="btn">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === "import" && (
          <div className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Paste Deck JSON</span>
              </label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="textarea textarea-bordered w-full h-64 font-mono text-sm"
                placeholder="Paste the exported deck JSON here..."
              />
            </div>

            <div className="modal-action">
              <button
                onClick={handleImport}
                disabled={isImporting || !importText.trim()}
                className={`btn btn-success ${isImporting ? "loading" : ""}`}
              >
                {isImporting ? "Importing..." : "Import Deck"}
              </button>
              <button
                onClick={() => setImportText("")}
                className="btn btn-outline"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === "export" && (
          <div className="space-y-4">
            {customDecks.length === 0 ? (
              <div className="text-center py-8 text-base-content/60">
                <p className="mb-4">No custom decks to export</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="btn btn-link"
                >
                  Create your first deck →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-medium">Select a deck to export:</h4>
                {customDecks.map((deck) => (
                  <div
                    key={deck.id}
                    className="card bg-base-200 hover:bg-base-300 transition-colors"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="card-title text-base">{deck.name}</h5>
                          <p className="text-sm text-base-content/70">
                            {deck.description}
                          </p>
                          <p className="text-xs text-base-content/60">
                            {deck.baseCards.reduce(
                              (sum, card) => sum + card.count,
                              0
                            )}{" "}
                            cards • By {deck.metadata.author}
                          </p>
                        </div>
                        <button
                          onClick={() => handleExport(deck.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
