import { useEffect } from 'react';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import { useRuleTestMachine } from '../../providers/RuleTestMachineProvider';
import GameBoard from '../GameBoard';
import { RuleTester } from '../../utils/ruleTesting';

export function RuleTestEnvironment() {
  const { currentDeck } = useDeckEditorStore();
  const machineContext = useRuleTestMachine();
  const { selectors, actions } = machineContext;
  
  const {
    currentRule,
    gameState,
    selectedCardDef,
    scoringResults,
    isLoading,
    board,
    debugMode,
  } = selectors;

  const {
    loadDeck,
    loadRule,
    selectCardDef,
    placeCard,
    removeCard,
    resetBoard,
    generateFullDeck,
    loadPreset,
    clearSelection,
    setDebugMode,
  } = actions;

  const ruleTester = RuleTester.getInstance();

  // Auto-load deck when deck editor deck changes
  useEffect(() => {
    if (currentDeck) {
      loadDeck(currentDeck);
    }
  }, [currentDeck, loadDeck]);

  if (!currentDeck) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🧪</div>
          <h3 className="text-lg font-medium mb-2">No deck selected</h3>
          <p>Select or create a deck to test scoring rules</p>
        </div>
      </div>
    );
  }

  const boardStats = gameState ? ruleTester.getBoardStats(board, currentDeck) : {
    cardCount: 0,
    zoneCount: {},
    roadConnections: 0,
    coverage: 0,
  };
  const availablePresets = currentDeck ? ruleTester.getCommonPresets(currentDeck) : [];
  const scoringConditions = currentDeck?.customScoringConditions || [];

  const handleCardPlacement = (x: number, y: number) => {
    if (selectedCardDef) {
      placeCard(x, y);
    } else {
      removeCard(x, y);
    }
  };


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rule Testing</h2>
          <p className="text-gray-600">{currentDeck.name}</p>
        </div>
        <div className="flex space-x-2">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text mr-2 text-sm">🐛 Debug Mode</span>
              <input 
                type="checkbox" 
                className="toggle toggle-primary toggle-sm" 
                checked={debugMode}
                onChange={(e) => setDebugMode(e.target.checked)}
                title="Enable debug mode to see console.log output from scoring rules (slower execution)"
              />
            </label>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={generateFullDeck}
            disabled={isLoading}
          >
            🔄 Regenerate Board
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={resetBoard}
          >
            🗑️ Clear Board
          </button>
        </div>
      </div>

      {/* Rule Selection */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Select Scoring Rule</h3>
          
          {scoringConditions.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-gray-500 mb-2">No custom scoring rules found</div>
              <p className="text-sm text-gray-400">Create some scoring rules to test them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                className={`btn ${!currentRule ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => loadRule(null)}
              >
                No Rule Selected
              </button>
              {scoringConditions.map((condition) => (
                <button
                  key={condition.id}
                  className={`btn ${currentRule?.id === condition.id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => loadRule(condition)}
                >
                  {condition.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Current Rule Info */}
      {currentRule && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentRule.name}</h3>
                <p className="text-gray-600 text-sm">{currentRule.description}</p>
                <p className="text-xs text-gray-500 mt-1">Target: {currentRule.targetContribution} points</p>
              </div>
              <div className="text-right">
                {scoringResults && (
                  <div>
                    <div className="text-2xl font-bold text-primary">{scoringResults.calculatedScore}</div>
                    <div className="text-sm text-gray-500">points</div>
                    <div className="text-xs text-gray-400">
                      {scoringResults.executionTime.toFixed(1)}ms
                    </div>
                  </div>
                )}
                {isLoading && <span className="loading loading-spinner loading-md"></span>}
              </div>
            </div>
            
            {scoringResults?.errors && scoringResults.errors.length > 0 && (
              <div className="mt-4 alert alert-error">
                <div>
                  <h4 className="font-medium">Execution Errors:</h4>
                  <ul className="list-disc list-inside text-sm">
                    {scoringResults.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Board Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Card Palette */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Card Palette</h3>
              <div className="space-y-2">
                <button
                  className={`btn btn-block ${!selectedCardDef ? 'btn-primary' : 'btn-outline'}`}
                  onClick={clearSelection}
                >
                  🗑️ Remove Cards
                </button>
                {currentDeck.baseCards.map((cardDef) => (
                  <button
                    key={cardDef.id}
                    className={`btn btn-block text-left ${selectedCardDef?.id === cardDef.id ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => selectCardDef(cardDef)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{cardDef.name || `Card ${cardDef.id.slice(-4)}`}</span>
                      <span className="badge badge-sm">{cardDef.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Board Presets */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Board Presets</h3>
              <div className="space-y-2">
                {availablePresets.map((preset) => (
                  <button
                    key={preset.id}
                    className="btn btn-outline btn-block text-left"
                    onClick={() => loadPreset(preset)}
                  >
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-500">{preset.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Board Stats */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Board Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Cards:</span>
                  <span className="font-medium">{boardStats.cardCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Roads:</span>
                  <span className="font-medium">{boardStats.roadConnections}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coverage:</span>
                  <span className="font-medium">{boardStats.coverage}%</span>
                </div>
                
                <div className="divider my-2"></div>
                
                <div className="text-sm">
                  <div className="font-medium mb-2">Zones:</div>
                  {(Object.entries(boardStats.zoneCount) as [string, number][]).map(([zoneId, count]) => {
                    const zoneType = currentDeck.zoneTypes.find(zt => zt.id === zoneId);
                    if (count === 0) return null;
                    return (
                      <div key={zoneId} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: zoneType?.color || '#gray' }}
                          ></div>
                          <span>{zoneType?.name || zoneId}</span>
                        </div>
                        <span>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Board */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Test Board</h3>
                <div className="text-sm text-gray-500">
                  {selectedCardDef ? 'Click to place card' : 'Select card type to place, or click cards to remove'}
                </div>
              </div>
              
              <div 
                className="relative bg-gray-800 rounded border" 
                style={{ width: '600px', height: '400px' }}
              >
                {gameState && (
                  <GameBoard
                    gameState={gameState}
                    onCardPlace={handleCardPlacement}
                    machine={machineContext}
                    width={600}
                    height={400}
                  />
                )}
              </div>
              
              {scoringResults?.details && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Scoring Details:</h4>
                  <div className="text-sm text-gray-600">
                    {scoringResults.details.description}
                  </div>
                  {scoringResults.details.breakdown.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {scoringResults.details.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.description}</span>
                          <span className="font-medium">{item.points}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

