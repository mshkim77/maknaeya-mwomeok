"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CategoryGrid from "@/components/CategoryGrid";
import SpinButton from "@/components/SpinButton";
import { FoodCategory, FOOD_CATEGORIES, getRandomRestaurant, getFilteredRestaurants } from "@/lib/mockData";
import { Restaurant, saveRestaurant } from "@/lib/restaurant";
import LocationPickerModal from "@/components/LocationPickerModal";

type LocationState = "idle" | "loading" | "granted" | "denied";

export default function MainPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<FoodCategory[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedAddress, setDetectedAddress] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const requestLocation = useCallback(() => {
    setLocationState("loading");
    if (!navigator.geolocation) { setLocationState("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocationState("granted");
        setCoords({ lat, lng });

        // 역지오코딩 — 좌표 → 주소
        try {
          const res = await fetch(`/api/address?lat=${lat}&lng=${lng}`);
          const data = await res.json();
          if (data.address) setDetectedAddress(data.address);
        } catch {}
      },
      (err) => {
        // 1: 권한 거부 / 2: 위치 불가 / 3: 타임아웃
        if (err.code === 1) {
          setLocationState("denied");
        } else {
          // 타임아웃이나 기타 오류는 재시도 가능하게 idle로
          setLocationState("idle");
          alert("위치를 가져오지 못했어요. 다시 시도해주세요.");
        }
      },
      {
        timeout: 15000,
        maximumAge: 300000,   // 5분 이내 캐시된 위치 재사용
        enableHighAccuracy: false, // 네트워크 기반 (빠름)
      }
    );
  }, []);

  const canSpin = selected.length > 0;

  const handleSpin = useCallback(async () => {
    if (isSpinning || !canSpin) return;
    setIsSpinning(true);

    try {
      let picked: Restaurant;

      if (coords) {
        // 실제 카카오 API 호출
        const params = new URLSearchParams({
          lat: String(coords.lat),
          lng: String(coords.lng),
          categories: selected.join(","),
          radius: "500",
        });
        const res = await fetch(`/api/restaurants?${params}`);
        const list: Restaurant[] = await res.json();

        if (!Array.isArray(list) || list.length === 0) throw new Error("결과 없음");

        picked = list[Math.floor(Math.random() * list.length)];
      } else {
        // 위치 없으면 목업 데이터 폴백
        const mock = getRandomRestaurant(selected);
        picked = {
          id: mock.id,
          name: mock.name,
          category: mock.category,
          phone: mock.phone,
          address: mock.address,
          roadAddress: mock.address,
          distance: mock.distance,
          placeUrl: "",
          lat: 0,
          lng: 0,
        };
      }

      saveRestaurant(picked);
      router.push(`/result?id=${picked.id}`);
    } catch (e) {
      console.error(e);
      // 오류 시 목업 폴백
      const mock = getRandomRestaurant(selected);
      const fallback: Restaurant = {
        id: mock.id,
        name: mock.name,
        category: mock.category,
        phone: mock.phone,
        address: mock.address,
        roadAddress: mock.address,
        distance: mock.distance,
        placeUrl: "",
        lat: 0,
        lng: 0,
      };
      saveRestaurant(fallback);
      router.push(`/result?id=${fallback.id}`);
    } finally {
      setIsSpinning(false);
    }
  }, [isSpinning, canSpin, coords, selected, router]);

  const totalCount = coords
    ? null // 실시간이라 카운트 미표시
    : getFilteredRestaurants(selected).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A]">
      {showLocationPicker && (
        <LocationPickerModal
          onClose={() => setShowLocationPicker(false)}
          onConfirm={(address, lat, lng) => {
            setDetectedAddress(address);
            setCoords({ lat, lng });
            setLocationState("granted");
            setShowLocationPicker(false);
          }}
        />
      )}
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <span className="font-black text-[#F1F5F9] text-base tracking-tight">막내야뭐먹</span>
          </Link>

          {locationState === "idle" && (
            <button onClick={() => setShowLocationPicker(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#06B6D4] transition-colors border border-white/10 px-3 py-1.5 rounded-full hover:border-[#06B6D4]/40">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              위치 설정
            </button>
          )}
          {locationState === "loading" && (
            <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
              <div className="w-3 h-3 border border-[#94A3B8] border-t-transparent rounded-full animate-spin" />
              확인중
            </div>
          )}
          {locationState === "granted" && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#06B6D4] border border-[#06B6D4]/30 px-3 py-1.5 rounded-full max-w-[180px]"
              style={{ background: "rgba(6,182,212,0.08)" }}>
              <span className="shrink-0">📍</span>
              {detectedAddress ? (
                <span className="truncate">{detectedAddress}</span>
              ) : (
                <span className="flex gap-0.5 items-center">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1 h-1 rounded-full bg-[#06B6D4] animate-bounce inline-block"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </span>
              )}
            </span>
          )}
          {locationState === "denied" && (
            <span className="text-xs text-[#475569]">📍 권한 없음</span>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 flex flex-col gap-5">
        <CategoryGrid selected={selected} onChange={setSelected} />

        {/* Spin section */}
        <div className="rounded-2xl p-6 flex flex-col items-center gap-4 border border-white/6"
          style={{ background: "rgba(30,41,59,0.6)" }}>
          <div className="text-center">
            {canSpin ? (
              <>
                <p className="text-[#94A3B8] text-sm">
                  {coords
                    ? <>반경 500m 내 <span className="text-[#06B6D4] font-bold">실제 주변 식당</span>을 찾아드려요</>
                    : <>주변 <span className="text-[#F1F5F9] font-bold">{totalCount}개</span> 식당 중 하나를 골라드려요</>
                  }
                </p>
                <h2 className="text-base font-black text-[#F1F5F9] mt-0.5">🎲 랜덤으로 골라드려요!</h2>
              </>
            ) : (
              <>
                <p className="text-[#94A3B8] text-sm">카테고리를 선택해주세요</p>
                <h2 className="text-base font-bold text-[#94A3B8] mt-0.5">
                  또는 <span className="text-[#F1F5F9]">전체</span>를 눌러보세요
                </h2>
              </>
            )}
          </div>

          <SpinButton onSpin={handleSpin} isSpinning={isSpinning} disabled={!canSpin} />

          {isSpinning && (
            <div className="flex items-center gap-2 text-[#06B6D4]">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i}
                    className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-sm font-semibold">
                {coords ? "주변 식당 검색중..." : "메뉴 고르는 중..."}
              </span>
            </div>
          )}
        </div>

        {!coords && (
          <p className="text-xs text-center text-[#334155] pb-2">
            📍 위치 설정 시 실제 주변 식당으로 추천해드려요
          </p>
        )}
      </main>
    </div>
  );
}
