import React, { useState } from "react";
import { useDeckEditorStore } from "../../stores/deckEditorStore";
import { ZoneType } from "../../types/deck";

export default function ZoneTypeEditor() {
  const { currentDeck, updateDeckMetadata } = useDeckEditorStore();
  const [newZoneType, setNewZoneType] = useState<Partial<ZoneType>>({
    name: "",
    color: "#60a5fa",
    description: "",
  });

  if (!currentDeck) return null;

  const handleAddZoneType = () => {
    if (!newZoneType.name?.trim()) return;

    const zoneType: ZoneType = {
      id: newZoneType.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      name: newZoneType.name.trim(),
      color: newZoneType.color || "#60a5fa",
      description: newZoneType.description?.trim() || "",
    };

    // Check if zone type already exists
    if (currentDeck.zoneTypes.some((zt) => zt.id === zoneType.id)) {
      alert("A zone type with this name already exists");
      return;
    }

    updateDeckMetadata({
      zoneTypes: [...currentDeck.zoneTypes, zoneType],
    });

    // Reset form
    setNewZoneType({
      name: "",
      color: "#60a5fa",
      description: "",
    });
  };

  const handleUpdateZoneType = (index: number, updates: Partial<ZoneType>) => {
    const updatedZoneTypes = currentDeck.zoneTypes.map((zt, i) =>
      i === index ? { ...zt, ...updates } : zt
    );

    updateDeckMetadata({
      zoneTypes: updatedZoneTypes,
    });
  };

  const handleDeleteZoneType = (index: number) => {
    const zoneType = currentDeck.zoneTypes[index];

    // Check if this zone type is used in any cards
    const isUsedInCards = currentDeck.baseCards.some((card) =>
      card.cells.some((row) => row.some((cell) => cell.type === zoneType.id))
    );

    if (isUsedInCards) {
      const confirmDelete = confirm(
        `This zone type is used in ${
          currentDeck.baseCards.filter((card) =>
            card.cells.some((row) =>
              row.some((cell) => cell.type === zoneType.id)
            )
          ).length
        } card(s). Deleting it will break those cards. Continue?`
      );

      if (!confirmDelete) return;
    }

    const updatedZoneTypes = currentDeck.zoneTypes.filter(
      (_, i) => i !== index
    );
    updateDeckMetadata({
      zoneTypes: updatedZoneTypes,
    });
  };

  const presetZoneTypes = [
    { name: "Residential", color: "#60a5fa", description: "Housing areas" },
    { name: "Commercial", color: "#f59e0b", description: "Business districts" },
    {
      name: "Industrial",
      color: "#6b7280",
      description: "Manufacturing zones",
    },
    { name: "Park", color: "#34d399", description: "Green spaces" },
    { name: "Casino", color: "#dc2626", description: "Gaming floors" },
    { name: "Hotel", color: "#7c3aed", description: "Accommodation" },
    {
      name: "Entertainment",
      color: "#06b6d4",
      description: "Shows and venues",
    },
    { name: "Dining", color: "#f59e0b", description: "Restaurants and bars" },
    { name: "Fields", color: "#84cc16", description: "Farmland and crops" },
    { name: "Livestock", color: "#a78bfa", description: "Animal farming" },
    { name: "Orchards", color: "#34d399", description: "Fruit trees" },
    { name: "Buildings", color: "#f59e0b", description: "Farm buildings" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-700">Zone Types</h4>
        <span className="text-xs text-gray-500">
          {currentDeck.zoneTypes.length} types
        </span>
      </div>

      {/* Existing Zone Types */}
      <div className="space-y-3">
        {currentDeck.zoneTypes.map((zoneType, index) => (
          <div
            key={zoneType.id}
            className="group border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start gap-3">
              <input
                type="color"
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer flex-shrink-0"
                value={zoneType.color}
                onChange={(e) =>
                  handleUpdateZoneType(index, { color: e.target.value })
                }
                title="Zone color"
              />

              <div className="flex-1 min-w-0 space-y-2">
                <input
                  type="text"
                  className="w-full text-sm font-medium bg-transparent border-0 p-0 focus:ring-0 focus:outline-none focus:bg-white focus:border focus:border-blue-500 focus:rounded focus:px-2 focus:py-1"
                  value={zoneType.name}
                  onChange={(e) =>
                    handleUpdateZoneType(index, { name: e.target.value })
                  }
                  placeholder="Zone name"
                />
                <input
                  type="text"
                  className="w-full text-xs text-gray-600 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none focus:bg-white focus:border focus:border-blue-500 focus:rounded focus:px-2 focus:py-1"
                  placeholder="Optional description"
                  value={zoneType.description || ""}
                  onChange={(e) =>
                    handleUpdateZoneType(index, { description: e.target.value })
                  }
                />
              </div>

              <button
                onClick={() => handleDeleteZoneType(index)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 transition-opacity"
                title="Delete zone type"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Zone Type - Collapsed */}
      <div className="border-t pt-4">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
            <svg
              className="w-4 h-4 transition-transform group-open:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            Add Zone Type
          </summary>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                value={newZoneType.color}
                onChange={(e) =>
                  setNewZoneType({ ...newZoneType, color: e.target.value })
                }
                title="Zone color"
              />
              <input
                type="text"
                className="input input-bordered input-sm flex-1"
                placeholder="Zone name"
                value={newZoneType.name}
                onChange={(e) =>
                  setNewZoneType({ ...newZoneType, name: e.target.value })
                }
              />
            </div>

            <input
              type="text"
              className="input input-bordered input-sm w-full"
              placeholder="Description (optional)"
              value={newZoneType.description}
              onChange={(e) =>
                setNewZoneType({ ...newZoneType, description: e.target.value })
              }
            />

            <button
              onClick={handleAddZoneType}
              disabled={!newZoneType.name?.trim()}
              className="btn btn-primary btn-sm w-full"
            >
              Add Zone Type
            </button>
          </div>
        </details>

        {/* Preset Zone Types */}
        <div className="mt-4">
          <h6 className="text-xs font-medium text-gray-600 mb-2">
            Quick Add from Presets:
          </h6>
          <div className="grid grid-cols-2 gap-2">
            {presetZoneTypes.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setNewZoneType(preset)}
                className="btn btn-xs btn-outline justify-start gap-2"
                disabled={currentDeck.zoneTypes.some(
                  (zt) => zt.name.toLowerCase() === preset.name.toLowerCase()
                )}
              >
                <div
                  className="w-3 h-3 rounded border"
                  style={{ backgroundColor: preset.color }}
                />
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Usage Info */}
      {currentDeck.baseCards.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
          <div className="font-medium text-blue-900 mb-1">
            Zone Usage in Cards:
          </div>
          {currentDeck.zoneTypes.map((zoneType) => {
            const usageCount = currentDeck.baseCards.reduce(
              (count, card) =>
                count +
                card.cells.flat().filter((cell) => cell.type === zoneType.id)
                  .length,
              0
            );
            return usageCount > 0 ? (
              <div key={zoneType.id} className="text-blue-700">
                {zoneType.name}: {usageCount} cell{usageCount !== 1 ? "s" : ""}
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
