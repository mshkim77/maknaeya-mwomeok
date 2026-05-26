"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface LocationPickerModalProps {
  onClose: () => void;
  onConfirm: (address: string, lat: number, lng: number) => void;
}

const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "";

export default function LocationPickerModal({ onClose, onConfirm }: LocationPickerModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const [address, setAddress] = useState("지도를 움직여 위치를 선택하세요");
  const [lat, setLat] = useState(37.5665);
  const [lng, setLng] = useState(126.9780);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 좌표 → 주소 변환
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setIsAddressLoading(true);
    setLat(lat);
    setLng(lng);
    try {
      const res = await fetch(`/api/address?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data.address) setAddress(data.address);
      else setAddress("주소를 찾을 수 없어요");
    } catch {
      setAddress("주소를 가져오지 못했어요");
    }
    setIsAddressLoading(false);
  }, []);

  const [debugMsg, setDebugMsg] = useState("");

  // 카카오맵 초기화
  useEffect(() => {
    if (!APP_KEY) {
      setDebugMsg("❌ APP_KEY 없음 (환경변수 미설정)");
      return;
    }
    setDebugMsg(`🔑 KEY: ${APP_KEY.slice(0, 6)}...`);

    const initMap = () => {
      try {
        window.kakao.maps.load(() => {
          if (!mapRef.current) {
            setDebugMsg("❌ mapRef 없음");
            return;
          }

          const center = new window.kakao.maps.LatLng(lat, lng);
          const map = new window.kakao.maps.Map(mapRef.current, {
            center,
            level: 3,
          });
          mapInstanceRef.current = map;
          setDebugMsg("✅ 지도 로드 성공");

          window.kakao.maps.event.addListener(map, "dragend", () => {
            const c = map.getCenter();
            fetchAddress(c.getLat(), c.getLng());
          });

          window.kakao.maps.event.addListener(map, "zoom_changed", () => {
            const c = map.getCenter();
            fetchAddress(c.getLat(), c.getLng());
          });

          fetchAddress(lat, lng);
        });
      } catch (e: any) {
        setDebugMsg(`❌ 초기화 오류: ${e?.message}`);
      }
    };

    if (window.kakao?.maps) {
      setDebugMsg(prev => prev + " / kakao 이미 로드됨");
      initMap();
    } else {
      const existing = document.querySelector(`script[src*="dapi.kakao"]`);
      if (existing) {
        setDebugMsg(prev => prev + " / 스크립트 존재, load 대기");
        existing.addEventListener("load", initMap);
      } else {
        setDebugMsg(prev => prev + " / 스크립트 주입 중");
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false&libraries=services`;
        script.addEventListener("load", initMap);
        script.addEventListener("error", () => setDebugMsg("❌ SDK 스크립트 로드 실패 (도메인 등록 확인)"));
        document.head.appendChild(script);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 현재 위치로 이동
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          const newCenter = new window.kakao.maps.LatLng(latitude, longitude);
          mapInstanceRef.current.setCenter(newCenter);
        }
        fetchAddress(latitude, longitude);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // 장소 검색
  const handleSearch = () => {
    if (!search.trim() || !window.kakao) return;
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(search, (data: any[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data.slice(0, 5));
      }
    });
  };

  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.y);
    const lng = parseFloat(result.x);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
    }
    setAddress(result.road_address_name || result.address_name);
    setLat(lat);
    setLng(lng);
    setSearchResults([]);
    setSearch("");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0F172A" }}>

      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,23,42,0.98)" }}>
        <button onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 transition-colors shrink-0">
          <svg className="w-5 h-5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-[#F1F5F9] font-black text-base">위치 설정</h2>
      </div>

      {/* 검색바 */}
      <div className="px-4 py-3 shrink-0 relative"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,23,42,0.98)" }}>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 rounded-xl px-4 py-3 border border-white/10"
            style={{ background: "rgba(30,41,59,0.8)" }}>
            <svg className="w-4 h-4 text-[#475569] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="장소, 도로명, 건물명 검색"
              className="flex-1 bg-transparent text-[#F1F5F9] text-sm placeholder:text-[#475569] outline-none"
            />
            {search && (
              <button onClick={() => { setSearch(""); setSearchResults([]); }}
                className="text-[#475569] hover:text-[#94A3B8]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button onClick={handleSearch}
            className="px-4 py-3 rounded-xl text-sm font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #4F46E5, #06B6D4)" }}>
            검색
          </button>
        </div>

        {/* 검색 결과 드롭다운 */}
        {searchResults.length > 0 && (
          <div className="absolute left-4 right-4 top-full mt-1 rounded-xl overflow-hidden z-10 border border-white/10"
            style={{ background: "rgba(15,23,42,0.98)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
            {searchResults.map((r, i) => (
              <button key={i} onClick={() => handleSelectResult(r)}
                className="w-full px-4 py-3 flex flex-col items-start text-left hover:bg-white/5 transition-colors"
                style={{ borderBottom: i < searchResults.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span className="text-[#F1F5F9] text-sm font-semibold">{r.place_name}</span>
                <span className="text-[#475569] text-xs mt-0.5">{r.road_address_name || r.address_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 지도 */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
        {/* 임시 디버그 */}
        {debugMsg && (
          <div className="absolute top-2 left-2 right-2 z-20 bg-black/80 text-white text-xs px-3 py-2 rounded-lg font-mono">
            {debugMsg}
          </div>
        )}

        {/* 중앙 고정 핀 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center" style={{ marginBottom: "44px" }}>
            <div className="w-10 h-10 rounded-full border-4 border-white flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #4F46E5, #06B6D4)", boxShadow: "0 4px 20px rgba(79,70,229,0.6)" }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div className="w-0 h-0"
              style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #4F46E5" }} />
            <div className="w-2 h-1 rounded-full bg-black/30 blur-sm" />
          </div>
        </div>

        {/* 현재 위치 버튼 */}
        <button onClick={handleCurrentLocation}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border border-white/10 transition-all hover:border-[#06B6D4]/40"
          style={{ background: "rgba(15,23,42,0.9)", backdropFilter: "blur(8px)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
          {isLocating
            ? <div className="w-4 h-4 border-2 border-[#06B6D4] border-t-transparent rounded-full animate-spin" />
            : <svg className="w-4 h-4 text-[#06B6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
              </svg>
          }
          <span className="text-[#F1F5F9]">{isLocating ? "찾는 중..." : "현재 위치"}</span>
        </button>
      </div>

      {/* 하단 주소 + 확인 */}
      <div className="px-4 pt-4 pb-8 shrink-0 flex flex-col gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,23,42,0.98)" }}>
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-white/6"
          style={{ background: "rgba(30,41,59,0.6)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(79,70,229,0.2)" }}>
            {isAddressLoading
              ? <div className="w-4 h-4 border-2 border-[#818CF8] border-t-transparent rounded-full animate-spin" />
              : <svg className="w-4 h-4 text-[#818CF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#475569] text-xs font-medium mb-0.5">선택한 위치</p>
            <p className="text-[#F1F5F9] text-sm font-semibold truncate">{address}</p>
            <p className="text-[#334155] text-xs mt-0.5">반경 500m 내 식당을 추천해드려요</p>
          </div>
        </div>

        <button
          onClick={() => onConfirm(address, lat, lng)}
          disabled={isAddressLoading}
          className="btn-primary w-full py-4 font-bold text-sm disabled:opacity-50">
          📍 이 위치로 설정하기
        </button>
      </div>
    </div>
  );
}
