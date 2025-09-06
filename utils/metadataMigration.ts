import { CustomDeck, CardDefinition } from '../types/deck';
import { CustomMetadata } from '../types/metadataSystem';

/**
 * Migration utilities for converting card-level metadata to zone-level metadata.
 * 
 * This migration strategy (Option A) preserves existing behavior by applying
 * card-level metadata to all 4 zones within each card for backward compatibility.
 */

export function migrateCardMetadataToZones(card: CardDefinition, cardMetadata?: CustomMetadata): CardDefinition {
  if (!cardMetadata) {
    return card; // No metadata to migrate
  }

  // Apply the card's metadata to all cells (zones) in the card
  const migratedCells = card.cells.map(row => 
    row.map(cell => ({
      ...cell,
      customMetadata: cardMetadata
    }))
  );

  return {
    ...card,
    cells: migratedCells
  };
}

export function migrateFullDeck(deck: CustomDeck): CustomDeck {
  // For custom decks, we need to check if any cards have metadata that needs migration
  // Since CardDefinition.customMetadata was removed, we look for legacy data in stored decks
  
  // This function handles decks loaded from storage that may have old card-level metadata
  const migratedCards = deck.baseCards.map(card => {
    // If loading from storage, card might have customMetadata property
    const legacyMetadata = (card as any).customMetadata as CustomMetadata | undefined;
    return migrateCardMetadataToZones(card, legacyMetadata);
  });

  const migratedExpansions = deck.expansions.map(expansion => ({
    ...expansion,
    cards: expansion.cards.map(card => {
      const legacyMetadata = (card as any).customMetadata as CustomMetadata | undefined;
      return migrateCardMetadataToZones(card, legacyMetadata);
    })
  }));

  return {
    ...deck,
    baseCards: migratedCards,
    expansions: migratedExpansions
  };
}

/**
 * Check if a deck needs migration (has any cards with legacy card-level metadata)
 */
export function deckNeedsMigration(deck: CustomDeck): boolean {
  const checkCards = (cards: CardDefinition[]) => 
    cards.some(card => (card as any).customMetadata !== undefined);

  return (
    checkCards(deck.baseCards) ||
    deck.expansions.some(exp => checkCards(exp.cards))
  );
}

/**
 * Utility to clean up legacy metadata properties after migration
 */
export function cleanupLegacyMetadata(deck: CustomDeck): CustomDeck {
  const cleanCards = (cards: CardDefinition[]) =>
    cards.map(card => {
      const { customMetadata, ...cleanCard } = card as any;
      return cleanCard as CardDefinition;
    });

  return {
    ...deck,
    baseCards: cleanCards(deck.baseCards),
    expansions: deck.expansions.map(exp => ({
      ...exp,
      cards: cleanCards(exp.cards)
    }))
  };
}

/**
 * Alternative migration strategy: Apply metadata only to specific zone types
 * This could be used if more selective migration is needed in the future
 */
export function migrateCardMetadataToSpecificZones(
  card: CardDefinition, 
  cardMetadata: CustomMetadata, 
  targetZoneTypes: string[]
): CardDefinition {
  const migratedCells = card.cells.map(row => 
    row.map(cell => ({
      ...cell,
      customMetadata: targetZoneTypes.includes(cell.type) ? cardMetadata : cell.customMetadata
    }))
  );

  return {
    ...card,
    cells: migratedCells
  };
}