import { createActorContext } from '@xstate/react';
import { ruleTestMachine } from '../stores/ruleTestMachine';
import { Card } from '../types/game';
import { RuleTestMachineContext } from '../stores/ruleTestMachine';

// Create the actor context using XState's createActorContext
export const RuleTestMachineReactContext = createActorContext(ruleTestMachine);

// Custom hook that provides a convenient API
export const useRuleTestMachine = () => {
  const actorRef = RuleTestMachineReactContext.useActorRef();
  const snapshot = RuleTestMachineReactContext.useSelector((state) => state);
  
  const selectors = {
    // Rule testing specific context
    currentDeck: snapshot.context.currentDeck,
    currentRule: snapshot.context.currentRule,
    selectedCardDef: snapshot.context.selectedCardDef,
    scoringResults: snapshot.context.scoringResults,
    isLoading: snapshot.context.isLoading,
    debugMode: snapshot.context.debugMode,
    
    // Inherited game machine context
    gameState: snapshot.context.gameState,
    selectedCard: snapshot.context.selectedCard,
    cardRotation: snapshot.context.cardRotation,
    selectedVariations: snapshot.context.selectedVariations,
    error: snapshot.context.error,
    board: snapshot.context.gameState?.board || [] as Card[],
  };

  const actions = {
    // Rule testing specific actions
    loadDeck: (deck: RuleTestMachineContext['currentDeck']) => {
      if (deck) {
        actorRef.send({ type: 'LOAD_DECK', deck });
      }
    },
    loadRule: (rule: RuleTestMachineContext['currentRule']) => 
      actorRef.send({ type: 'LOAD_RULE', rule }),
    selectCardDef: (cardDef: NonNullable<RuleTestMachineContext['selectedCardDef']>) => 
      actorRef.send({ type: 'SELECT_CARD_DEF', cardDef }),
    removeCard: (x: number, y: number) => 
      actorRef.send({ type: 'REMOVE_CARD', x, y }),
    resetBoard: () => 
      actorRef.send({ type: 'RESET_BOARD' }),
    generateFullDeck: () => 
      actorRef.send({ type: 'GENERATE_FULL_DECK' }),
    loadPreset: (preset: any) => 
      actorRef.send({ type: 'LOAD_PRESET', preset }),
    runTest: () => 
      actorRef.send({ type: 'RUN_TEST' }),
    setDebugMode: (debugMode: boolean) => 
      actorRef.send({ type: 'SET_DEBUG_MODE', debugMode }),
    
    // Inherited game machine actions
    placeCard: (x: number, y: number) => 
      actorRef.send({ type: 'PLACE_CARD', x, y }),
    rotateCard: () => 
      actorRef.send({ type: 'ROTATE_CARD' }),
    clearSelection: () => 
      actorRef.send({ type: 'CLEAR_SELECTION' }),
    clearError: () => 
      actorRef.send({ type: 'CLEAR_ERROR' }),
  };

  return {
    selectors,
    actions,
  };
};

// Export the context type for typing purposes
export type RuleTestMachineContextType = ReturnType<typeof useRuleTestMachine>;

// Export the provider component
export const RuleTestMachineProvider = RuleTestMachineReactContext.Provider;