# Zone-Level Metadata Migration Plan

## Problem Statement

The current deck metadata system incorrectly associates metadata at the card level, which doesn't align with the game's zone-based architecture. Since each card contains 4 individual zones (2x2 grid), and zones have distinct types and properties, metadata should be associated with individual zones rather than entire cards.

## Current State Analysis

### Current Architecture Issues
- **Card-level metadata**: All 4 zones in a card share the same metadata values
- **Granularity mismatch**: Cannot assign different metadata to individual zones within a card
- **Semantic incorrectness**: Metadata like "livestock count" should apply to specific agricultural zones, not entire cards
- **Limited flexibility**: Cannot have zone-specific properties that vary within a single card

### Current Data Flow
```
CustomDeck.metadataSchema → CardDefinition.customMetadata → Applied to entire card (all 4 zones)
```

### Files Currently Involved
- `types/deck.ts` - Card and deck definitions
- `types/metadataSystem.ts` - Metadata type definitions
- `stores/deckEditorStore.ts` - Card metadata management
- `stores/metadataStore.ts` - Schema management
- `components/deck-editor/MetadataEditor.tsx` - Schema definition UI
- `components/deck-editor/CardMetadataForm.tsx` - Card metadata assignment UI
- `utils/metadataValidation.ts` - Validation logic

## Target Architecture

### New Data Flow
```
CustomDeck.metadataSchema → ZoneType.defaultMetadata → CellData.customMetadata → Applied per zone
```

### Zone-Level Metadata Association
```typescript
// Target structure
interface CellData {
  type: string; // ZoneType.id
  roads: RoadSegment[];
  customMetadata?: CustomMetadata; // ← NEW: Zone-specific metadata
}

interface ZoneType {
  id: string;
  name: string;
  color: string;
  description?: string;
  defaultMetadata?: CustomMetadata; // ← NEW: Default values for this zone type
}
```

## Migration Plan

### Phase 1: Type System Updates

#### 1.1 Update Core Types (`types/deck.ts`)
- **Add** `customMetadata?: CustomMetadata` to `CellData` interface
- **Add** `defaultMetadata?: CustomMetadata` to `ZoneType` interface
- **Remove** `customMetadata` from `CardDefinition` interface
- **Keep** `CustomDeck.metadataSchema` (unchanged - still defines available fields)

#### 1.2 Update Metadata Types (`types/metadataSystem.ts`)
- Consider if any zone-specific metadata types are needed
- Keep existing `MetadataSchema` and `CustomMetadata` interfaces

### Phase 2: Data Migration Logic

#### 2.1 Create Migration Utilities (`utils/metadataMigration.ts`)
```typescript
// Convert existing card-level metadata to zone-level
function migrateCardMetadataToZones(card: CardDefinition): CardDefinition
function migrateFullDeck(deck: CustomDeck): CustomDeck
```

#### 2.2 Handle Migration Strategy
- **Option A**: Apply card metadata to all 4 zones (preserve current behavior)
- **Option B**: Apply only to zones matching specific criteria
- **Option C**: Clear all metadata and require re-assignment
- **Recommended**: Option A for backward compatibility

### Phase 3: Store Layer Updates

#### 3.1 Update Deck Editor Store (`stores/deckEditorStore.ts`)
- **Remove**: `updateCardMetadata(cardId, metadata)` method
- **Add**: `updateZoneMetadata(cardId, zoneIndex, metadata)` method
- **Add**: `updateZoneTypeDefaultMetadata(zoneTypeId, metadata)` method
- **Update**: `validateDeckMetadata()` to check zone-level metadata

#### 3.2 Update Metadata Store (`stores/metadataStore.ts`)
- **Update**: Validation logic to work with zone-level metadata
- **Add**: Zone type metadata management if needed

### Phase 4: UI Component Refactoring

#### 4.1 Remove Card Metadata Form
- **Delete**: `components/deck-editor/CardMetadataForm.tsx`
- **Remove**: Card-selection based metadata assignment

#### 4.2 Update Metadata Editor (`components/deck-editor/MetadataEditor.tsx`)
- **Remove**: Card metadata assignment section
- **Keep**: Schema definition functionality (unchanged)
- **Add**: Zone type default metadata section (optional)

#### 4.3 Update Card Builder for Zone Metadata
- **Modify**: `components/card-builder/ZoneEditor.tsx` to include metadata editing
- **Add**: Per-zone metadata form when editing individual zones
- **Add**: Zone selection UI for metadata assignment

#### 4.4 New Zone Metadata Components
- **Create**: `components/deck-editor/ZoneMetadataEditor.tsx` - Zone-specific metadata editing
- **Create**: `components/card-builder/ZoneMetadataForm.tsx` - Inline metadata editing

### Phase 5: Validation and Utilities

#### 5.1 Update Validation (`utils/metadataValidation.ts`)
- **Update**: `validateMetadata()` to work on zone level
- **Add**: `validateZoneMetadata(zoneMetadata, schema)` method
- **Add**: Validation for zone type default metadata

#### 5.2 Update Game Logic Integration
- **Review**: Any game logic that uses metadata (scoring, etc.)
- **Update**: References to card.customMetadata → zone.customMetadata
- **Test**: Ensure scoring and game mechanics work correctly

### Phase 6: Data Persistence and Loading

#### 6.1 Deck Loading
- **Add**: Migration logic when loading existing decks with card-level metadata
- **Ensure**: Backward compatibility with existing saved decks
- **Handle**: Version detection and automatic migration

#### 6.2 Deck Saving
- **Update**: Save logic to persist zone-level metadata
- **Ensure**: New format is correctly serialized

## Implementation Order

### Step 1: Foundation (Non-breaking changes)
1. Add new fields to types (CellData.customMetadata, ZoneType.defaultMetadata)
2. Create migration utilities
3. Keep existing card-level metadata for compatibility

### Step 2: Store Updates
1. Update deckEditorStore with new zone metadata methods
2. Keep existing card metadata methods temporarily
3. Add validation for zone-level metadata

### Step 3: UI Migration
1. Create new zone metadata editing components
2. Integrate zone metadata editing into card builder
3. Remove card metadata assignment from MetadataEditor

### Step 4: Data Migration
1. Implement automatic migration for existing decks
2. Migrate card metadata to zone metadata on deck load
3. Remove card-level metadata fields and methods

### Step 5: Cleanup
1. Remove deprecated CardMetadataForm component
2. Remove card-level metadata methods from stores
3. Clean up unused imports and references

## Testing Strategy

### Unit Tests
- Test metadata migration utilities
- Test zone metadata validation
- Test store methods for zone metadata operations

### Integration Tests
- Test deck loading with migration
- Test zone metadata editing in card builder
- Test metadata persistence and loading

### Manual Testing
- Verify existing decks load correctly with migrated metadata
- Test zone metadata assignment workflow
- Verify game mechanics still work with zone-level metadata

## Risks and Mitigations

### Risk 1: Data Loss During Migration
- **Mitigation**: Implement careful migration logic with fallbacks
- **Mitigation**: Backup existing card metadata before migration
- **Mitigation**: Provide rollback mechanism if needed

### Risk 2: UI Complexity
- **Mitigation**: Start with simple zone selection UI
- **Mitigation**: Consider zone type defaults to reduce per-zone editing
- **Mitigation**: Provide bulk assignment tools

### Risk 3: Performance Impact
- **Mitigation**: Zone metadata is small and local to cards
- **Mitigation**: Use efficient zone selection and editing patterns
- **Mitigation**: Consider lazy loading for large decks

## Success Criteria

1. **Functional**: Metadata can be assigned to individual zones within cards
2. **Compatible**: Existing decks load and migrate correctly
3. **Usable**: Zone metadata editing is intuitive and efficient
4. **Maintainable**: Code is cleaner with proper separation of concerns
5. **Tested**: All metadata operations work correctly with good test coverage

## Timeline Estimate

- **Phase 1-2**: Type updates and migration utilities - 2-3 hours
- **Phase 3**: Store layer updates - 2-3 hours  
- **Phase 4**: UI component refactoring - 4-5 hours
- **Phase 5**: Validation and utilities - 1-2 hours
- **Phase 6**: Data persistence and testing - 2-3 hours

**Total Estimated Time**: 11-16 hours of development work

This migration will fundamentally improve the metadata system's alignment with the game's zone-based architecture while maintaining backward compatibility and providing a clear migration path.