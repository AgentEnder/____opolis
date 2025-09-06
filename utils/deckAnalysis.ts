import { CustomDeck, CardDefinition } from '../types/deck';
import { DeckBalance, DeckSuggestion, DeckAnalysisResult, AnalysisConfig } from '../types/deckAnalytics';
import { CellType } from '../types/game';

/**
 * Analyzes a custom deck for balance and provides recommendations
 */
export class DeckAnalyzer {
  private readonly config: AnalysisConfig;

  constructor(config: Partial<AnalysisConfig> = {}) {
    this.config = {
      includeScoring: true,
      includeBalance: true,
      includeComplexity: true,
      ...config,
    };
  }

  /**
   * Performs comprehensive analysis of a deck
   */
  analyzeDeck(deck: CustomDeck): DeckAnalysisResult {
    const balance = this.calculateDeckBalance(deck);
    const suggestions = this.generateSuggestions(deck, balance);

    return {
      deck,
      balance,
      suggestions,
      analysisDate: new Date(),
      version: '1.0.0',
    };
  }

  /**
   * Calculates deck balance metrics
   */
  private calculateDeckBalance(deck: CustomDeck): DeckBalance {
    const totalCards = deck.baseCards.reduce((sum, card) => sum + card.count, 0);
    const zoneDistribution = this.analyzeZoneDistribution(deck);
    const roadComplexity = this.analyzeRoadComplexity(deck);
    const scoringPotential = this.analyzeScoringPotential(deck);
    const recommendedPlayerCount = this.calculateRecommendedPlayerCount(totalCards);
    const difficulty = this.calculateDifficulty(deck, roadComplexity);
    const balanceScore = this.calculateBalanceScore(zoneDistribution, roadComplexity, totalCards);

    return {
      cardCount: totalCards,
      zoneDistribution,
      roadComplexity,
      scoringPotential,
      recommendedPlayerCount,
      difficulty,
      balanceScore,
    };
  }

  /**
   * Analyzes the distribution of zone types across all cards
   */
  private analyzeZoneDistribution(deck: CustomDeck): Record<string, number> {
    const zoneCounts: Record<string, number> = {};
    let totalCells = 0;

    // Initialize zone counts
    deck.zoneTypes.forEach(zoneType => {
      zoneCounts[zoneType.id] = 0;
    });

    // Count zones from all cards
    deck.baseCards.forEach(card => {
      for (let row = 0; row < card.cells.length; row++) {
        for (let col = 0; col < card.cells[row].length; col++) {
          const cellType = card.cells[row][col].type;
          zoneCounts[cellType] = (zoneCounts[cellType] || 0) + card.count;
          totalCells += card.count;
        }
      }
    });

    // Convert to percentages
    const distribution: Record<string, number> = {};
    Object.entries(zoneCounts).forEach(([zoneType, count]) => {
      distribution[zoneType] = totalCells > 0 ? Math.round((count / totalCells) * 100) : 0;
    });

    return distribution;
  }

  /**
   * Analyzes road complexity across all cards
   */
  private analyzeRoadComplexity(deck: CustomDeck): { simple: number; medium: number; complex: number } {
    let simple = 0;
    let medium = 0;
    let complex = 0;

    deck.baseCards.forEach(card => {
      const cardComplexity = this.calculateCardRoadComplexity(card);
      
      if (cardComplexity <= 2) {
        simple += card.count;
      } else if (cardComplexity <= 4) {
        medium += card.count;
      } else {
        complex += card.count;
      }
    });

    const total = simple + medium + complex;
    return {
      simple: total > 0 ? Math.round((simple / total) * 100) : 0,
      medium: total > 0 ? Math.round((medium / total) * 100) : 0,
      complex: total > 0 ? Math.round((complex / total) * 100) : 0,
    };
  }

  /**
   * Calculates road complexity for a single card
   */
  private calculateCardRoadComplexity(card: CardDefinition): number {
    let totalRoadSegments = 0;
    let roadCells = 0;

    for (let row = 0; row < card.cells.length; row++) {
      for (let col = 0; col < card.cells[row].length; col++) {
        const cell = card.cells[row][col];
        if (cell.roads && cell.roads.length > 0) {
          totalRoadSegments += cell.roads.length;
          roadCells++;
        }
      }
    }

    // Complexity is based on road segments per cell and total road cells
    return totalRoadSegments + (roadCells > 2 ? 1 : 0);
  }

  /**
   * Analyzes scoring potential of the deck
   */
  private analyzeScoringPotential(deck: CustomDeck): { min: number; max: number; average: number } {
    const scoringConditions = deck.customScoringConditions || [];
    
    if (scoringConditions.length === 0) {
      return { min: 0, max: 0, average: 0 };
    }

    // Estimate scoring potential based on target contributions
    const contributions = scoringConditions.map(condition => condition.targetContribution || 0);
    const totalContribution = contributions.reduce((sum, contrib) => (sum || 0) + (contrib || 0), 0);
    
    return {
      min: Math.round((totalContribution || 0) * 0.3), // Assume 30% minimum achievement
      max: Math.round((totalContribution || 0) * 1.5), // Allow for synergistic scoring
      average: Math.round((totalContribution || 0) * 0.8), // Assume 80% average achievement
    };
  }

  /**
   * Calculates recommended player count based on deck size
   */
  private calculateRecommendedPlayerCount(totalCards: number): number[] {
    if (totalCards < 12) {
      return [1, 2];
    } else if (totalCards < 20) {
      return [2, 3];
    } else if (totalCards < 30) {
      return [2, 3, 4];
    } else {
      return [3, 4, 5];
    }
  }

  /**
   * Calculates difficulty level based on deck characteristics
   */
  private calculateDifficulty(
    deck: CustomDeck,
    roadComplexity: { simple: number; medium: number; complex: number }
  ): 'beginner' | 'intermediate' | 'advanced' {
    let complexityScore = 0;

    // Factor in road complexity
    complexityScore += roadComplexity.complex * 2 + roadComplexity.medium * 1;

    // Factor in custom scoring conditions
    const scoringConditions = deck.customScoringConditions || [];
    complexityScore += scoringConditions.length * 10;

    // Factor in zone types variety
    complexityScore += deck.zoneTypes.length * 5;

    // Factor in metadata complexity
    const metadataFields = deck.metadataSchema?.fields || [];
    complexityScore += metadataFields.length * 3;

    if (complexityScore < 30) {
      return 'beginner';
    } else if (complexityScore < 70) {
      return 'intermediate';
    } else {
      return 'advanced';
    }
  }

  /**
   * Calculates overall balance score (0-10)
   */
  private calculateBalanceScore(
    zoneDistribution: Record<string, number>,
    roadComplexity: { simple: number; medium: number; complex: number },
    totalCards: number
  ): number {
    let score = 10;

    // Check zone distribution balance
    const zonePercentages = Object.values(zoneDistribution);
    const maxZonePercentage = Math.max(...zonePercentages);
    const minZonePercentage = Math.min(...zonePercentages.filter(p => p > 0));
    
    if (maxZonePercentage > 70) {
      score -= 3; // Too much of one zone type
    }
    if (maxZonePercentage - minZonePercentage > 50) {
      score -= 2; // Uneven distribution
    }

    // Check road complexity balance
    if (roadComplexity.complex > 60) {
      score -= 2; // Too complex
    }
    if (roadComplexity.simple > 80) {
      score -= 1; // Too simple
    }

    // Check deck size appropriateness
    if (totalCards < 8) {
      score -= 2; // Too small
    }
    if (totalCards > 40) {
      score -= 1; // Might be too large
    }

    return Math.max(0, Math.min(10, score));
  }

  /**
   * Generates suggestions for deck improvement
   */
  private generateSuggestions(deck: CustomDeck, balance: DeckBalance): DeckSuggestion[] {
    const suggestions: DeckSuggestion[] = [];

    // Zone distribution suggestions
    const maxZonePercentage = Math.max(...Object.values(balance.zoneDistribution));
    const zoneEntries = Object.entries(balance.zoneDistribution);
    const dominantZone = zoneEntries.find(([_, percentage]) => percentage === maxZonePercentage);

    if (maxZonePercentage > 60 && dominantZone) {
      const zoneName = deck.zoneTypes.find(zt => zt.id === dominantZone[0])?.name || dominantZone[0];
      suggestions.push({
        id: 'zone-balance-dominant',
        type: 'warning',
        category: 'balance',
        title: `${zoneName} zones are dominant`,
        description: `${zoneName} zones make up ${maxZonePercentage}% of your deck. Consider reducing their count for better balance.`,
        priority: 'medium',
        actionable: true,
      });
    }

    // Add more zone types suggestion
    if (deck.zoneTypes.length < 4) {
      suggestions.push({
        id: 'zone-variety',
        type: 'suggestion',
        category: 'theme',
        title: 'Add more zone types',
        description: 'Consider adding more zone types to increase strategic depth and visual variety.',
        priority: 'low',
        actionable: true,
      });
    }

    // Road complexity suggestions
    if (balance.roadComplexity.complex > 50) {
      suggestions.push({
        id: 'road-complexity-high',
        type: 'warning',
        category: 'complexity',
        title: 'High road complexity',
        description: 'Over half your cards have complex road patterns. Consider simplifying some for better accessibility.',
        priority: 'medium',
        actionable: true,
      });
    }

    if (balance.roadComplexity.simple > 80) {
      suggestions.push({
        id: 'road-complexity-low',
        type: 'suggestion',
        category: 'complexity',
        title: 'Low road complexity',
        description: 'Most cards have simple road patterns. Adding some complex roads could increase strategic depth.',
        priority: 'low',
        actionable: true,
      });
    }

    // Scoring suggestions
    const scoringConditions = deck.customScoringConditions || [];
    if (scoringConditions.length === 0) {
      suggestions.push({
        id: 'no-scoring',
        type: 'suggestion',
        category: 'scoring',
        title: 'Add custom scoring conditions',
        description: 'Custom scoring conditions make your deck unique and interesting. Consider adding some!',
        priority: 'medium',
        actionable: true,
      });
    }

    if (scoringConditions.length > 5) {
      suggestions.push({
        id: 'too-many-scoring',
        type: 'warning',
        category: 'scoring',
        title: 'Many scoring conditions',
        description: 'You have many scoring conditions. Consider consolidating some to avoid overwhelming players.',
        priority: 'low',
        actionable: true,
      });
    }

    // Deck size suggestions
    if (balance.cardCount < 8) {
      suggestions.push({
        id: 'deck-too-small',
        type: 'warning',
        category: 'balance',
        title: 'Deck is quite small',
        description: 'Your deck has few cards. Consider adding more variety for longer, more interesting games.',
        priority: 'high',
        actionable: true,
      });
    }

    if (balance.cardCount > 35) {
      suggestions.push({
        id: 'deck-large',
        type: 'suggestion',
        category: 'balance',
        title: 'Large deck',
        description: 'Your deck is quite large. Ensure all cards serve a purpose to maintain engagement.',
        priority: 'low',
        actionable: true,
      });
    }

    // Balance score suggestions
    if (balance.balanceScore < 6) {
      suggestions.push({
        id: 'balance-score-low',
        type: 'warning',
        category: 'balance',
        title: 'Balance could be improved',
        description: 'Your deck balance score is low. Review the other suggestions to improve overall balance.',
        priority: 'high',
        actionable: false,
      });
    }

    return suggestions;
  }
}