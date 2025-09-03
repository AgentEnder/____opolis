import { useEffect } from 'react';
import { useDeckAnalyticsStore } from '../../stores/deckAnalyticsStore';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import { DeckSuggestion } from '../../types/deckAnalytics';

export function DeckAnalytics() {
  const { currentDeck } = useDeckEditorStore();
  const {
    currentAnalysis,
    isAnalyzing,
    analyzeDeck,
    getBalanceScore,
    getSuggestionsBy,
    getZoneDistribution,
  } = useDeckAnalyticsStore();

  // Auto-analyze when deck changes
  useEffect(() => {
    if (currentDeck) {
      analyzeDeck(currentDeck);
    }
  }, [currentDeck, analyzeDeck]);

  if (!currentDeck) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium mb-2">No deck selected</h3>
          <p>Select or create a deck to view analytics</p>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="p-8 text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-gray-600">Analyzing deck balance...</p>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium mb-2">Analysis failed</h3>
          <p>Unable to analyze deck. Please try again.</p>
        </div>
      </div>
    );
  }

  const balance = currentAnalysis.balance;
  const balanceScore = getBalanceScore();
  const zoneDistribution = getZoneDistribution();
  const highPrioritySuggestions = getSuggestionsBy(undefined, 'high');
  const mediumPrioritySuggestions = getSuggestionsBy(undefined, 'medium');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Deck Analytics</h2>
          <p className="text-gray-600">{currentDeck.name}</p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => analyzeDeck(currentDeck)}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            '🔄'
          )}
          Refresh
        </button>
      </div>

      {/* Overall Balance Score */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Overall Balance</h3>
              <p className="text-sm text-gray-600">
                {balanceScore >= 8 ? 'Excellent' : 
                 balanceScore >= 6 ? 'Good' : 
                 balanceScore >= 4 ? 'Fair' : 'Needs Improvement'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{balanceScore.toFixed(1)}</div>
              <div className="text-sm text-gray-500">out of 10</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Balance Score</span>
              <span>{balanceScore.toFixed(1)}/10</span>
            </div>
            <progress 
              className={`progress w-full ${
                balanceScore >= 8 ? 'progress-success' : 
                balanceScore >= 6 ? 'progress-info' :
                balanceScore >= 4 ? 'progress-warning' : 'progress-error'
              }`}
              value={balanceScore} 
              max="10"
            ></progress>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body text-center">
            <div className="text-2xl">🃏</div>
            <div className="stat-value text-2xl">{balance.cardCount}</div>
            <div className="stat-title">Total Cards</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body text-center">
            <div className="text-2xl">👥</div>
            <div className="stat-value text-2xl">
              {balance.recommendedPlayerCount.length > 1 ? 
                `${balance.recommendedPlayerCount[0]}-${balance.recommendedPlayerCount[balance.recommendedPlayerCount.length - 1]}` :
                balance.recommendedPlayerCount[0]
              }
            </div>
            <div className="stat-title">Players</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body text-center">
            <div className="text-2xl">
              {balance.difficulty === 'beginner' ? '🟢' :
               balance.difficulty === 'intermediate' ? '🟡' : '🔴'}
            </div>
            <div className="stat-value text-lg capitalize">{balance.difficulty}</div>
            <div className="stat-title">Difficulty</div>
          </div>
        </div>
      </div>

      {/* Zone Distribution */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Zone Distribution</h3>
          <div className="space-y-3">
            {Object.entries(zoneDistribution).map(([zoneId, percentage]) => {
              const zoneType = currentDeck.zoneTypes.find(zt => zt.id === zoneId);
              const zoneName = zoneType?.name || zoneId;
              const isBalanced = percentage >= 15 && percentage <= 40;
              const isDominant = percentage > 50;
              
              return (
                <div key={zoneId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: zoneType?.color || '#gray' }}
                    ></div>
                    <span className="font-medium">{zoneName}</span>
                    {isDominant && <span className="badge badge-warning badge-xs">Dominant</span>}
                    {isBalanced && <span className="badge badge-success badge-xs">Balanced</span>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{percentage}%</span>
                    <div className="w-20 bg-base-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Road Complexity */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Road Complexity</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">{balance.roadComplexity.simple}%</div>
              <div className="text-sm text-gray-600">Simple</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">{balance.roadComplexity.medium}%</div>
              <div className="text-sm text-gray-600">Medium</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-error">{balance.roadComplexity.complex}%</div>
              <div className="text-sm text-gray-600">Complex</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Potential */}
      {balance.scoringPotential.max > 0 && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Scoring Potential</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-info">{balance.scoringPotential.min}</div>
                <div className="text-sm text-gray-600">Minimum</div>
              </div>
              <div>
                <div className="text-xl font-bold text-success">{balance.scoringPotential.average}</div>
                <div className="text-sm text-gray-600">Average</div>
              </div>
              <div>
                <div className="text-xl font-bold text-warning">{balance.scoringPotential.max}</div>
                <div className="text-sm text-gray-600">Maximum</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {(highPrioritySuggestions.length > 0 || mediumPrioritySuggestions.length > 0) && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            
            {highPrioritySuggestions.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-error mb-2">High Priority</h4>
                <div className="space-y-2">
                  {highPrioritySuggestions.map((suggestion) => (
                    <SuggestionItem key={suggestion.id} suggestion={suggestion} />
                  ))}
                </div>
              </div>
            )}

            {mediumPrioritySuggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-warning mb-2">Medium Priority</h4>
                <div className="space-y-2">
                  {mediumPrioritySuggestions.map((suggestion) => (
                    <SuggestionItem key={suggestion.id} suggestion={suggestion} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SuggestionItemProps {
  suggestion: DeckSuggestion;
}

function SuggestionItem({ suggestion }: SuggestionItemProps) {
  const getIcon = () => {
    switch (suggestion.type) {
      case 'warning': return '⚠️';
      case 'suggestion': return '💡';
      case 'improvement': return '✨';
      default: return '📝';
    }
  };

  return (
    <div className="alert alert-sm">
      <div className="flex items-start space-x-2">
        <span className="text-lg">{getIcon()}</span>
        <div className="flex-1">
          <div className="font-medium">{suggestion.title}</div>
          <div className="text-sm text-gray-600">{suggestion.description}</div>
        </div>
      </div>
    </div>
  );
}