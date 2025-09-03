import { describe, it, expect } from 'vitest';
import { findClusters, findRoadNetworks, calculateBaseScore, calculateScore } from '../scoring';
import { SCORING_CONDITIONS } from '../scoringConditions';
import { Card, CellType } from '../../types/game';

describe('Scoring System', () => {
  // Helper to create test cards
  const createCard = (id: string, x: number, y: number, cells: { type: CellType, roads?: any[] }[][]): Card => ({
    id,
    x,
    y,
    rotation: 0,
    cells: cells.map(row => row.map(cell => ({
      type: cell.type,
      roads: cell.roads || []
    })))
  });

  describe('Cluster Detection', () => {
    it('should find single cluster correctly', () => {
      const board = [
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'residential' }],
          [{ type: 'commercial' }, { type: 'park' }]
        ])
      ];

      const clusters = findClusters(board);
      
      // Should find one residential cluster (size 2), one commercial (size 1), one park (size 1)
      expect(clusters).toHaveLength(3);
      
      const residentialCluster = clusters.find(c => c.type === 'residential');
      const commercialCluster = clusters.find(c => c.type === 'commercial');
      const parkCluster = clusters.find(c => c.type === 'park');
      
      expect(residentialCluster?.size).toBe(2);
      expect(commercialCluster?.size).toBe(1);
      expect(parkCluster?.size).toBe(1);
    });

    it('should detect connected clusters across cards', () => {
      const board = [
        // Card 1 at (0,0)
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'commercial' }],
          [{ type: 'residential' }, { type: 'park' }]
        ]),
        // Card 2 at (2,0) - adjacent to card 1
        createCard('card2', 2, 0, [
          [{ type: 'commercial' }, { type: 'commercial' }],
          [{ type: 'park' }, { type: 'industrial' }]
        ])
      ];

      const clusters = findClusters(board);
      
      // Should connect: commercial from (1,0) to (2,0) = size 3
      const commercialCluster = clusters.find(c => c.type === 'commercial');
      expect(commercialCluster?.size).toBe(3);
      
      // Residential cluster should be size 2 (not connected)
      const residentialCluster = clusters.find(c => c.type === 'residential');
      expect(residentialCluster?.size).toBe(2);
    });
  });

  describe('Road Network Detection', () => {
    it('should detect separate road networks', () => {
      const board = [
        createCard('card1', 0, 0, [
          [{ type: 'residential', roads: [[0, 2]] }, { type: 'commercial' }], // vertical road
          [{ type: 'park' }, { type: 'industrial', roads: [[1, 3]] }]       // horizontal road
        ])
      ];

      const networks = findRoadNetworks(board);
      
      // Two separate road segments that don't connect (one vertical, one horizontal)
      expect(networks).toHaveLength(2);
      expect(networks[0].size).toBe(1);
      expect(networks[1].size).toBe(1);
    });

    it('should detect connected road networks', () => {
      const board = [
        // Create two adjacent cards with connecting roads
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'commercial', roads: [[1, 2]] }], // right-to-bottom
          [{ type: 'park' }, { type: 'industrial' }]
        ]),
        createCard('card2', 2, 0, [
          [{ type: 'commercial', roads: [[3, 0]] }, { type: 'residential' }], // left-to-top  
          [{ type: 'industrial' }, { type: 'park' }]
        ])
      ];

      const networks = findRoadNetworks(board);
      
      // Should detect one connected network of size 2
      expect(networks).toHaveLength(1);
      expect(networks[0].size).toBe(2);
    });
  });

  describe('Base Scoring', () => {
    it('should calculate base score correctly', () => {
      const board = [
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'residential' }],
          [{ type: 'commercial' }, { type: 'commercial' }]
        ]),
        createCard('card2', 2, 0, [
          [{ type: 'residential' }, { type: 'park' }],
          [{ type: 'industrial', roads: [[0, 2]] }, { type: 'industrial' }]
        ])
      ];

      const result = calculateBaseScore(board);
      
      // Largest clusters: residential=3, commercial=2, industrial=2, park=1
      // Total cluster points = 3 + 2 + 2 + 1 = 8
      // Road penalty = -1 (one road network)
      // Base score = 8 - 1 = 7
      
      expect(result.clusterScores.residential).toBe(3);
      expect(result.clusterScores.commercial).toBe(2);
      expect(result.clusterScores.industrial).toBe(2);
      expect(result.clusterScores.park).toBe(1);
      expect(result.roadPenalty).toBe(-1);
      expect(result.baseScore).toBe(7);
    });
  });

  describe('Scoring Conditions', () => {
    it('should apply residential groups condition correctly', () => {
      const board = [
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'park' }],
          [{ type: 'residential' }, { type: 'park' }]
        ]),
        createCard('card2', 2, 0, [
          [{ type: 'residential' }, { type: 'commercial' }],
          [{ type: 'industrial' }, { type: 'commercial' }]
        ])
      ];

      const condition = SCORING_CONDITIONS['residential-groups'];
      const points = condition.evaluate(board);
      
      // Should have 1 + 1 + 1 = 3 residential tiles total
      expect(points).toBe(3);
    });

    it('should apply residential near parks condition correctly', () => {
      const board = [
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'park' }],      // residential adjacent to park
          [{ type: 'residential' }, { type: 'commercial' }] // residential not adjacent to park
        ])
      ];

      const condition = SCORING_CONDITIONS['residential-near-parks'];
      const points = condition.evaluate(board);
      
      // Only the top-left residential is adjacent to the park
      expect(points).toBe(1);
    });
  });

  describe('Full Score Calculation', () => {
    it('should calculate complete score with conditions', () => {
      const board = [
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'residential' }],
          [{ type: 'commercial' }, { type: 'park' }]
        ])
      ];

      const conditions = [SCORING_CONDITIONS['residential-groups']];
      const result = calculateScore(board, conditions);
      
      // Base score: residential=2, commercial=1, park=1, no roads = 4
      // Condition: residential groups = 2 points  
      // Total = 4 + 2 = 6
      
      expect(result.baseScore).toBe(4);
      expect(result.conditionScores[0].points).toBe(2);
      expect(result.totalScore).toBe(6);
      expect(result.targetScore).toBe(8); // from condition target contribution
    });
  });
});