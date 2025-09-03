import { create } from 'zustand';
import { CustomDeck } from '../types/deck';
import { DeckBalance, DeckSuggestion, DeckAnalysisResult, AnalysisConfig } from '../types/deckAnalytics';
import { DeckAnalyzer } from '../utils/deckAnalysis';

interface AnalyticsStoreState {
  currentAnalysis: DeckAnalysisResult | null;
  isAnalyzing: boolean;
  analysisConfig: AnalysisConfig;
  analysisHistory: DeckAnalysisResult[];

  // Actions
  analyzeDeck: (deck: CustomDeck) => Promise<void>;
  setAnalysisConfig: (config: Partial<AnalysisConfig>) => void;
  clearAnalysis: () => void;
  clearHistory: () => void;

  // Getters
  getBalanceScore: () => number;
  getSuggestionsBy: (category?: string, priority?: string) => DeckSuggestion[];
  getZoneDistribution: () => Record<string, number>;
}

export const useDeckAnalyticsStore = create<AnalyticsStoreState>()((set, get) => ({
  currentAnalysis: null,
  isAnalyzing: false,
  analysisConfig: {
    includeScoring: true,
    includeBalance: true,
    includeComplexity: true,
  },
  analysisHistory: [],

  analyzeDeck: async (deck: CustomDeck) => {
    set({ isAnalyzing: true });

    try {
      const analyzer = new DeckAnalyzer(get().analysisConfig);
      const analysis = analyzer.analyzeDeck(deck);
      
      const { analysisHistory } = get();
      const updatedHistory = [analysis, ...analysisHistory.slice(0, 9)]; // Keep last 10 analyses

      set({
        currentAnalysis: analysis,
        isAnalyzing: false,
        analysisHistory: updatedHistory,
      });
    } catch (error) {
      console.error('Error analyzing deck:', error);
      set({ isAnalyzing: false });
    }
  },

  setAnalysisConfig: (config: Partial<AnalysisConfig>) => {
    set(state => ({
      analysisConfig: { ...state.analysisConfig, ...config }
    }));
  },

  clearAnalysis: () => {
    set({ currentAnalysis: null });
  },

  clearHistory: () => {
    set({ analysisHistory: [] });
  },

  getBalanceScore: () => {
    const { currentAnalysis } = get();
    return currentAnalysis?.balance.balanceScore || 0;
  },

  getSuggestionsBy: (category?: string, priority?: string) => {
    const { currentAnalysis } = get();
    if (!currentAnalysis) return [];

    let suggestions = currentAnalysis.suggestions;

    if (category) {
      suggestions = suggestions.filter(s => s.category === category);
    }

    if (priority) {
      suggestions = suggestions.filter(s => s.priority === priority);
    }

    return suggestions;
  },

  getZoneDistribution: () => {
    const { currentAnalysis } = get();
    return currentAnalysis?.balance.zoneDistribution || {};
  },
}));