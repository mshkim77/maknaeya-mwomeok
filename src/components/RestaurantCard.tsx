"use client";

import { Restaurant, formatDistance, getPriceRangeSymbol } from "@/lib/mockData";

interface RestaurantCardProps {
  restaurant: Restaurant;
  isNew?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  한식: "bg-red-100 text-red-700",
  중식: "bg-yellow-100 text-yellow-700",
  일식: "bg-blue-100 text-blue-700",
  양식: "bg-green-100 text-green-700",
  분식: "bg-orange-100 text-orange-700",
  "카페/디저트": "bg-purple-100 text-purple-700",
  "치킨/피자": "bg-pink-100 text-pink-700",
};

const CATEGORY_BG: Record<string, string> = {
  한식: "from-red-400 to-orange-400",
  중식: "from-yellow-400 to-amber-500",
  일식: "from-blue-400 to-indigo-400",
  양식: "from-green-400 to-emerald-500",
  분식: "from-orange-400 to-red-400",
  "카페/디저트": "from-purple-400 to-pink-400",
  "치킨/피자": "from-pink-400 to-rose-400",
};

const CATEGORY_EMOJI: Record<string, string> = {
  한식: "🍚",
  중식: "🥡",
  일식: "🍣",
  양식: "🍝",
  분식: "🍜",
  "카페/디저트": "☕",
  "치킨/피자": "🍗",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(rating)
              ? "text-yellow-400"
              : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function RestaurantCard({
  restaurant,
  isNew,
}: RestaurantCardProps) {
  const gradientClass =
    CATEGORY_BG[restaurant.category] ?? "from-gray-400 to-gray-500";

  return (
    <div
      className={`card overflow-hidden w-full ${
        isNew ? "animate-card-reveal" : ""
      }`}
    >
      {/* Header image area */}
      <div
        className={`h-36 bg-gradient-to-br ${gradientClass} relative flex items-center justify-center`}
      >
        <span className="text-7xl filter drop-shadow-lg">
          {CATEGORY_EMOJI[restaurant.category]}
        </span>
        {/* Open/Closed badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
            restaurant.openNow
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {restaurant.openNow ? "영업중" : "영업종료"}
        </div>
        {/* Category badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
            CATEGORY_COLORS[restaurant.category] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {restaurant.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            {restaurant.name}
          </h2>
          <span className="text-sm font-semibold text-gray-500 ml-2 mt-0.5 shrink-0">
            {getPriceRangeSymbol(restaurant.priceRange)}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={restaurant.rating} />
          <span className="text-sm font-bold text-gray-800">
            {restaurant.rating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-400">
            ({restaurant.reviewCount.toLocaleString()}개)
          </span>
        </div>

        {/* Info row */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium text-orange-500">
              {formatDistance(restaurant.distance)}
            </span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="truncate">{restaurant.address}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {restaurant.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full border border-orange-100"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold rounded-xl text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            전화하기
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-xl text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            길찾기
          </button>
        </div>
      </div>
    </div>
  );
}
