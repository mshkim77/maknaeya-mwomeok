export type FoodCategory =
  | "한식"
  | "중식"
  | "일식"
  | "양식"
  | "분식"
  | "치킨/피자"
  | "카페/디저트";

export interface Restaurant {
  id: string;
  name: string;
  category: FoodCategory;
  distance: number;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  tags: string[];
  priceRange: "저렴" | "보통" | "비쌈";
  openNow: boolean;
}

export interface CategoryInfo {
  id: FoodCategory;
  emoji: string;
  label: string;
  nearbyCount: number;
}

export const FOOD_CATEGORIES: CategoryInfo[] = [
  { id: "한식",       emoji: "🍚", label: "한식",       nearbyCount: 12 },
  { id: "중식",       emoji: "🥡", label: "중식",       nearbyCount: 5  },
  { id: "일식",       emoji: "🍣", label: "일식",       nearbyCount: 7  },
  { id: "양식",       emoji: "🍝", label: "양식",       nearbyCount: 4  },
  { id: "분식",       emoji: "🍜", label: "분식",       nearbyCount: 8  },
  { id: "치킨/피자",  emoji: "🍗", label: "치킨/피자",  nearbyCount: 6  },
  { id: "카페/디저트",emoji: "☕", label: "카페/디저트", nearbyCount: 9  },
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "진짜맛있는 삼겹살집",
    category: "한식",
    distance: 150,
    rating: 4.7,
    reviewCount: 328,
    address: "서울시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    tags: ["삼겹살", "회식", "점심특선"],
    priceRange: "보통",
    openNow: true,
  },
  {
    id: "2",
    name: "홍콩반점 0410",
    category: "중식",
    distance: 280,
    rating: 4.3,
    reviewCount: 156,
    address: "서울시 강남구 역삼로 45",
    phone: "02-2345-6789",
    tags: ["짜장면", "짬뽕", "탕수육"],
    priceRange: "저렴",
    openNow: true,
  },
  {
    id: "3",
    name: "스시 오마카세 켄지",
    category: "일식",
    distance: 420,
    rating: 4.9,
    reviewCount: 89,
    address: "서울시 강남구 선릉로 88",
    phone: "02-3456-7890",
    tags: ["스시", "오마카세", "특별한날"],
    priceRange: "비쌈",
    openNow: true,
  },
  {
    id: "4",
    name: "파스타 공방",
    category: "양식",
    distance: 190,
    rating: 4.5,
    reviewCount: 241,
    address: "서울시 강남구 논현로 67",
    phone: "02-4567-8901",
    tags: ["파스타", "리조또", "데이트"],
    priceRange: "보통",
    openNow: true,
  },
  {
    id: "5",
    name: "엄마손 김밥천국",
    category: "분식",
    distance: 80,
    rating: 4.1,
    reviewCount: 512,
    address: "서울시 강남구 테헤란로 12",
    phone: "02-5678-9012",
    tags: ["김밥", "라면", "떡볶이"],
    priceRange: "저렴",
    openNow: true,
  },
  {
    id: "6",
    name: "블루보틀 커피",
    category: "카페/디저트",
    distance: 320,
    rating: 4.6,
    reviewCount: 673,
    address: "서울시 강남구 강남대로 99",
    phone: "02-6789-0123",
    tags: ["커피", "케이크", "브런치"],
    priceRange: "보통",
    openNow: true,
  },
  {
    id: "7",
    name: "BBQ 치킨 강남점",
    category: "치킨/피자",
    distance: 120,
    rating: 4.2,
    reviewCount: 891,
    address: "서울시 강남구 강남대로 100",
    phone: "02-7890-1234",
    tags: ["치킨", "황금올리브", "배달"],
    priceRange: "보통",
    openNow: true,
  },
  {
    id: "8",
    name: "놀부부대찌개",
    category: "한식",
    distance: 350,
    rating: 4.4,
    reviewCount: 287,
    address: "서울시 강남구 삼성로 55",
    phone: "02-8901-2345",
    tags: ["부대찌개", "직장인", "점심"],
    priceRange: "보통",
    openNow: true,
  },
  {
    id: "9",
    name: "이치란 라멘",
    category: "일식",
    distance: 480,
    rating: 4.8,
    reviewCount: 934,
    address: "서울시 강남구 영동대로 22",
    phone: "02-9012-3456",
    tags: ["라멘", "혼밥", "돈코츠"],
    priceRange: "보통",
    openNow: false,
  },
  {
    id: "10",
    name: "도미노피자 역삼점",
    category: "치킨/피자",
    distance: 200,
    rating: 4.0,
    reviewCount: 445,
    address: "서울시 강남구 테헤란로 77",
    phone: "02-0123-4567",
    tags: ["피자", "파스타", "샐러드"],
    priceRange: "보통",
    openNow: true,
  },
  {
    id: "11",
    name: "신전떡볶이",
    category: "분식",
    distance: 95,
    rating: 4.2,
    reviewCount: 389,
    address: "서울시 강남구 역삼로 30",
    phone: "02-1122-3344",
    tags: ["떡볶이", "순대", "튀김"],
    priceRange: "저렴",
    openNow: true,
  },
  {
    id: "12",
    name: "어니언 베이커리",
    category: "카페/디저트",
    distance: 550,
    rating: 4.7,
    reviewCount: 521,
    address: "서울시 강남구 선릉로 44",
    phone: "02-2233-4455",
    tags: ["빵", "크루아상", "디저트"],
    priceRange: "보통",
    openNow: true,
  },
];

export function getFilteredRestaurants(selected: FoodCategory[]): Restaurant[] {
  if (selected.length === 0) return MOCK_RESTAURANTS;
  return MOCK_RESTAURANTS.filter((r) => selected.includes(r.category));
}

export function getRandomRestaurant(selected: FoodCategory[]): Restaurant {
  const pool = getFilteredRestaurants(selected);
  const openOnes = pool.filter((r) => r.openNow);
  const candidates = openOnes.length > 0 ? openOnes : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function getPriceRangeSymbol(range: Restaurant["priceRange"]): string {
  switch (range) {
    case "저렴": return "₩";
    case "보통":  return "₩₩";
    case "비쌈":  return "₩₩₩";
  }
}
