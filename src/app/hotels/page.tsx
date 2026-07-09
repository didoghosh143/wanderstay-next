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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => setLoc(`/hotels/${hotel.id}`)}
      className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-orange-900/10 flex-shrink-0 snap-center w-full md:w-[350px] h-[440px] transition-all border border-white/50 bg-slate-50"
      data-testid={`card-hotel-${hotel.id}`}
    >
      <LocationImage
        title={hotel.name}
        fallbackUrl={hotel.images?.[0] || "/images/hotel-kolkata-1.png"}
        alt={hotel.name}
        containerClassName="absolute inset-0"
        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
      />
      
      {/* Light subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top right like button - Light Glassmorphism */}
      <button
        onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
        className="absolute top-5 right-5 w-9 h-9 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-sm z-20"
        aria-label="Save hotel"
      >
        <Heart size={16} className={liked ? "text-rose-500 fill-rose-500" : "text-gray-500"} />
      </button>

      {/* Content at bottom - Light, Feel-Good Glassmorphic Panel */}
      <div className="absolute inset-x-4 bottom-4 p-5 rounded-[1.5rem] bg-gradient-to-br from-white/80 via-white/70 to-orange-50/60 backdrop-blur-md border border-white/50 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-orange-600 text-[11px] font-bold tracking-[0.15em] uppercase">
              <MapPin size={14} className="text-orange-500" />
              <span>{hotel.destinationName}, {hotel.state}</span>
            </div>
            {hotel.freeCancellation && (
              <span className="text-[9px] bg-emerald-500/20 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Free cancel</span>
            )}
          </div>
          
          <div className="flex items-start justify-between mb-3 gap-2">
            <h3 className="font-['DM_Serif_Display'] text-2xl text-gray-900 group-hover:text-orange-600 transition-colors duration-300 leading-tight line-clamp-2">{hotel.name}</h3>
            <div className="flex items-center gap-1 bg-white/50 px-2 py-1.5 rounded-lg border border-white/40 flex-shrink-0 shadow-sm mt-1">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span className="text-gray-900 font-bold text-xs">{hotel.rating?.toFixed(1) || "4.8"}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-3 flex-wrap">
            {hotel.amenities?.slice(0, 3).map((a: string) => {
              const Icon = AMENITY_ICONS[a] || Wifi;
              return (
                <div key={a} className="flex items-center gap-1 bg-black/5 text-gray-700 text-[10px] font-medium px-2 py-1 rounded-full border border-black/5">
                  <Icon size={10} /> <span>{a}</span>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-end justify-between mt-auto">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.15em] block">from</span>
              <p className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-baseline gap-1">₹{hotel.pricePerNight?.toLocaleString("en-IN")}<span className="text-[10px] sm:text-xs font-medium text-gray-600">/night</span></p>
            </div>
            
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-900 border border-gray-200 transform group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-400 group-hover:scale-110 transition-all duration-300 shadow-md">
              <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>
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
