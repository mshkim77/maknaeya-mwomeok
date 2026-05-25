"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FOOD_SPLASH = [
  { emoji: "🍚", label: "한식" },
  { emoji: "🥡", label: "중식" },
  { emoji: "🍣", label: "일식" },
  { emoji: "🍝", label: "양식" },
  { emoji: "🍜", label: "분식" },
  { emoji: "🍗", label: "치킨/피자" },
  { emoji: "☕", label: "카페/디저트" },
  { emoji: "🎲", label: "오늘 뭐먹지?" },
];

const TOTAL_MS = 2000;
const INTERVAL_MS = Math.floor((TOTAL_MS * 0.75) / FOOD_SPLASH.length); // 8개를 2.25초 안에, 남은 0.75초는 완성 후 대기

export default function LandingPage() {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 카드 순차 등장
    const cardTimer = setInterval(() => {
      setVisibleCount((v) => {
        if (v >= FOOD_SPLASH.length) { clearInterval(cardTimer); return v; }
        return v + 1;
      });
    }, INTERVAL_MS);

    // 진행 바 (60fps)
    const start = Date.now();
    const progressTimer = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / TOTAL_MS) * 100, 100));
    }, 16);

    // 3초 후 이동
    const redirect = setTimeout(() => router.push("/main"), TOTAL_MS);

    return () => {
      clearInterval(cardTimer);
      clearInterval(progressTimer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen px-6 py-10 bg-[#0F172A] relative overflow-hidden">
      {/* 배경 글로우 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] opacity-25 rounded-full"
          style={{ background: "radial-gradient(ellipse, #4F46E5 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 opacity-10 rounded-full"
          style={{ background: "radial-gradient(ellipse, #06B6D4 0%, transparent 70%)" }} />
      </div>

      {/* 로고 */}
      <div className="relative z-10 flex items-center gap-2 self-start">
        <span className="text-xl">🍽️</span>
        <span className="font-black text-[#F1F5F9] text-lg tracking-tight">막내야뭐먹</span>
      </div>

      {/* 중앙 타이틀 + 카드 그리드 */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border border-[#4F46E5]/40 text-[#818CF8]"
            style={{ background: "rgba(79,70,229,0.12)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse inline-block" />
            점심 메뉴 고민 끝
          </div>
          <h1 className="text-4xl font-black tracking-tight"
            style={{ background: "linear-gradient(135deg, #F1F5F9 30%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            막내야, 오늘 뭐먹어?
          </h1>
        </div>

        {/* 8개 음식 카드 — 4×2 그리드 */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {FOOD_SPLASH.map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl aspect-square border border-white/6"
              style={{
                background: "rgba(30,41,59,0.7)",
                opacity: i < visibleCount ? 1 : 0,
                transform: i < visibleCount ? "scale(1) translateY(0)" : "scale(0.7) translateY(12px)",
                transition: "opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: i < visibleCount && i === FOOD_SPLASH.length - 1
                  ? "0 0 20px rgba(6,182,212,0.3)"
                  : i < visibleCount ? "0 4px 16px rgba(0,0,0,0.3)" : "none",
                borderColor: i < visibleCount && i === FOOD_SPLASH.length - 1
                  ? "rgba(6,182,212,0.4)"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-3xl">{item.emoji}</span>
              <p className="text-[#94A3B8] font-semibold text-center"
                style={{ fontSize: item.label.length > 5 ? "9px" : "11px" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 진행 바 */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-2">
        <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #4F46E5, #06B6D4)",
              transition: "width 16ms linear",
            }}
          />
        </div>
        <p className="text-xs text-[#334155] font-medium">주변 식당 불러오는 중...</p>
      </div>
    </main>
  );
}
