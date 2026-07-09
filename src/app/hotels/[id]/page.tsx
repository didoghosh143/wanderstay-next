"use client";
import { useState } from "react";
import { usePathname as useLocation, useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Wifi, Coffee, Car, Waves, Shield, Calendar, Users, Plus, Minus, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { useGetHotel, useCreateBooking, getGetHotelQueryKey, getListBookingsQueryKey, LOCATION_COORDS } from "@/lib/mockApi";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { GoogleMap } from "@/components/GoogleMap";
import Link from "next/link";

const AMENITY_ICONS: Record<string, any> = {
  WiFi: Wifi, "Free WiFi": Wifi, Coffee: Coffee, Breakfast: Coffee, "Free Breakfast": Coffee,
  Parking: Car, "Free Parking": Car, Pool: Waves, Spa: Shield, Gym: Shield,
  Car: Car, Restaurant: Coffee, Bar: Coffee, "Boat Tours": Waves, Safari: MapPin,
  "Sea View": Waves, "Beach Access": Waves, "River View": Waves, Ayurveda: Shield,
  Yoga: Shield, "Tea Lounge": Coffee, Garden: MapPin, Fireplace: Shield, Library: Shield,
  Tennis: Shield, Billiards: Shield, Archery: Shield, Golf: MapPin, "Polo": Shield,
  Butler: Shield, "Business Center": Shield, "Boat Transfer": Waves, Museum: Shield,
  "Cultural Programs": Shield, Birdwatching: MapPin, "Nature Walks": MapPin,
  "Adventure Sports": Shield, Fishing: Waves, Rafting: Waves,
};

function nights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(ms / (86400000)));
}

export default function HotelDetail() {
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string, 10) : 0;
  const router = useRouter(); const setLoc = (path: string) => router.push(path);
  const { isAuthenticated, openAuthModal } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(); dayAfter.setDate(dayAfter.getDate() + 2);
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(fmt(tomorrow));
  const [checkOut, setCheckOut] = useState(fmt(dayAfter));
  const [guests, setGuests] = useState(2);
  const [activeImg, setActiveImg] = useState(0);
  const [booked, setBooked] = useState(false);

  const { data: hotel, isLoading, isError } = useGetHotel(id, {
    query: { queryKey: getGetHotelQueryKey(id), enabled: !!id }
  });

  const booking = useCreateBooking({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        setBooked(true);
        toast({ title: "🎉 Booking confirmed!", description: `Your stay at ${hotel?.name} is booked.` });
        setTimeout(() => setLoc("/bookings"), 2000);
      },
      onError: (err: any) => {
        const msg = err?.data?.error || "Booking failed. Please try again.";
        toast({ title: "Booking failed", description: msg, variant: "destructive" });
      },
    },
  });

  const handleBook = () => {
    if (!isAuthenticated) { openAuthModal("login"); return; }
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      toast({ title: "Invalid dates", description: "Check-out must be after check-in.", variant: "destructive" });
      return;
    }
    booking.mutate({ data: { hotelId: id, checkIn, checkOut, guests } });
  };

  const nightCount = nights(checkIn, checkOut);
  const total = (hotel?.pricePerNight || 0) * nightCount * guests;
  const images = hotel?.images?.length ? hotel.images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"];
  const coords = hotel?.destinationSlug ? LOCATION_COORDS[hotel.destinationSlug] : undefined;

  if (isLoading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-orange-600" />
    </div>
  );

  if (isError || !hotel) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4 px-4">
      <div className="text-6xl">😔</div>
      <h2 className="font-['DM_Serif_Display'] text-2xl sm:text-3xl text-gray-800 text-center">Hotel not found</h2>
      <Link href="/hotels" className="text-orange-600 font-semibold hover:underline">Browse all hotels</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/hotels" className="hover:text-orange-600 transition-colors">Hotels</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{hotel.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-10">
          {/* Left: Hotel info */}
          <div className="xl:col-span-2">
            {/* Image gallery */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 shadow-2xl shadow-black/10" style={{ height: "min(55vh, 440px)" }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={hotel.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setActiveImg((i) => (i + 1) % images.length)} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_: string, i: number) => (
                      <button key={i} onClick={() => setActiveImg(i)} className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? "bg-white w-6" : "bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-orange-500 shadow-lg" : "border-transparent"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Hotel meta */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{Array.from({ length: hotel.starRating || 4 }).map((_, i) => (<Star key={i} size={16} className="text-amber-400 fill-amber-400" />))}</div>
                <span className="text-gray-500 text-sm font-medium">{hotel.starRating}-Star Hotel</span>
              </div>
              <h1 className="font-['DM_Serif_Display'] text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-3">{hotel.name}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 text-gray-500 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-orange-500" />
                  <span className="text-xs sm:text-sm">{hotel.address}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
                  <Star size={13} className="text-orange-600 fill-orange-600" />
                  <span className="text-orange-700 font-bold">{hotel.rating?.toFixed(1)}</span>
                  <span className="text-orange-500 hidden sm:inline">({hotel.reviewCount?.toLocaleString("en-IN")} reviews)</span>
                </div>
                {hotel.freeCancellation && (
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <CheckCircle2 size={13} /> Free Cancellation
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">{hotel.description}</p>

              {/* Amenities */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-8 shadow-sm">
                <h2 className="font-['DM_Serif_Display'] text-xl sm:text-2xl text-gray-900 mb-5">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {hotel.amenities?.map((a: string) => {
                    const Icon = AMENITY_ICONS[a] || Wifi;
                    return (
                      <div key={a} className="flex items-center gap-3 text-gray-600">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <Icon size={16} className="text-orange-600" />
                        </div>
                        <span className="text-sm font-medium">{a}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Location with Google Maps */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
                <h2 className="font-['DM_Serif_Display'] text-xl sm:text-2xl text-gray-900 mb-4">Location</h2>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">{hotel.destinationName}, {hotel.state}</p>
                    <p className="text-gray-500 text-sm">{hotel.address}</p>
                  </div>
                </div>
                {/* Google Map */}
                {coords ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200 h-48 sm:h-56 relative">
                    <GoogleMap
                      lat={coords.lat}
                      lng={coords.lng}
                      zoom={15}
                      label={hotel.name}
                      className="h-full"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden border border-gray-200 h-48 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={32} className="text-orange-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm font-medium">{hotel.destinationName}</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 text-xs font-semibold hover:underline mt-1 block"
                      >
                        Open in Google Maps ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Booking widget */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-orange-100/30 overflow-hidden"
            >
              <div className="bg-gradient-to-br from-orange-600 to-amber-600 px-5 sm:px-6 pt-5 sm:pt-6 pb-7 sm:pb-8">
                <p className="text-white/70 text-sm mb-1">Price per night</p>
                <p className="font-['DM_Serif_Display'] text-3xl sm:text-4xl text-white">₹{hotel.pricePerNight?.toLocaleString("en-IN")}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star size={14} className="text-amber-300 fill-amber-300" />
                  <span className="text-white/80 text-sm">{hotel.rating?.toFixed(1)} · {hotel.reviewCount?.toLocaleString("en-IN")} reviews</span>
                </div>
              </div>

              <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-4">
                {booked ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-6"
                  >
                    <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                    <h3 className="font-['DM_Serif_Display'] text-2xl text-gray-900 mb-1">Booking Confirmed!</h3>
                    <p className="text-gray-500 text-sm">Redirecting to your trips…</p>
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Check-in</label>
                      <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400/20 transition-all">
                        <Calendar size={16} className="text-orange-500 flex-shrink-0" />
                        <input
                          type="date"
                          value={checkIn}
                          min={fmt(new Date())}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="outline-none text-sm text-gray-900 w-full"
                          data-testid="input-checkin"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Check-out</label>
                      <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400/20 transition-all">
                        <Calendar size={16} className="text-orange-500 flex-shrink-0" />
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="outline-none text-sm text-gray-900 w-full"
                          data-testid="input-checkout"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Guests</label>
                      <div className="flex items-center gap-4 border border-gray-200 rounded-xl px-4 py-3">
                        <Users size={16} className="text-orange-500" />
                        <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors">
                          <Minus size={13} />
                        </button>
                        <span className="font-bold text-gray-900 min-w-[20px] text-center">{guests}</span>
                        <button onClick={() => setGuests(g => Math.min(10, g + 1))} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors">
                          <Plus size={13} />
                        </button>
                        <span className="text-gray-500 text-sm">{guests === 1 ? "Guest" : "Guests"}</span>
                      </div>
                    </div>

                    {/* Price breakdown */}
                    {checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && nightCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-xl p-4 space-y-2"
                      >
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹{hotel.pricePerNight?.toLocaleString("en-IN")} × {nightCount} night{nightCount > 1 ? "s" : ""} × {guests} guest{guests > 1 ? "s" : ""}</span>
                          <span>₹{(hotel.pricePerNight * nightCount * guests).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Taxes & fees</span>
                          <span>₹{Math.round(total * 0.12).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                          <span>Total</span>
                          <span>₹{Math.round(total * 1.12).toLocaleString("en-IN")}</span>
                        </div>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBook}
                      disabled={booking.isPending}
                      className="btn-primary w-full py-3.5 sm:py-4 text-sm sm:text-base flex items-center justify-center gap-2"
                      data-testid="button-book-now"
                    >
                      {booking.isPending ? <><Loader2 size={18} className="animate-spin" /><span>Booking…</span></> : (
                        isAuthenticated ? <span>Confirm Booking</span> : <span>Sign in to Book</span>
                      )}
                    </motion.button>

                    {hotel.freeCancellation && (
                      <p className="text-center text-emerald-600 text-xs font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} /> Free cancellation available
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
