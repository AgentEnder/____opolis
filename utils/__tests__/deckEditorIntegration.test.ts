import { describe, it, expect, beforeEach } from 'vitest';
import { DeckAnalyzer } from '../deckAnalysis';
import { validateMetadata, createDefaultMetadata } from '../metadataValidation';
import { MetadataTypeGenerator } from '../monacoTypeGeneration';
import { CustomDeck } from '../../types/deck';
import { CustomMetadataField, MetadataSchema } from '../../types/metadataSystem';

describe('Deck Editor Integration', () => {
  let testDeck: CustomDeck;
  let testMetadataSchema: MetadataSchema;

  beforeEach(() => {
    testDeck = {
      id: 'test-deck',
      name: 'Test Deck',
      description: 'A deck for testing',
      type: 'custom',
      isCustom: true,
      baseCards: [
        {
          id: 'card-1',
          name: 'Farm Card',
          count: 3,
          cells: [
            [{ type: 'residential', roads: [], customMetadata: { livestockCount: 5, cropType: 'wheat', seasonal: true } }, { type: 'park', roads: [] }],
            [{ type: 'commercial', roads: [] }, { type: 'industrial', roads: [] }]
          ]
        },
        {
          id: 'card-2',
          name: 'City Card',
          count: 2,
          cells: [
            [{ type: 'commercial', roads: [] }, { type: 'commercial', roads: [] }],
            [{ type: 'residential', roads: [] }, { type: 'park', roads: [] }]
          ]
        }
      ],
      expansions: [],
      customScoringConditions: [
        {
          id: 'test-condition',
          name: 'Livestock Bonus',
          description: 'Bonus points for livestock',
          formula: 'function calculateScore(context) { return 10; }',
          compiledFormula: 'function calculateScore(context) { return 10; }',
          targetContribution: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
          isCustom: true,
          testCases: [],
          evaluate: () => 10,
          evaluateWithDetails: () => ({ points: 10, relevantTiles: [], description: 'Livestock bonus' })
        }
      ],
      zoneTypes: [
        { id: 'residential', name: 'Residential', color: '#60a5fa' },
        { id: 'commercial', name: 'Commercial', color: '#f59e0b' },
        { id: 'industrial', name: 'Industrial', color: '#6b7280' },
        { id: 'park', name: 'Park', color: '#34d399' }
      ],
      theme: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#7c3aed'
      },
      metadata: {
        author: 'Test Author',
        created: new Date(),
        modified: new Date(),
        version: '1.0'
      }
    };

    testMetadataSchema = {
      version: '1.0.0',
      fields: [
        {
          id: 'livestockCount',
          name: 'Livestock Count',
          type: 'number',
          description: 'Number of livestock on this card',
          required: true,
          min: 0,
          max: 10
        },
        {
          id: 'cropType',
          name: 'Crop Type',
          type: 'select',
          description: 'Type of crop grown',
          required: false,
          options: ['wheat', 'corn', 'rice', 'soybeans']
        },
        {
          id: 'seasonal',
          name: 'Seasonal',
          type: 'boolean',
          description: 'Whether this card is seasonal',
          required: false
        }
      ]
    };

    testDeck.metadataSchema = testMetadataSchema;
  });

  describe('Metadata System', () => {
    it('should validate metadata correctly', () => {
      const validMetadata = {
        livestockCount: 5,
        cropType: 'wheat',
        seasonal: true
      };

      const errors = validateMetadata(validMetadata, testMetadataSchema.fields);
      expect(errors).toHaveLength(0);
    });

    it('should detect validation errors', () => {
      const invalidMetadata = {
        livestockCount: -1, // Below minimum
        cropType: 'invalid-crop', // Not in options
        // seasonal missing but not required
      };

      const errors = validateMetadata(invalidMetadata, testMetadataSchema.fields);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.fieldId === 'livestockCount')).toBe(true);
      expect(errors.some(e => e.fieldId === 'cropType')).toBe(true);
    });

    it('should create default metadata', () => {
      const defaultMetadata = createDefaultMetadata(testMetadataSchema.fields);
      
      expect(defaultMetadata).toHaveProperty('livestockCount', 0); // Required field gets min value
      // Optional fields might not be included in defaults
    });
  });

  describe('Type Generation', () => {
    it('should generate TypeScript types from metadata schema', () => {
      const typeGenerator = new MetadataTypeGenerator();
      const generatedTypes = typeGenerator.generateTypesFromSchema(testMetadataSchema);

      expect(generatedTypes).toContain('interface CustomCardMetadata');
      expect(generatedTypes).toContain('livestockCount: number');
      expect(generatedTypes).toContain('cropType?: \'wheat\' | \'corn\' | \'rice\' | \'soybeans\'');
      expect(generatedTypes).toContain('seasonal?: boolean');
      expect(generatedTypes).toContain('interface TypedScoringContext');
    });

    it('should generate example usage', () => {
      const typeGenerator = new MetadataTypeGenerator();
      const exampleUsage = typeGenerator.generateExampleUsage(testMetadataSchema);

      expect(exampleUsage).toContain('function calculateScore');
      expect(exampleUsage).toContain('TypedScoringContext');
      expect(exampleUsage).toContain('metadata');
    });

    it('should handle empty schema gracefully', () => {
      const typeGenerator = new MetadataTypeGenerator();
      const emptySchema: MetadataSchema = { fields: [], version: '1.0.0' };
      const generatedTypes = typeGenerator.generateTypesFromSchema(emptySchema);

      expect(generatedTypes).toContain('interface CustomCardMetadata {}');
      expect(generatedTypes).toContain('interface TypedScoringContext');
    });
  });

  describe('Deck Analytics', () => {
    it('should analyze deck balance', () => {
      const analyzer = new DeckAnalyzer();
      const analysis = analyzer.analyzeDeck(testDeck);

      expect(analysis).toHaveProperty('balance');
      expect(analysis.balance).toHaveProperty('cardCount', 5); // 3 + 2 cards
      expect(analysis.balance).toHaveProperty('zoneDistribution');
      expect(analysis.balance).toHaveProperty('balanceScore');
      expect(analysis.balance.balanceScore).toBeGreaterThanOrEqual(0);
      expect(analysis.balance.balanceScore).toBeLessThanOrEqual(10);
    });

    it('should calculate zone distribution', () => {
      const analyzer = new DeckAnalyzer();
      const analysis = analyzer.analyzeDeck(testDeck);

      const zoneDistribution = analysis.balance.zoneDistribution;
      expect(zoneDistribution).toHaveProperty('residential');
      expect(zoneDistribution).toHaveProperty('commercial');
      expect(zoneDistribution).toHaveProperty('industrial');
      expect(zoneDistribution).toHaveProperty('park');

      // Check that percentages add up to 100
      const totalPercentage = Object.values(zoneDistribution).reduce((sum, pct) => sum + pct, 0);
      expect(totalPercentage).toBe(100);
    });

    it('should generate suggestions', () => {
      const analyzer = new DeckAnalyzer();
      const analysis = analyzer.analyzeDeck(testDeck);

      expect(analysis).toHaveProperty('suggestions');
      expect(Array.isArray(analysis.suggestions)).toBe(true);

      // Each suggestion should have required properties
      analysis.suggestions.forEach(suggestion => {
        expect(suggestion).toHaveProperty('id');
        expect(suggestion).toHaveProperty('type');
        expect(suggestion).toHaveProperty('category');
        expect(suggestion).toHaveProperty('title');
        expect(suggestion).toHaveProperty('description');
        expect(suggestion).toHaveProperty('priority');
      });
    });

    it('should handle deck with no scoring conditions', () => {
      const deckWithoutScoring = { ...testDeck, customScoringConditions: [] };
      const analyzer = new DeckAnalyzer();
      const analysis = analyzer.analyzeDeck(deckWithoutScoring);

      expect(analysis.balance.scoringPotential.max).toBe(0);
      expect(analysis.suggestions.some(s => s.id === 'no-scoring')).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should handle deck with metadata and scoring together', () => {
      // Test that a deck with both metadata and scoring conditions can be analyzed
      const analyzer = new DeckAnalyzer();
      const analysis = analyzer.analyzeDeck(testDeck);

      expect(analysis.balance.cardCount).toBe(5);
      expect(analysis.balance.scoringPotential.max).toBeGreaterThan(0);
      expect(testDeck.baseCards[0].cells[0][0].customMetadata).toBeDefined();
      expect(testDeck.metadataSchema).toBeDefined();
    });

    it('should maintain data integrity across operations', () => {
      // Verify that metadata validation and deck analysis don't interfere
      const cellWithMetadata = testDeck.baseCards[0].cells[0][0];
      const errors = validateMetadata(
        cellWithMetadata.customMetadata!,
        testMetadataSchema.fields
      );

      expect(errors).toHaveLength(0);

      const analyzer = new DeckAnalyzer();
      const analysis = analyzer.analyzeDeck(testDeck);

      expect(analysis.balance.balanceScore).toBeGreaterThan(0);
    });
  });
});