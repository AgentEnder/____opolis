import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CustomDeck } from '../../types/deck';
import { useCustomDecksStore } from '../../stores/customDecksStore';
import { validateCustomDeck, getCardDistributionSummary } from '../../utils/deckValidation';
import { useUIStore } from '../../stores/uiStore';
import { withBaseUrl } from '../../utils/baseUrl';

interface CustomDeckSelectorProps {
  selectedDecks: CustomDeck[];
  onToggleDeck: (deck: CustomDeck) => void;
  onCreateDeck: () => void;
  onPreviewDeck?: (deck: CustomDeck) => void;
}

export default function CustomDeckSelector({ 
  selectedDecks, 
  onToggleDeck, 
  onCreateDeck,
  onPreviewDeck
}: CustomDeckSelectorProps) {
  const { customDecks, deleteDeck, duplicateDeck } = useCustomDecksStore();
  const { showNotificationMessage } = useUIStore();
  const [showActions, setShowActions] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{x: number, y: number} | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDelete = (deck: CustomDeck) => {
    if (confirm(`Are you sure you want to delete "${deck.name}"? This action cannot be undone.`)) {
      deleteDeck(deck.id);
      showNotificationMessage(`Deleted "${deck.name}"`, 'success');
      setShowActions(null);
    }
  };

  const handleDuplicate = (deck: CustomDeck) => {
    try {
      duplicateDeck(deck.id);
      showNotificationMessage(`Duplicated "${deck.name}"`, 'success');
      setShowActions(null);
    } catch (error) {
      showNotificationMessage(`Failed to duplicate deck: ${error}`, 'error');
    }
  };

  const calculateDropdownPosition = (button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    return {
      x: rect.right - 160, // 160px = w-40 (40 * 4px)
      y: rect.bottom + 4
    };
  };

  const handleToggleDropdown = (deckId: string, button: HTMLButtonElement) => {
    if (showActions === deckId) {
      setShowActions(null);
      setDropdownPosition(null);
    } else {
      setShowActions(deckId);
      setDropdownPosition(calculateDropdownPosition(button));
    }
  };

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowActions(null);
        setDropdownPosition(null);
      }
    };

    const handleScroll = () => {
      if (showActions && buttonRef.current) {
        // Update position on scroll or close if button is out of view
        const rect = buttonRef.current.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          setShowActions(null);
          setDropdownPosition(null);
        } else {
          setDropdownPosition(calculateDropdownPosition(buttonRef.current));
        }
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [showActions]);

  if (customDecks.length === 0) {
    return (
      <div className="card card-body border-2 border-dashed border-base-300 bg-base-100 text-center">
        <div className="text-base-content/60 mb-4">
          <svg className="mx-auto h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg font-semibold">No Custom Decks Yet</p>
          <p className="text-sm">Create your first custom deck to get started</p>
        </div>
        <button
          onClick={onCreateDeck}
          className="btn btn-primary"
        >
          Create Your First Deck
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">Your Custom Decks</h4>
        <button
          onClick={onCreateDeck}
          className="btn btn-success btn-sm gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Deck
        </button>
      </div>

      <div className="grid gap-3 max-h-64 overflow-y-auto">
        {customDecks.map((deck) => {
          const isSelected = selectedDecks.some(d => d.id === deck.id);
          const validation = validateCustomDeck(deck);
          const zoneTypeIds = deck.zoneTypes ? deck.zoneTypes.map(zt => zt.id) : [];
          const summary = getCardDistributionSummary(deck.baseCards, zoneTypeIds);
          
          return (
            <div
              key={deck.id}
              className={`card cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-primary bg-primary/10 shadow-md'
                  : validation.isValid
                  ? 'border border-base-300 hover:border-base-400 hover:bg-base-200/50'
                  : 'border border-error bg-error/10 hover:border-error'
              }`}
            >
              <div className="card-body p-4">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1 flex items-center gap-3"
                    onClick={() => validation.isValid && onToggleDeck(deck)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!validation.isValid}
                        onChange={() => {}} // Handled by parent div onClick
                        className="checkbox checkbox-sm mr-2"
                        style={{ pointerEvents: 'none' }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: deck.theme.primaryColor }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="card-title text-lg truncate">{deck.name}</h5>
                        <div className="badge badge-primary badge-sm">
                          CUSTOM
                        </div>
                        {!validation.isValid && (
                          <div className="badge badge-error badge-sm">
                            INVALID
                          </div>
                        )}
                      </div>
                      
                      <p className="text-base-content/70 text-sm truncate">{deck.description}</p>
                      
                      <div className="text-xs text-base-content/60 mt-1 flex items-center gap-4">
                        <span>{summary.totalCards} cards</span>
                        <span>By {deck.metadata.author}</span>
                        <span>Modified {new Date(deck.metadata.modified).toLocaleDateString()}</span>
                      </div>

                      {!validation.isValid && (
                        <div className="mt-2">
                          <p className="text-error text-xs font-semibold">Issues:</p>
                          <ul className="text-error text-xs list-disc list-inside">
                            {validation.errors.slice(0, 2).map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                            {validation.errors.length > 2 && (
                              <li>... and {validation.errors.length - 2} more issues</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Button */}
                  <button 
                    ref={deck.id === showActions ? buttonRef : undefined}
                    className="btn btn-ghost btn-sm btn-square"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDropdown(deck.id, e.currentTarget);
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Portal-rendered dropdown */}
      {showActions && dropdownPosition && typeof document !== 'undefined' && 
        createPortal(
          <div 
            ref={dropdownRef}
            className="fixed z-50 w-40 bg-base-100 border border-base-300 rounded-box shadow-lg menu p-2"
            style={{
              left: `${dropdownPosition.x}px`,
              top: `${dropdownPosition.y}px`,
            }}
          >
            {onPreviewDeck && (
              <li>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const deck = customDecks.find(d => d.id === showActions);
                    if (deck) {
                      onPreviewDeck(deck);
                      setShowActions(null);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-base-200 rounded-btn"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
              </li>
            )}
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = withBaseUrl(`/deck-editor/${showActions}`);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-base-200 rounded-btn"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Deck
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const deck = customDecks.find(d => d.id === showActions);
                  if (deck) handleDuplicate(deck);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-base-200 rounded-btn"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Duplicate
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const deck = customDecks.find(d => d.id === showActions);
                  if (deck) handleDelete(deck);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-btn"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </li>
          </div>,
          document.body
        )
      }
    </div>
  );
}