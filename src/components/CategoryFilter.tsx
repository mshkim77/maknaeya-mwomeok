"use client";

import { FOOD_CATEGORIES, FoodCategory } from "@/lib/mockData";

interface CategoryFilterProps {
  selected: FoodCategory[];
  onChange: (category: FoodCategory) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {FOOD_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`category-chip whitespace-nowrap flex items-center gap-1.5 ${
            selected.includes(cat.id) ? "active" : "inactive"
          }`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
