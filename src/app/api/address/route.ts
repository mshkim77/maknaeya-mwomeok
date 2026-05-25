import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat/lng 필수" }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API 키 미설정" }, { status: 500 });
  }

  const res = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
    { headers: { Authorization: `KakaoAK ${apiKey}` } }
  );

  const data = await res.json();
  const doc = data.documents?.[0];

  if (!doc) {
    return NextResponse.json({ address: null });
  }

  const road = doc.road_address?.address_name;
  const jibun = doc.address?.address_name;

  return NextResponse.json({ address: road || jibun || null });
}
