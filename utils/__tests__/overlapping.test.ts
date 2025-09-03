import { describe, it, expect } from 'vitest';
import { findClusters, findRoadNetworks, calculateBaseScore } from '../scoring';
import { Card, CellType } from '../../types/game';

describe('Overlapping Card Scoring', () => {
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

  describe('Tile Overlap Handling', () => {
    it('should only count visible tiles when cards overlap', () => {
      const board = [
        // Base card at (0,0)
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'residential' }],
          [{ type: 'commercial' }, { type: 'commercial' }]
        ]),
        // Overlapping card at (1,0) - partially covers first card
        createCard('card2', 1, 0, [
          [{ type: 'industrial' }, { type: 'industrial' }],
          [{ type: 'park' }, { type: 'park' }]
        ])
      ];

      const clusters = findClusters(board);
      
      // The overlapping positions should only count tiles from card2 (on top)
      // Position (1,0): industrial from card2 (not residential from card1)
      // Position (1,1): park from card2 (not commercial from card1)
      
      const residentialCluster = clusters.find(c => c.type === 'residential');
      const commercialCluster = clusters.find(c => c.type === 'commercial');
      const industrialCluster = clusters.find(c => c.type === 'industrial');
      const parkCluster = clusters.find(c => c.type === 'park');
      
      // Residential should only have 1 tile (0,0) - (1,0) is covered by card2
      expect(residentialCluster?.size).toBe(1);
      
      // Commercial should only have 1 tile (0,1) - (1,1) is covered by card2  
      expect(commercialCluster?.size).toBe(1);
      
      // Industrial should have 2 tiles from card2
      expect(industrialCluster?.size).toBe(2);
      
      // Park should have 2 tiles from card2
      expect(parkCluster?.size).toBe(2);
    });

    it('should handle complete card overlap correctly', () => {
      const board = [
        // Base card at (0,0)
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'residential' }],
          [{ type: 'residential' }, { type: 'residential' }]
        ]),
        // Card completely covering the first one
        createCard('card2', 0, 0, [
          [{ type: 'commercial' }, { type: 'commercial' }],
          [{ type: 'commercial' }, { type: 'commercial' }]
        ])
      ];

      const clusters = findClusters(board);
      
      // Should only see tiles from card2 (on top)
      const residentialCluster = clusters.find(c => c.type === 'residential');
      const commercialCluster = clusters.find(c => c.type === 'commercial');
      
      // No residential tiles should be visible
      expect(residentialCluster).toBeUndefined();
      
      // All 4 commercial tiles should be from card2
      expect(commercialCluster?.size).toBe(4);
    });

    it('should handle road overlaps correctly', () => {
      const board = [
        // Base card with roads
        createCard('card1', 0, 0, [
          [{ type: 'residential', roads: [[0, 1]] }, { type: 'commercial', roads: [[0, 2]] }],
          [{ type: 'park' }, { type: 'industrial' }]
        ]),
        // Overlapping card with different roads
        createCard('card2', 1, 0, [
          [{ type: 'industrial', roads: [[1, 3]] }, { type: 'park' }],
          [{ type: 'commercial', roads: [[2, 3]] }, { type: 'residential' }]
        ])
      ];

      const networks = findRoadNetworks(board);
      
      // Should only count roads from visible tiles:
      // - (0,0): road from card1 (visible) - road [0,1] (top to right)
      // - (1,0): road from card2 (covers card1 at this position) - road [1,3] (right to left)
      // - (1,1): road from card2 - road [2,3] (bottom to left)
      
      // Analysis of connections:
      // (0,0) [0,1] touches right edge=1, (1,0) [1,3] touches left edge=3
      // These DO connect since they share the edge between tiles (0,0) and (1,0)
      // (1,1) [2,3] touches bottom=2 and left=3 edges, doesn't connect to the above
      
      // So we expect: 2 networks total
      // Network 1: (0,0) and (1,0) connected - size 2
      // Network 2: (1,1) standalone - size 1
      expect(networks.length).toBe(2);
      
      // Find the networks by size
      const largeNetwork = networks.find(n => n.size === 2);
      const smallNetwork = networks.find(n => n.size === 1);
      
      expect(largeNetwork).toBeDefined();
      expect(smallNetwork).toBeDefined();
      
      expect(largeNetwork!.size).toBe(2);
      expect(smallNetwork!.size).toBe(1);
    });

    it('should calculate base score correctly with overlapping cards', () => {
      const board = [
        // Base card
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'residential' }],
          [{ type: 'residential' }, { type: 'residential' }]
        ]),
        // Partial overlap
        createCard('card2', 1, 0, [
          [{ type: 'commercial' }, { type: 'commercial' }],
          [{ type: 'park', roads: [[0, 2]] }, { type: 'industrial' }]
        ])
      ];

      const result = calculateBaseScore(board);
      
      // Expected visible tiles:
      // - (0,0): residential from card1
      // - (0,1): residential from card1  
      // - (1,0): commercial from card2 (covers residential from card1)
      // - (1,1): park from card2 (covers residential from card1)
      // - (2,0): commercial from card2
      // - (2,1): industrial from card2
      
      // Largest clusters:
      // - residential: 2 tiles (only from card1, non-overlapped areas)
      // - commercial: 2 tiles (from card2)
      // - park: 1 tile (from card2)
      // - industrial: 1 tile (from card2)
      
      expect(result.clusterScores.residential).toBe(2);
      expect(result.clusterScores.commercial).toBe(2);
      expect(result.clusterScores.park).toBe(1);
      expect(result.clusterScores.industrial).toBe(1);
      
      // Road penalty: -1 for one road network
      expect(result.roadPenalty).toBe(-1);
      
      // Base score: 2 + 2 + 1 + 1 - 1 = 5
      expect(result.baseScore).toBe(5);
    });

    it('should handle three-layer overlap correctly', () => {
      const board = [
        // Bottom layer
        createCard('card1', 0, 0, [
          [{ type: 'residential' }, { type: 'residential' }],
          [{ type: 'residential' }, { type: 'residential' }]
        ]),
        // Middle layer
        createCard('card2', 0, 0, [
          [{ type: 'commercial' }, { type: 'commercial' }],
          [{ type: 'commercial' }, { type: 'commercial' }]
        ]),
        // Top layer (only partial overlap)
        createCard('card3', 1, 1, [
          [{ type: 'park' }, { type: 'park' }],
          [{ type: 'industrial' }, { type: 'industrial' }]
        ])
      ];

      const clusters = findClusters(board);
      
      // Expected visible tiles:
      // - (0,0), (0,1), (1,0): commercial from card2
      // - (1,1): park from card3 (covers commercial from card2)
      // - (2,1), (2,2): park and industrial from card3
      
      const residentialCluster = clusters.find(c => c.type === 'residential');
      const commercialCluster = clusters.find(c => c.type === 'commercial');
      const parkCluster = clusters.find(c => c.type === 'park');
      const industrialCluster = clusters.find(c => c.type === 'industrial');
      
      // No residential should be visible (completely covered)
      expect(residentialCluster).toBeUndefined();
      
      // Commercial should have 3 tiles (card2 minus the overlap from card3)
      expect(commercialCluster?.size).toBe(3);
      
      // Park should have 2 tiles from card3
      expect(parkCluster?.size).toBe(2);
      
      // Industrial should have 2 tiles from card3
      expect(industrialCluster?.size).toBe(2);
    });
  });
});