"use client";

import { FOOD_CATEGORIES, FoodCategory } from "@/lib/mockData";

interface CategoryGridProps {
  selected: FoodCategory[];
  onChange: (selected: FoodCategory[]) => void;
}

const ALL_IDS = FOOD_CATEGORIES.map((c) => c.id);

export default function CategoryGrid({ selected, onChange }: CategoryGridProps) {
  const isAll = selected.length === ALL_IDS.length;

  const toggleCategory = (id: FoodCategory) => {
    const next = selected.includes(id)
      ? selected.filter((c) => c !== id)
      : [...selected, id];
    onChange(next);
  };

  const toggleAll = () => {
    onChange(isAll ? [] : [...ALL_IDS]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#F1F5F9] font-black text-base tracking-tight">
          카테고리 선택{" "}
          <span className="text-[#475569] font-normal text-xs">(복수 선택 가능)</span>
        </h2>
        {!isAll && selected.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-xs font-semibold text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
          >
            선택 초기화
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {/* 전체 카드 */}
        <button
          onClick={toggleAll}
          className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 aspect-square
            transition-all duration-200 cursor-pointer border
            ${isAll
              ? "border-[#4F46E5]/60"
              : "border-white/6 hover:border-white/15"
            }`}
          style={{
            background: isAll
              ? "linear-gradient(135deg, rgba(79,70,229,0.25) 0%, rgba(6,182,212,0.15) 100%)"
              : "rgba(30,41,59,0.7)",
          }}
        >
          <span className="text-2xl">🎲</span>
          <div className="text-center">
            <p className={`text-xs font-bold leading-tight whitespace-nowrap transition-colors
              ${isAll ? "text-[#818CF8]" : "text-[#94A3B8]"}`}>
              전체
            </p>
            <p className={`text-[9px] mt-0.5 transition-colors
              ${isAll ? "text-[#06B6D4]" : "text-[#475569]"}`}>
              전체 선택
            </p>
          </div>
          {isAll && (
            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #4F46E5, #06B6D4)" }}>
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>

        {/* 개별 카테고리 카드 */}
        {FOOD_CATEGORIES.map((cat) => {
          const isSelected = selected.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 aspect-square
                transition-all duration-200 cursor-pointer border
                ${isSelected
                  ? "border-[#4F46E5]/60 scale-95"
                  : "border-white/6 hover:border-white/15 hover:scale-[0.97]"
                }`}
              style={{
                background: isSelected
                  ? "linear-gradient(135deg, rgba(79,70,229,0.25) 0%, rgba(6,182,212,0.15) 100%)"
                  : "rgba(30,41,59,0.7)",
              }}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div className="text-center">
                <p
                  className={`font-bold leading-tight text-center whitespace-nowrap transition-colors
                    ${isSelected ? "text-[#818CF8]" : "text-[#94A3B8]"}`}
                  style={{ fontSize: cat.label.length > 4 ? "9px" : "11px" }}
                >
                  {cat.label}
                </p>
                <p className={`text-[9px] mt-0.5 transition-colors
                  ${isSelected ? "text-[#06B6D4]" : "text-[#475569]"}`}>
                  주변 {cat.nearbyCount}곳
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #4F46E5, #06B6D4)" }}>
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 선택 요약 */}
      <div className="mt-3 h-5">
        {isAll && (
          <p className="text-xs font-semibold text-[#06B6D4]">✨ 모든 카테고리에서 랜덤 추천</p>
        )}
        {!isAll && selected.length > 0 && (
          <p className="text-xs text-[#06B6D4] font-semibold">
            {selected.join(" · ")} 중에서 추천
          </p>
        )}
        {!isAll && selected.length === 0 && (
          <p className="text-xs text-[#334155]">카테고리를 선택하거나 전체를 눌러보세요</p>
        )}
      </div>
    </div>
  );
}
