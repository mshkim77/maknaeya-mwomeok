import { NextRequest, NextResponse } from "next/server";

const KAKAO_API = "https://dapi.kakao.com/v2/local/search/keyword.json";

// 카테고리별 검색 키워드 + 그룹코드
const CATEGORY_CONFIG: Record<string, { keyword: string; group: string }> = {
  한식:        { keyword: "한식",   group: "FD6" },
  중식:        { keyword: "중식",   group: "FD6" },
  일식:        { keyword: "일식",   group: "FD6" },
  양식:        { keyword: "양식",   group: "FD6" },
  분식:        { keyword: "분식",   group: "FD6" },
  "치킨/피자": { keyword: "치킨",   group: "FD6" },
  "카페/디저트":{ keyword: "카페",  group: "CE7" },
};

async function fetchByCategory(
  keyword: string,
  group: string,
  lng: string,
  lat: string,
  radius: string,
  apiKey: string
) {
  const params = new URLSearchParams({
    query: keyword,
    category_group_code: group,
    x: lng,
    y: lat,
    radius,
    size: "15",
    sort: "distance",
  });

  const res = await fetch(`${KAKAO_API}?${params}`, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.documents ?? [];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const categoriesRaw = searchParams.get("categories") ?? "";
  const radius = searchParams.get("radius") ?? "500";

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat/lng 필수" }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API 키 미설정" }, { status: 500 });
  }

  const categories = categoriesRaw ? categoriesRaw.split(",") : Object.keys(CATEGORY_CONFIG);

  try {
    const fetches = categories.map((cat) => {
      const cfg = CATEGORY_CONFIG[cat] ?? { keyword: cat, group: "FD6" };
      return fetchByCategory(cfg.keyword, cfg.group, lng, lat, radius, apiKey);
    });

    const results = await Promise.all(fetches);

    const seen = new Set<string>();
    const restaurants = results
      .flat()
      .filter((doc) => {
        if (seen.has(doc.id)) return false;
        seen.add(doc.id);
        return true;
      })
      .map((doc) => ({
        id: doc.id,
        name: doc.place_name,
        category: doc.category_name?.split(" > ").pop() ?? doc.category_name,
        phone: doc.phone ?? "",
        address: doc.address_name ?? "",
        roadAddress: doc.road_address_name ?? "",
        distance: Number(doc.distance),
        placeUrl: doc.place_url ?? "",
        lat: Number(doc.y),
        lng: Number(doc.x),
      }));

    return NextResponse.json(restaurants);
  } catch (e) {
    console.error("카카오 API 오류:", e);
    return NextResponse.json({ error: "검색 실패" }, { status: 500 });
  }
}
