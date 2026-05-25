"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Restaurant, loadRestaurant } from "@/lib/restaurant";

const CATEGORY_EMOJI: Record<string, string> = {
  한식: "🍚", 중식: "🥡", 일식: "🍣", 양식: "🍝",
  분식: "🍜", "카페/디저트": "☕", "치킨/피자": "🍗",
  카페: "☕", 치킨: "🍗", 피자: "🍕",
};

function getEmoji(category: string) {
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (category.includes(key)) return emoji;
  }
  return "🍽️";
}

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const r = loadRestaurant();
    if (r && r.id === id) {
      setRestaurant(r);
    }
    setReady(true);
  }, [id]);

  if (!ready) return null;

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F172A] gap-4">
        <span className="text-6xl">😕</span>
        <p className="text-[#F1F5F9] font-bold text-lg">식당 정보를 찾을 수 없어요</p>
        <button onClick={() => router.push("/main")}
          className="btn-primary px-6 py-3 font-bold">
          다시 추천받기
        </button>
      </div>
    );
  }

  const emoji = getEmoji(restaurant.category);
  const displayAddress = restaurant.roadAddress || restaurant.address;

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      {/* Hero */}
      <div className="relative px-6 pt-14 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 50%, #164E63 100%)" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, #4F46E5 0%, transparent 70%)" }} />

        <button onClick={() => router.push("/main")}
          className="absolute top-5 left-4 flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F1F5F9] transition-colors text-sm font-semibold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          돌아가기
        </button>

        <div className="flex flex-col items-center mt-4 gap-3">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center border border-white/10"
            style={{ background: "rgba(79,70,229,0.2)", boxShadow: "0 0 40px rgba(79,70,229,0.3)" }}>
            <span className="text-5xl">{emoji}</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-semibold text-[#06B6D4] tracking-widest uppercase">{restaurant.category}</span>
            <h1 className="text-[#F1F5F9] text-2xl font-black mt-1 tracking-tight">{restaurant.name}</h1>
            {restaurant.distance > 0 && (
              <p className="text-[#94A3B8] text-sm mt-1">
                📍 {restaurant.distance < 1000
                  ? `${restaurant.distance}m`
                  : `${(restaurant.distance / 1000).toFixed(1)}km`} 거리
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 카드 영역 */}
      <div className="flex-1 -mt-8 bg-[#0F172A] rounded-t-3xl px-4 pt-5 pb-10 flex flex-col gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

        {/* 주소 */}
        {displayAddress && (
          <div className="rounded-2xl px-4 py-4 flex items-start gap-3 border border-white/6"
            style={{ background: "rgba(30,41,59,0.6)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(79,70,229,0.2)" }}>
              <svg className="w-5 h-5 text-[#818CF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[#475569] text-xs mb-0.5 font-medium uppercase tracking-wider">주소</p>
              <p className="text-[#F1F5F9] text-sm font-medium">{displayAddress}</p>
              {restaurant.roadAddress && restaurant.address && restaurant.roadAddress !== restaurant.address && (
                <p className="text-[#475569] text-xs mt-0.5">{restaurant.address}</p>
              )}
            </div>
          </div>
        )}

        {/* 전화번호 */}
        {restaurant.phone && (
          <div className="rounded-2xl px-4 py-4 flex items-center gap-3 border border-white/6"
            style={{ background: "rgba(30,41,59,0.6)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(6,182,212,0.15)" }}>
              <svg className="w-5 h-5 text-[#06B6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-[#475569] text-xs mb-0.5 font-medium uppercase tracking-wider">전화번호</p>
              <p className="text-[#F1F5F9] text-sm font-medium">{restaurant.phone}</p>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-3 mt-1">
          {restaurant.phone && (
            <a href={`tel:${restaurant.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-4 text-[#F1F5F9] font-bold rounded-2xl text-sm border border-white/6 hover:border-[#06B6D4]/40 transition-colors"
              style={{ background: "rgba(30,41,59,0.8)" }}>
              <svg className="w-4 h-4 text-[#06B6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              전화하기
            </a>
          )}
          {restaurant.placeUrl && (
            <a href={restaurant.placeUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 text-[#F1F5F9] font-bold rounded-2xl text-sm border border-white/6 hover:border-[#818CF8]/40 transition-colors"
              style={{ background: "rgba(30,41,59,0.8)" }}>
              <svg className="w-4 h-4 text-[#818CF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              카카오맵
            </a>
          )}
        </div>

        <button onClick={() => router.push("/main")}
          className="btn-primary w-full py-4 font-bold flex items-center justify-center gap-2 text-sm mt-1">
          🎲 다시 추천받기
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
        <div className="w-10 h-10 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
