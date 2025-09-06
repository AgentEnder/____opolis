import React, { useState } from 'react';
import { useCustomDecksStore } from '../../stores/customDecksStore';
import { useUIStore } from '../../stores/uiStore';
import { CustomDeck } from '../../types/deck';
import { validateCustomDeck, getCardDistributionSummary } from '../../utils/deckValidation';

export default function DeckManagementPage() {
  const { customDecks, deleteDeck, duplicateDeck, exportDeck, importDeck, addDeck } = useCustomDecksStore();
  const { showNotificationMessage } = useUIStore();
  
  // Import state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  // Create deck state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [deckAuthor, setDeckAuthor] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleExport = (deck: CustomDeck) => {
    try {
      const jsonString = exportDeck(deck.id);
      
      // Download as file
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${deck.name}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotificationMessage('Deck exported successfully!', 'success');
    } catch (error) {
      showNotificationMessage(`Export failed: ${error}`, 'error');
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      showNotificationMessage('Please paste deck JSON to import', 'error');
      return;
    }

    setIsImporting(true);
    try {
      await importDeck(importText);
      showNotificationMessage('Deck imported successfully!', 'success');
      setImportText('');
      setShowImportModal(false);
    } catch (error) {
      showNotificationMessage(`Import failed: ${error}`, 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateBasicDeck = async () => {
    if (!deckName.trim()) {
      showNotificationMessage('Deck name is required', 'error');
      return;
    }

    setIsCreating(true);
    try {
      const newDeck: Omit<CustomDeck, 'id'> = {
        name: deckName.trim(),
        description: deckDescription.trim() || 'Custom deck created with basic cards',
        type: 'custom',
        isCustom: true,
        baseCards: [
          {
            id: 'basic-001',
            name: 'Mixed Block 1',
            count: 3,
            cells: [
              [
                { type: 'residential', roads: [] },
                { type: 'commercial', roads: [] },
              ],
              [
                { type: 'park', roads: [] },
                { type: 'industrial', roads: [] },
              ],
            ],
          },
          {
            id: 'basic-002',
            name: 'Residential Area',
            count: 2,
            cells: [
              [
                { type: 'residential', roads: [] },
                { type: 'residential', roads: [] },
              ],
              [
                { type: 'residential', roads: [] },
                { type: 'park', roads: [] },
              ],
            ],
          },
          {
            id: 'basic-003',
            name: 'Commercial Strip',
            count: 2,
            cells: [
              [
                { type: 'commercial', roads: [[3, 1]] },
                { type: 'commercial', roads: [[3, 1]] },
              ],
              [
                { type: 'park', roads: [] },
                { type: 'park', roads: [] },
              ],
            ],
          },
          {
            id: 'basic-004',
            name: 'Industrial Zone',
            count: 2,
            cells: [
              [
                { type: 'industrial', roads: [] },
                { type: 'industrial', roads: [] },
              ],
              [
                { type: 'industrial', roads: [] },
                { type: 'park', roads: [] },
              ],
            ],
          },
        ],
        expansions: [],
        zoneTypes: [
          {
            id: 'residential',
            name: 'Residential',
            color: '#60a5fa',
            description: 'Housing areas',
          },
          {
            id: 'commercial',
            name: 'Commercial',
            color: '#f59e0b',
            description: 'Business districts',
          },
          {
            id: 'industrial',
            name: 'Industrial',
            color: '#6b7280',
            description: 'Manufacturing zones',
          },
          {
            id: 'park',
            name: 'Park',
            color: '#34d399',
            description: 'Green spaces',
          },
        ],
        theme: {
          primaryColor: '#8b5cf6',
          secondaryColor: '#7c3aed',
        },
        metadata: {
          author: deckAuthor.trim() || 'Anonymous',
          created: new Date(),
          modified: new Date(),
          version: '1.0',
        },
        customScoringConditions: [],
      };

      addDeck(newDeck);
      showNotificationMessage(`Created deck "${deckName}"!`, 'success');
      
      // Reset form
      setDeckName('');
      setDeckDescription('');
      setDeckAuthor('');
      setShowCreateModal(false);
    } catch (error) {
      showNotificationMessage(`Failed to create deck: ${error}`, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (deck: CustomDeck) => {
    if (confirm(`Are you sure you want to delete "${deck.name}"? This action cannot be undone.`)) {
      deleteDeck(deck.id);
      showNotificationMessage(`Deleted "${deck.name}"`, 'success');
    }
  };

  const handleDuplicate = (deck: CustomDeck) => {
    try {
      duplicateDeck(deck.id);
      showNotificationMessage(`Duplicated "${deck.name}"`, 'success');
    } catch (error) {
      showNotificationMessage(`Failed to duplicate deck: ${error}`, 'error');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Deck Management</h1>
            <p className="text-base-content/70">Manage your custom decks, create new ones, and import/export deck files</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="btn btn-outline gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Import Deck
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Deck
            </button>
          </div>
        </div>
      </div>

      {/* Custom Decks Grid */}
      {customDecks.length === 0 ? (
        <div className="hero min-h-[400px] bg-base-200 rounded-2xl">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-base-content/40 mb-6">
                <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">No Custom Decks Yet</h2>
              <p className="mb-6 text-base-content/70">
                Create your first custom deck to get started, or import one from a friend!
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Deck
                </button>
                
                <button
                  onClick={() => setShowImportModal(true)}
                  className="btn btn-outline gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Import Deck
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customDecks.map((deck) => {
            const validation = validateCustomDeck(deck);
            const zoneTypeIds = deck.zoneTypes ? deck.zoneTypes.map(zt => zt.id) : [];
            const summary = getCardDistributionSummary(deck.baseCards, zoneTypeIds);
            
            return (
              <div
                key={deck.id}
                className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all ${
                  !validation.isValid ? 'border border-error' : ''
                }`}
              >
                <div className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: deck.theme.primaryColor }}
                      />
                      <h3 className="card-title text-lg">{deck.name}</h3>
                    </div>
                    
                    <div className="dropdown dropdown-end">
                      <button tabIndex={0} className="btn btn-ghost btn-sm btn-square">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                          <a href={`/deck-editor/${deck.id}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Deck
                          </a>
                        </li>
                        <li>
                          <button onClick={() => handleDuplicate(deck)}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Duplicate
                          </button>
                        </li>
                        <li>
                          <button onClick={() => handleExport(deck)}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Export
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleDelete(deck)}
                            className="text-error hover:bg-error/10"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="text-base-content/70 text-sm mb-4">{deck.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-base-content/60 mb-4">
                    <span className="badge badge-primary badge-sm">CUSTOM</span>
                    {!validation.isValid && (
                      <span className="badge badge-error badge-sm">INVALID</span>
                    )}
                    <span>{summary.totalCards} cards</span>
                  </div>
                  
                  <div className="text-xs text-base-content/60">
                    <p>By {deck.metadata.author}</p>
                    <p>Modified {new Date(deck.metadata.modified).toLocaleDateString()}</p>
                  </div>
                  
                  {!validation.isValid && (
                    <div className="mt-3 p-3 bg-error/10 rounded-lg">
                      <p className="text-error text-xs font-semibold mb-1">Issues found:</p>
                      <ul className="text-error text-xs list-disc list-inside">
                        {validation.errors.slice(0, 2).map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                        {validation.errors.length > 2 && (
                          <li>... and {validation.errors.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Back to Setup Button */}
      <div className="mt-8 text-center">
        <a href="/play" className="btn btn-outline">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Game Setup
        </a>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Import Deck</h3>
              <button 
                onClick={() => setShowImportModal(false)} 
                className="btn btn-ghost btn-sm btn-square"
              >
                ✕
              </button>
            </div>
            
            <div className="form-control w-full mb-4">
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
                className={`btn btn-success ${isImporting ? 'loading' : ''}`}
              >
                {isImporting ? 'Importing...' : 'Import Deck'}
              </button>
              <button
                onClick={() => setImportText('')}
                className="btn btn-outline"
              >
                Clear
              </button>
              <button 
                onClick={() => setShowImportModal(false)} 
                className="btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create New Deck</h3>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="btn btn-ghost btn-sm btn-square"
              >
                ✕
              </button>
            </div>
            
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
            </div>
            
            <div className="modal-action">
              <button
                onClick={handleCreateBasicDeck}
                disabled={isCreating || !deckName.trim()}
                className={`btn btn-primary ${isCreating ? 'loading' : ''}`}
              >
                {isCreating ? 'Creating...' : 'Create Basic Deck'}
              </button>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}