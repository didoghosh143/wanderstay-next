// Real API hooks — calls Next.js API routes instead of mock data
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Re-export types for compatibility
export type Destination = {
  id: number;
  slug: string;
  name: string;
  state: string;
  country: string;
  description: string;
  images: string[];
  tags: string[];
  hotelCount: number;
  rating: number;
  bestTimeToVisit: string;
};

export type Hotel = {
  id: number;
  destinationSlug: string;
  destinationName: string;
  name: string;
  description: string;
  images: string[];
  starRating: number;
  pricePerNight: number;
  amenities: string[];
  address: string;
  state: string;
  rating: number;
  reviewCount: number;
  freeCancellation: boolean;
};

export type Booking = {
  id: number;
  userId: number;
  hotelId: number;
  hotelName: string;
  hotelImage: string;
  destinationName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled";
  createdAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

// Location coordinates for Google Maps (static, no API needed)
export const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  "kolkata": { lat: 22.5726, lng: 88.3639 },
  "darjeeling": { lat: 27.0360, lng: 88.2627 },
  "sundarbans": { lat: 21.9497, lng: 89.1833 },
  "digha": { lat: 21.6274, lng: 87.5079 },
  "shantiniketan": { lat: 23.6783, lng: 87.6856 },
  "murshidabad": { lat: 24.1742, lng: 88.2733 },
  "bishnupur": { lat: 23.0733, lng: 87.3219 },
  "cooch-behar": { lat: 26.3245, lng: 89.4482 },
  "jaipur": { lat: 26.9124, lng: 75.7873 },
  "udaipur": { lat: 24.5854, lng: 73.7125 },
  "jodhpur": { lat: 26.2389, lng: 73.0243 },
  "goa": { lat: 15.2993, lng: 74.1240 },
  "alleppey": { lat: 9.4981, lng: 76.3388 },
  "munnar": { lat: 10.0889, lng: 77.0595 },
  "manali": { lat: 32.2396, lng: 77.1887 },
  "shimla": { lat: 31.1048, lng: 77.1734 },
  "ooty": { lat: 11.4102, lng: 76.6950 },
  "rishikesh": { lat: 30.0869, lng: 78.2676 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "agra": { lat: 27.1767, lng: 78.0081 },
  "varanasi": { lat: 25.3176, lng: 82.9739 },
  "delhi": { lat: 28.6139, lng: 77.2090 },
};

// Keep old image exports for compatibility
export { getHotelImage } from "./images";

// ── Helper ─────────────────────────────────────────────────────────────────
async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: "Request failed" }));
    throw { data, status: res.status };
  }

  return res.json();
}

// ── Query Keys ─────────────────────────────────────────────────────────────
export function getListDestinationsQueryKey(params?: any) {
  return ["destinations", params] as const;
}
export function getListHotelsQueryKey(params?: any) {
  return ["hotels", params] as const;
}
export function getGetDestinationQueryKey(slug: string) {
  return ["destination", slug] as const;
}
export function getGetHotelQueryKey(id: number) {
  return ["hotel", id] as const;
}
export function getListBookingsQueryKey() {
  return ["bookings"] as const;
}
export function getGetMeQueryKey() {
  return ["me"] as const;
}

// ── Destination Hooks ──────────────────────────────────────────────────────
export function useListDestinations(
  params?: { page?: number; limit?: number; search?: string; state?: string },
  opts?: { query?: any }
) {
  return useQuery<any>({
    queryKey: getListDestinationsQueryKey(params),
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.search) searchParams.set("search", params.search);
      if (params?.state) searchParams.set("state", params.state);
      return apiFetch(`/api/destinations?${searchParams.toString()}`);
    },
    ...opts?.query,
  });
}

export function useGetDestination(slug: string, opts?: { query?: any }) {
  return useQuery<any>({
    queryKey: getGetDestinationQueryKey(slug),
    queryFn: () => apiFetch(`/api/destinations/${slug}`),
    ...opts?.query,
  });
}

// ── Hotel Hooks ────────────────────────────────────────────────────────────
export function useListHotels(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    state?: string;
    destinationSlug?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  },
  opts?: { query?: any }
) {
  return useQuery<any>({
    queryKey: getListHotelsQueryKey(params),
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.search) searchParams.set("search", params.search);
      if (params?.state) searchParams.set("state", params.state);
      if (params?.destinationSlug) searchParams.set("destinationSlug", params.destinationSlug);
      if (params?.minPrice) searchParams.set("minPrice", String(params.minPrice));
      if (params?.maxPrice) searchParams.set("maxPrice", String(params.maxPrice));
      if (params?.minRating) searchParams.set("minRating", String(params.minRating));
      return apiFetch(`/api/hotels?${searchParams.toString()}`);
    },
    ...opts?.query,
  });
}

export function useGetHotel(id: number, opts?: { query?: any }) {
  return useQuery<any>({
    queryKey: getGetHotelQueryKey(id),
    queryFn: () => apiFetch(`/api/hotels/${id}`),
    ...opts?.query,
  });
}

// ── Auth Hooks ─────────────────────────────────────────────────────────────
export function useGetMe(opts?: { query?: any }) {
  return useQuery<any>({
    queryKey: getGetMeQueryKey(),
    queryFn: () => apiFetch("/api/auth/me"),
    ...opts?.query,
  });
}

export function useLogin(opts?: { mutation?: any }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: { email: string; password: string } }) =>
      apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...opts?.mutation,
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      opts?.mutation?.onSuccess?.(...args);
    },
  });
}

export function useRegister(opts?: { mutation?: any }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: { name: string; email: string; password: string; role?: string } }) =>
      apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...opts?.mutation,
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      opts?.mutation?.onSuccess?.(...args);
    },
  });
}

export function useLogout(opts?: { mutation?: any }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_data: any) =>
      apiFetch("/api/auth/logout", { method: "POST" }),
    ...opts?.mutation,
    onSuccess: (...args: any[]) => {
      queryClient.setQueryData(getGetMeQueryKey(), null);
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      opts?.mutation?.onSuccess?.(...args);
    },
  });
}

// ── Booking Hooks ──────────────────────────────────────────────────────────
export function useListBookings(opts?: { query?: any }) {
  return useQuery<any[]>({
    queryKey: getListBookingsQueryKey(),
    queryFn: () => apiFetch("/api/bookings"),
    ...opts?.query,
  });
}

export function useCreateBooking(opts?: { mutation?: any }) {
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: { hotelId: number; checkIn: string; checkOut: string; guests: number };
    }) =>
      apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...opts?.mutation,
  });
}

export function useCancelBooking(opts?: { mutation?: any }) {
  return useMutation({
    mutationFn: ({ id }: { id: number }) =>
      apiFetch(`/api/bookings/${id}/cancel`, { method: "POST" }),
    ...opts?.mutation,
  });
}
