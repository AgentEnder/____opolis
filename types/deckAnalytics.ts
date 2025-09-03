import { CustomDeck } from './deck';

/**
 * Analytics and balance information for a custom deck
 */
export interface DeckBalance {
  cardCount: number;
  zoneDistribution: Record<string, number>;
  roadComplexity: {
    simple: number;
    medium: number;
    complex: number;
  };
  scoringPotential: {
    min: number;
    max: number;
    average: number;
  };
  recommendedPlayerCount: number[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  balanceScore: number; // 0-10 rating
}

/**
 * Suggestions for improving deck balance
 */
export interface DeckSuggestion {
  id: string;
  type: 'warning' | 'suggestion' | 'improvement';
  category: 'balance' | 'scoring' | 'complexity' | 'theme';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

/**
 * Analysis result for a deck
 */
export interface DeckAnalysisResult {
  deck: CustomDeck;
  balance: DeckBalance;
  suggestions: DeckSuggestion[];
  analysisDate: Date;
  version: string;
}

/**
 * Configuration for deck analysis
 */
export interface AnalysisConfig {
  includeScoring: boolean;
  includeBalance: boolean;
  includeComplexity: boolean;
  targetPlayerCount?: number;
  difficultyTarget?: 'beginner' | 'intermediate' | 'advanced';
}