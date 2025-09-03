import { useScoringEditorStore } from '../../stores/scoringEditorStore';
import type { FormulaTemplate } from '../../types/scoring-formulas';

const FORMULA_TEMPLATES: FormulaTemplate[] = [
  {
    id: 'adjacency_bonus',
    name: 'Adjacency Bonus',
    category: 'adjacency',
    description: 'Score bonus for zones adjacent to specific types',
    explanation: 'Awards points for commercial zones next to residential zones',
    code: `// Adjacency Bonus Example
function calculateScore(context: ScoringContext): number {
  const { getAllTiles, getAdjacentTiles } = context;
  
  let bonus = 0;
  const tiles = getAllTiles();
  
  for (const tile of tiles) {
    if (tile.type === 'commercial') {
      const adjacent = getAdjacentTiles(tile.row, tile.col);
      const residentialNearby = adjacent.filter(t => t.type === 'residential').length;
      bonus += residentialNearby * 2; // 2 points per adjacent residential
    }
  }
  
  return bonus;
}`,
  },
  {
    id: 'cluster_bonus',
    name: 'Cluster Scoring',
    category: 'cluster',
    description: 'Score based on connected zone clusters',
    explanation: 'Awards bonus points for large connected clusters of the same type',
    code: `// Cluster Bonus Example  
function calculateScore(context: ScoringContext): number {
  const { findClusters } = context;
  
  let totalBonus = 0;
  const zoneTypes = ['residential', 'commercial', 'industrial', 'park'];
  
  for (const zoneType of zoneTypes) {
    const clusters = findClusters(zoneType);
    
    // Bonus for large clusters
    for (const cluster of clusters) {
      if (cluster.length >= 4) {
        totalBonus += cluster.length; // 1 point per tile in large clusters
      }
    }
  }
  
  return totalBonus;
}`,
  },
  {
    id: 'road_network',
    name: 'Road Network',
    category: 'road', 
    description: 'Score based on road connectivity',
    explanation: 'Awards points for well-connected road networks',
    code: `// Road Network Bonus
function calculateScore(context: ScoringContext): number {
  const { findRoadNetworks } = context;
  
  const networks = findRoadNetworks();
  
  if (networks.length === 0) return 0;
  
  // Find the largest network
  const largestNetwork = max(networks.map(n => n.segments.length));
  
  // Bonus for having one large connected network
  return largestNetwork >= 6 ? 10 : largestNetwork;
}`,
  },
  {
    id: 'diversity_bonus',
    name: 'Zone Diversity',
    category: 'diversity',
    description: 'Score for having diverse zone types',
    explanation: 'Awards bonus points for cities with all zone types represented',
    code: `// Zone Diversity Bonus
function calculateScore(context: ScoringContext): number {
  const { countZonesOfType } = context;
  
  const zoneTypes = ['residential', 'commercial', 'industrial', 'park'];
  const zoneCounts = zoneTypes.map(type => countZonesOfType(type));
  
  // Count how many zone types are present
  const typesPresent = zoneCounts.filter(count => count > 0).length;
  
  // Bonus for diversity
  if (typesPresent === 4) return 15; // All types present
  if (typesPresent === 3) return 8;  // Three types
  if (typesPresent === 2) return 3;  // Two types
  
  return 0;
}`,
  },
  {
    id: 'balanced_development',
    name: 'Balanced Development',
    category: 'diversity',
    description: 'Score for balanced zone distribution',
    explanation: 'Awards points based on how evenly distributed zone types are',
    code: `// Balanced Development
function calculateScore(context: ScoringContext): number {
  const { countZonesOfType } = context;
  
  const residential = countZonesOfType('residential');
  const commercial = countZonesOfType('commercial');
  const industrial = countZonesOfType('industrial');
  
  // Bonus based on the minimum (most limiting factor)
  const balance = min([residential, commercial, industrial]);
  
  return balance * 3; // 3 points per balanced zone
}`,
  },
  {
    id: 'geometric_pattern',
    name: 'Geometric Pattern',
    category: 'geometric',
    description: 'Score for specific spatial arrangements',
    explanation: 'Awards bonus for parks surrounded by other zones',
    code: `// Geometric Pattern Example
function calculateScore(context: ScoringContext): number {
  const { getAllTiles, getAdjacentTiles } = context;
  
  let bonus = 0;
  const tiles = getAllTiles();
  
  for (const tile of tiles) {
    if (tile.type === 'park') {
      const adjacent = getAdjacentTiles(tile.row, tile.col);
      
      // Bonus if park is completely surrounded
      if (adjacent.length >= 3) {
        const nonParkNeighbors = adjacent.filter(t => t.type !== 'park').length;
        if (nonParkNeighbors === adjacent.length) {
          bonus += 5; // 5 points for surrounded parks
        }
      }
    }
  }
  
  return bonus;
}`,
  },
];

export function FormulaTemplates() {
  const { loadTemplate } = useScoringEditorStore();

  const handleTemplateSelect = (template: FormulaTemplate) => {
    loadTemplate(template);
  };

  return (
    <div className="space-y-2">
      {FORMULA_TEMPLATES.map((template) => (
        <div 
          key={template.id}
          className="card bg-base-100 shadow-sm border border-base-300 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleTemplateSelect(template)}
        >
          <div className="card-body p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-base-content">{template.name}</h4>
                <p className="text-sm text-base-content/70 mt-1">{template.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`badge badge-sm ${
                    template.category === 'adjacency' ? 'badge-primary' :
                    template.category === 'cluster' ? 'badge-secondary' :
                    template.category === 'road' ? 'badge-accent' :
                    template.category === 'diversity' ? 'badge-info' :
                    'badge-neutral'
                  }`}>
                    {template.category}
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-xs text-base-content/60 mt-4 p-2 bg-base-200 rounded">
        💡 Click any template to load it into the editor. You can then modify it to create your custom scoring logic.
      </div>
    </div>
  );
}