import React from "react";
import { Check, Ban } from "lucide-react";

export const COVER_COLORS = [
  { name: "None", value: "" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Purple", value: "#a855f7" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Slate", value: "#475569" },
];

function CoverColorPicker({ coverColor = "", onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
        Card Cover
      </label>
      <div className="flex flex-wrap gap-2">
        {COVER_COLORS.map((c) => {
          const isSelected = (coverColor || "") === c.value;
          if (!c.value) {
            return (
              <button
                key="none"
                type="button"
                onClick={() => onChange("")}
                title="Remove cover"
                className={`h-7 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
                  isSelected
                    ? "border-gray-900 bg-gray-100 text-gray-900 font-bold"
                    : "border-gray-200 bg-gray-50/70 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Ban size={11} />
                None
              </button>
            );
          }
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange(c.value)}
              title={c.name}
              className={`h-7 w-9 rounded-lg flex items-center justify-center transition ${
                isSelected
                  ? "ring-2 ring-gray-900 ring-offset-2 ring-offset-white scale-105"
                  : "hover:opacity-90 hover:scale-105"
              }`}
              style={{ backgroundColor: c.value }}
            >
              {isSelected && <Check size={13} className="text-white drop-shadow-xs" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CoverColorPicker;
