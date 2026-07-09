// Local mock API hooks replacing @workspace/api-client-react
// Same interface, but uses local data instead of remote API calls
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  destinations,
  hotels,
  getBookings,
  addBooking,
  cancelBooking,
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  getHotelImage,
  LOCATION_COORDS,
  type Destination,
  type Hotel,
  type Booking,
  type User,
} from "./mockData";

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
      let filtered = [...destinations];
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(
          (d) =>
            d.name.toLowerCase().includes(s) ||
            d.state.toLowerCase().includes(s) ||
            d.tags.some((t) => t.toLowerCase().includes(s))
        );
      }
      if (params?.state) {
        filtered = filtered.filter((d) => d.state === params.state);
      }
      const total = filtered.length;
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);
      return { destinations: paged, total, page, limit };
    },
    ...opts?.query,
  });
}

export function useGetDestination(slug: string, opts?: { query?: any }) {
  return useQuery<any>({
    queryKey: getGetDestinationQueryKey(slug),
    queryFn: () => {
      const dest = destinations.find((d) => d.slug === slug);
      if (!dest) throw new Error("Not found");
      return dest;
    },
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
      let filtered = [...hotels];
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(
          (h) =>
            h.name.toLowerCase().includes(s) ||
            h.destinationName.toLowerCase().includes(s) ||
            h.state.toLowerCase().includes(s)
        );
      }
      if (params?.state) {
        filtered = filtered.filter((h) => h.state === params.state);
      }
      if (params?.destinationSlug) {
        filtered = filtered.filter((h) => h.destinationSlug === params.destinationSlug);
      }
      if (params?.minPrice) {
        filtered = filtered.filter((h) => h.pricePerNight >= params.minPrice!);
      }
      if (params?.maxPrice) {
        filtered = filtered.filter((h) => h.pricePerNight <= params.maxPrice!);
      }
      if (params?.minRating) {
        filtered = filtered.filter((h) => h.starRating >= params.minRating!);
      }
      const total = filtered.length;
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);
      return { hotels: paged, total, page, limit };
    },
    ...opts?.query,
  });
}

export function useGetHotel(id: number, opts?: { query?: any }) {
  return useQuery<any>({
    queryKey: getGetHotelQueryKey(id),
    queryFn: () => {
      const hotel = hotels.find((h) => h.id === id);
      if (!hotel) throw new Error("Not found");
      return hotel;
    },
    ...opts?.query,
  });
}

// ── Auth Hooks ─────────────────────────────────────────────────────────────
export function useGetMe(opts?: { query?: any }) {
  return useQuery<any>({
    queryKey: getGetMeQueryKey(),
    queryFn: () => {
      const user = getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      return user;
    },
    ...opts?.query,
  });
}

export function useLogin(opts?: { mutation?: any }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: { email: string; password: string } }) => {
      const user = loginUser(data.email, data.password);
      if (!user) throw { data: { error: "Invalid credentials" } };
      return Promise.resolve(user);
    },
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
    mutationFn: ({ data }: { data: { name: string; email: string; password: string } }) => {
      const user = registerUser(data.name, data.email, data.password);
      if (!user) throw { data: { error: "Registration failed" } };
      return Promise.resolve(user);
    },
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
    mutationFn: (_data: any) => {
      logoutUser();
      return Promise.resolve({});
    },
    ...opts?.mutation,
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      queryClient.clear();
      opts?.mutation?.onSuccess?.(...args);
    },
  });
}

// ── Booking Hooks ──────────────────────────────────────────────────────────
export function useListBookings(opts?: { query?: any }) {
  return useQuery<any[]>({
    queryKey: getListBookingsQueryKey(),
    queryFn: () => getBookings(),
    ...opts?.query,
  });
}

export function useCreateBooking(opts?: { mutation?: any }) {
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: { hotelId: number; checkIn: string; checkOut: string; guests: number };
    }) => {
      const hotel = hotels.find((h) => h.id === data.hotelId);
      if (!hotel) throw { data: { error: "Hotel not found" } };

      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);

      if (checkOutDate <= checkInDate) {
        throw { data: { error: "Check-out date must be after check-in date" } };
      }

      const nightCount = Math.max(
        1,
        Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000)
      );

      const booking = addBooking({
        hotelId: data.hotelId,
        hotelName: hotel.name,
        hotelImage: hotel.images[0],
        destinationName: hotel.destinationName,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        totalPrice: Math.round(hotel.pricePerNight * nightCount * 1.12),
      });
      return Promise.resolve(booking);
    },
    ...opts?.mutation,
  });
}

export function useCancelBooking(opts?: { mutation?: any }) {
  return useMutation({
    mutationFn: ({ id }: { id: number }) => {
      const success = cancelBooking(id);
      if (!success) throw { data: { error: "Could not cancel booking" } };
      return Promise.resolve({ success: true });
    },
    ...opts?.mutation,
  });
}

// Re-export types
export type { Destination, Hotel, Booking, User };
export { LOCATION_COORDS };
