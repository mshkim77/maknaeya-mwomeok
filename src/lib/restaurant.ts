export interface Restaurant {
  id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  roadAddress: string;
  distance: number;
  placeUrl: string;
  lat: number;
  lng: number;
}

export const RESTAURANT_SESSION_KEY = "maknaeya_picked";

export function saveRestaurant(r: Restaurant) {
  sessionStorage.setItem(RESTAURANT_SESSION_KEY, JSON.stringify(r));
}

export function loadRestaurant(): Restaurant | null {
  try {
    const raw = sessionStorage.getItem(RESTAURANT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
