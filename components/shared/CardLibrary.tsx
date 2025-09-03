import React, { useEffect, useState } from 'react';
import { useCardLibraryStore } from '../../stores/cardLibraryStore';
import { useDeckEditorStore } from '../../stores/deckEditorStore';
import CardPreview from '../CardPreview';
import { CardDefinition } from '../../types/deck';

export default function CardLibrary() {
  const {
    cardTemplates,
    initializePresets,
    getTemplatesByCategory,
    addTemplate,
    deleteTemplate,
  } = useCardLibraryStore();
  
  const { addCardToDeck, openCardBuilder } = useDeckEditorStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initializePresets();
  }, [initializePresets]);

  const categories = [
    { id: 'all', name: 'All Cards', count: cardTemplates.length },
    { id: 'residential', name: 'Residential', count: getTemplatesByCategory('residential').length },
    { id: 'commercial', name: 'Commercial', count: getTemplatesByCategory('commercial').length },
    { id: 'industrial', name: 'Industrial', count: getTemplatesByCategory('industrial').length },
    { id: 'mixed', name: 'Mixed Use', count: getTemplatesByCategory('mixed').length },
    { id: 'roads', name: 'Roads', count: getTemplatesByCategory('roads').length },
  ];

  const filteredTemplates = cardTemplates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleAddToCurrentDeck = (template: any) => {
    const cardToAdd: CardDefinition = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: template.card.name,
      cells: template.card.cells,
      count: 1,
    };
    
    addCardToDeck(cardToAdd);
  };

  const handleEditTemplate = (template: any) => {
    const cardToEdit: CardDefinition = {
      id: template.id,
      name: template.card.name,
      cells: template.card.cells,
      count: 1,
    };
    
    openCardBuilder(cardToEdit);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = cardTemplates.find(t => t.id === templateId);
    if (!template?.isUserCreated) {
      alert('Cannot delete preset templates');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this template?');
    if (confirmDelete) {
      deleteTemplate(templateId);
    }
  };

  const handleSaveCurrentAsTemplate = () => {
    // This would be called from the card builder to save current card as template
    // For now, just show a placeholder
    alert('Feature coming soon: Save current card design as template');
  };

  if (cardTemplates.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="loading loading-spinner loading-sm"></div>
        <p className="text-sm text-gray-500 mt-2">Loading card library...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="form-control">
        <input
          type="text"
          className="input input-bordered input-sm"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className="tabs tabs-boxed tabs-xs">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`tab tab-xs ${selectedCategory === category.id ? 'tab-active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="hidden sm:inline">{category.name}</span>
            <span className="sm:hidden">{category.name.split(' ')[0]}</span>
            <span className="ml-1 opacity-60">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-sm">No cards found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="btn btn-xs btn-ghost mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Card Preview */}
                <div className="flex-shrink-0">
                  <CardPreview
                    card={{...template.card, id: template.id, count: 1}}
                    width={60}
                    height={60}
                    showBorder={true}
                    borderColor="border-gray-300"
                    className="group-hover:shadow-sm transition-shadow"
                  />
                </div>

                {/* Card Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`
                          inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
                          ${template.category === 'residential' ? 'bg-blue-100 text-blue-700' : ''}
                          ${template.category === 'commercial' ? 'bg-orange-100 text-orange-700' : ''}
                          ${template.category === 'industrial' ? 'bg-gray-100 text-gray-700' : ''}
                          ${template.category === 'mixed' ? 'bg-purple-100 text-purple-700' : ''}
                          ${template.category === 'roads' ? 'bg-yellow-100 text-yellow-700' : ''}
                        `}>
                          {template.category}
                        </span>
                        {!template.isUserCreated && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                            preset
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleAddToCurrentDeck(template)}
                        className="btn btn-xs btn-primary"
                        title="Add to current deck"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="btn btn-xs btn-secondary"
                        title="Edit template"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {template.isUserCreated && (
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="btn btn-xs btn-error"
                          title="Delete template"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-gray-200">
        <button
          onClick={() => openCardBuilder()}
          className="btn btn-sm btn-outline w-full"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Card
        </button>
      </div>
    </div>
  );
}