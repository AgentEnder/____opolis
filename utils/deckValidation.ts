import { CustomDeck, CardDefinition, GameVariation } from '../types/deck';
import { CellType } from '../types/game';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const MINIMUM_CARDS_FOR_GAMEPLAY = 8;
const MAXIMUM_CARDS_FOR_PERFORMANCE = 100;

export function validateCustomDeck(deck: Partial<CustomDeck>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic structure validation
  if (!deck.name || deck.name.trim().length === 0) {
    errors.push('Deck name is required');
  }

  if (deck.name && deck.name.length > 50) {
    warnings.push('Deck name is quite long, consider shortening it');
  }

  if (!deck.baseCards || !Array.isArray(deck.baseCards)) {
    errors.push('Deck must have a baseCards array');
    return { isValid: false, errors, warnings };
  }

  // Card count validation
  const totalCards = deck.baseCards.reduce((sum, card) => sum + (card.count || 0), 0);
  
  if (totalCards < MINIMUM_CARDS_FOR_GAMEPLAY) {
    errors.push(`Deck must have at least ${MINIMUM_CARDS_FOR_GAMEPLAY} total cards for gameplay`);
  }

  if (totalCards > MAXIMUM_CARDS_FOR_PERFORMANCE) {
    warnings.push(`Deck has ${totalCards} cards, which may impact performance`);
  }

  // Individual card validation
  const validZoneTypes = deck.zoneTypes ? deck.zoneTypes.map(zt => zt.id) : [];
  deck.baseCards.forEach((card, index) => {
    const cardErrors = validateCardDefinition(card, index, validZoneTypes);
    errors.push(...cardErrors.errors);
    warnings.push(...cardErrors.warnings);
  });

  // Theme validation
  if (!deck.theme) {
    warnings.push('No theme specified, will use default colors');
  } else {
    if (!isValidColor(deck.theme.primaryColor)) {
      errors.push('Invalid primary color format');
    }
    if (!isValidColor(deck.theme.secondaryColor)) {
      errors.push('Invalid secondary color format');
    }
  }

  // Check for duplicate card IDs
  const cardIds = deck.baseCards.map(card => card.id).filter(Boolean);
  const duplicateIds = cardIds.filter((id, index) => cardIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate card IDs found: ${duplicateIds.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateCardDefinition(card: CardDefinition, index?: number, validZoneTypes?: string[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const cardRef = index !== undefined ? `Card ${index + 1}` : 'Card';

  if (!card.id || card.id.trim().length === 0) {
    errors.push(`${cardRef}: Card ID is required`);
  }

  if (!card.cells || !Array.isArray(card.cells)) {
    errors.push(`${cardRef}: Card must have a cells array`);
    return { isValid: false, errors, warnings };
  }

  // Validate 2x2 grid structure
  if (card.cells.length !== 2) {
    errors.push(`${cardRef}: Card must have exactly 2 rows`);
  } else {
    card.cells.forEach((row, rowIndex) => {
      if (!Array.isArray(row) || row.length !== 2) {
        errors.push(`${cardRef}: Row ${rowIndex + 1} must have exactly 2 cells`);
      } else {
        row.forEach((cell, cellIndex) => {
          if (!cell.type) {
            errors.push(`${cardRef}: Cell (${rowIndex + 1},${cellIndex + 1}) is missing type`);
          } else if (validZoneTypes && validZoneTypes.length > 0 && !validZoneTypes.includes(cell.type)) {
            errors.push(`${cardRef}: Cell (${rowIndex + 1},${cellIndex + 1}) has invalid type "${cell.type}". Valid types: ${validZoneTypes.join(', ')}`);
          }

          // Validate road segments if present
          if (cell.roads) {
            cell.roads.forEach((road, roadIndex) => {
              if (!Array.isArray(road) || road.length !== 2) {
                errors.push(`${cardRef}: Road ${roadIndex + 1} in cell (${rowIndex + 1},${cellIndex + 1}) must be [start, end] array`);
              } else {
                const [start, end] = road;
                if (typeof start !== 'number' || typeof end !== 'number' || 
                    start < 0 || start > 3 || end < 0 || end > 3) {
                  errors.push(`${cardRef}: Road segment values must be 0-3 (representing N,E,S,W)`);
                }
              }
            });
          }
        });
      }
    });
  }

  // Count validation
  if (!card.count || card.count < 1) {
    errors.push(`${cardRef}: Card count must be at least 1`);
  }

  if (card.count > 20) {
    warnings.push(`${cardRef}: High card count (${card.count}) may create unbalanced gameplay`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateGameVariationForCustomDeck(variation: Partial<GameVariation>): ValidationResult {
  const result = validateCustomDeck(variation as Partial<CustomDeck>);
  
  // Additional validation specific to game variations
  if (!variation.description) {
    result.warnings.push('Consider adding a description for your deck');
  }

  return result;
}

function isValidColor(color: string): boolean {
  if (!color) return false;
  
  // Check hex color format
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (hexPattern.test(color)) return true;
  
  // Could extend to support rgb(), hsl(), etc.
  return false;
}

export function getCardDistributionSummary(cards: CardDefinition[], validZoneTypes?: string[]): {
  totalCards: number;
  cellTypeCounts: Record<string, number>;
  roadCounts: number;
} {
  const totalCards = cards.reduce((sum, card) => sum + card.count, 0);
  const cellTypeCounts: Record<string, number> = {};
  
  // Initialize counts for all valid zone types
  if (validZoneTypes) {
    validZoneTypes.forEach(type => {
      cellTypeCounts[type] = 0;
    });
  }
  
  let roadCounts = 0;

  cards.forEach(card => {
    const cardCount = card.count;
    card.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.type) {
          cellTypeCounts[cell.type] = (cellTypeCounts[cell.type] || 0) + cardCount;
        }
        if (cell.roads && cell.roads.length > 0) {
          roadCounts += cell.roads.length * cardCount;
        }
      });
    });
  });

  return { totalCards, cellTypeCounts, roadCounts };
}