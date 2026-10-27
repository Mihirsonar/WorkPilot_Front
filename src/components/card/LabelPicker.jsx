import React, { useState } from "react";
import { Tag, X, Check } from "lucide-react";

const LABEL_COLORS = [
  { name: "Green", color: "#22c55e" },
  { name: "Yellow", color: "#eab308" },
  { name: "Orange", color: "#f97316" },
  { name: "Red", color: "#ef4444" },
  { name: "Purple", color: "#a855f7" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Cyan", color: "#06b6d4" },
  { name: "Pink", color: "#ec4899" },
];

function LabelPicker({ selectedLabels = [], onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customName, setCustomName] = useState("");

  const isSelected = (color) =>
    selectedLabels.some((l) => l.color === color);

  const toggleLabel = (label) => {
    if (isSelected(label.color)) {
      onChange(selectedLabels.filter((l) => l.color !== label.color));
    } else {
      onChange([
        ...selectedLabels,
        { name: customName || label.name, color: label.color },
      ]);
    }
    setCustomName("");
  };

  const removeLabel = (color) => {
    onChange(selectedLabels.filter((l) => l.color !== color));
  };

  return (
    <div className="relative">
      {/* Selected labels display */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedLabels.map((label) => (
          <span
            key={label.color}
            className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-medium text-white"
            style={{ backgroundColor: label.color + "30", borderColor: label.color + "40", borderWidth: 1 }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            {label.name}
            <button
              onClick={() => removeLabel(label.color)}
              className="ml-0.5 p-0.5 rounded hover:bg-white/10 transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50/70 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
      >
        <Tag size={13} />
        <span>{isOpen ? "Close Labels" : "Add Labels"}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-gray-200 bg-white shadow-xl p-3 z-50">
          <p className="text-[11px] text-gray-400 font-semibold mb-2 uppercase tracking-wider">
            Select Labels
          </p>

          {/* Custom name input */}
          <input
            type="text"
            placeholder="Custom label name..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full mb-2.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900"
          />

          <div className="space-y-1">
            {LABEL_COLORS.map((label) => {
              const selected = isSelected(label.color);
              return (
                <button
                  key={label.color}
                  onClick={() => toggleLabel(label)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition ${
                    selected
                      ? "bg-gray-100 ring-1 ring-gray-300"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className="h-5 flex-1 rounded-md"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="text-xs text-gray-600 w-14 text-left font-medium">
                    {label.name}
                  </span>
                  {selected && (
                    <Check size={13} className="text-gray-900" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LabelPicker;
