"use client";
import { useState, useEffect } from "react";
import { usePathname as useLocation, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Star, MapPin, Wifi, Coffee, Car, Waves, Heart, X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useListHotels, getListHotelsQueryKey } from "@/lib/mockApi";
import { LocationImage } from "@/components/LocationImage";

const STATES = ["All India", "West Bengal", "Rajasthan", "Goa", "Kerala", "Himachal Pradesh", "Tamil Nadu", "Uttarakhand", "Maharashtra", "Delhi", "Uttar Pradesh"];
const AMENITY_ICONS: Record<string, any> = { WiFi: Wifi, Coffee: Coffee, Parking: Car, Pool: Waves, Car: Car };

function HotelCard({ hotel }: { hotel: any }) {
  const router = useRouter(); const setLoc = (path: string) => router.push(path);
  const [liked, setLiked] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md shadow-black/5 border border-gray-100 group w-full"
      data-testid={`card-hotel-${hotel.id}`}
    >
      <div className="relative h-56 overflow-hidden group/hotel">
        <LocationImage
          title={hotel.name}
          fallbackUrl={hotel.images?.[0] || "/images/hotel-kolkata-1.png"}
          alt={hotel.name}
          containerClassName="absolute inset-0"
          className="w-full h-full object-cover transition-transform duration-500 group-hover/hotel:scale-110"
        />
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md" aria-label="Save">
          <Heart size={16} className={liked ? "text-rose-500 fill-rose-500" : "text-gray-400"} />
        </button>
        {hotel.freeCancellation && (
          <div className="absolute bottom-3 left-3 bg-emerald-500/90 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            Free Cancellation
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg">
          <div className="flex gap-0.5">
            {Array.from({ length: hotel.starRating || 4 }).map((_, i) => (
              <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{hotel.name}</h3>
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg flex-shrink-0">
            <Star size={11} className="text-orange-600 fill-orange-600" />
            <span className="text-orange-700 font-bold text-xs">{hotel.rating?.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={12} className="flex-shrink-0" />
          <span>{hotel.destinationName}, {hotel.state}</span>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {hotel.amenities?.slice(0, 4).map((a: string) => {
            const Icon = AMENITY_ICONS[a] || Wifi;
            return (
              <div key={a} className="flex items-center gap-1 text-gray-400 text-xs">
                <Icon size={13} /> <span>{a}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">per night</p>
            <p className="text-xl font-bold text-gray-900">₹{hotel.pricePerNight?.toLocaleString("en-IN")}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setLoc(`/hotels/${hotel.id}`)}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all text-sm"
            data-testid={`button-view-hotel-${hotel.id}`}
          >
            <span>View & Book</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hotels() {
  const [location] = useLocation();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const [search, setSearch] = useState(params.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedState, setSelectedState] = useState(params.get("state") || "All India");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter(); const setLoc = (path: string) => router.push(path);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const queryParams: any = {
    page, limit: 12,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(selectedState !== "All India" && { state: selectedState }),
    ...(minPrice && { minPrice: parseInt(minPrice) }),
    ...(maxPrice && { maxPrice: parseInt(maxPrice) }),
    ...(minRating > 0 && { minRating }),
  };

  const { data, isLoading } = useListHotels(queryParams, {
    query: { queryKey: getListHotelsQueryKey(queryParams) }
  });

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Header */}
      <div className="bg-[#1c1917] pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-orange-300 font-semibold text-sm uppercase tracking-widest mb-3 block">Browse & Book</span>
            <h1 className="font-['DM_Serif_Display'] text-5xl md:text-6xl text-white mb-4">Hotels Across India</h1>
            <p className="text-white/60 text-lg">
              {total > 0 ? `${total} curated stays found` : "Find your perfect stay"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search + Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hotels, destinations..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 shadow-sm transition-all"
              data-testid="input-hotel-search"
            />
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2.5 px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-all shadow-sm"
          >
            <SlidersHorizontal size={16} />
            Filters
            {(minPrice || maxPrice || minRating > 0) && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
          </button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Price Range (₹/night)</label>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/30" />
                      <span className="text-gray-400">—</span>
                      <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/30" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Star Rating</label>
                    <div className="flex gap-2">
                      {[0, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          onClick={() => { setMinRating(r); setPage(1); }}
                          className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${minRating === r ? "bg-orange-600 border-orange-600 text-white" : "border-gray-200 text-gray-600 hover:border-orange-400"}`}
                        >
                          {r === 0 ? "All" : `${r}★+`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => { setMinPrice(""); setMaxPrice(""); setMinRating(0); setPage(1); }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-500 mt-auto transition-colors"
                  >
                    <X size={14} /> Clear all
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* State chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 mb-8">
          {STATES.map((state) => (
            <button
              key={state}
              onClick={() => { setSelectedState(state); setPage(1); }}
              className={`flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedState === state
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white border-transparent shadow-lg shadow-orange-500/25"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-600"
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Hotels grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl shimmer-skeleton h-80" />
            ))}
          </div>
        ) : data?.hotels?.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="font-['DM_Serif_Display'] text-2xl text-gray-700 mb-2">No hotels found</h3>
            <p className="text-sm">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.hotels?.map((hotel: any) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-40 transition-all">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === page ? "bg-orange-600 text-white shadow-lg shadow-orange-500/25" : "border border-gray-200 text-gray-600 hover:border-orange-400"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-40 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
