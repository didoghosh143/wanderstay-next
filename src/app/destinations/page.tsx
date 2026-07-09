"use client";
import { useState, useEffect } from "react";
import { usePathname as useLocation, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useListDestinations, getListDestinationsQueryKey } from "@/lib/mockApi";
import { LocationImage } from "@/components/LocationImage";

const STATES = ["All India", "West Bengal", "Rajasthan", "Goa", "Kerala", "Himachal Pradesh", "Tamil Nadu", "Uttarakhand", "Maharashtra", "Delhi", "Uttar Pradesh"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function DestCard({ dest }: { dest: any }) {
  const router = useRouter(); const setLoc = (path: string) => router.push(path);
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      onClick={() => setLoc(`/destinations/${dest.slug}`)}
      className="group bg-white rounded-3xl overflow-hidden cursor-pointer shadow-md shadow-black/5 hover:shadow-xl border border-gray-100 flex flex-col h-full"
      data-testid={`card-destination-${dest.slug}`}
    >
      <div className="relative h-[240px] overflow-hidden">
        <LocationImage
          title={dest.name}
          fallbackUrl={dest.images?.[0] || "/images/dest-kolkata.png"}
          alt={dest.name}
          containerClassName="absolute inset-0"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        {/* Top right rating badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm text-gray-900">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          <span className="font-bold text-xs">{dest.rating?.toFixed(1) || "4.7"}</span>
        </div>
      </div>

      <div className="p-6 bg-white flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2 text-orange-600 text-[10px] font-bold tracking-[0.15em] uppercase">
          <MapPin size={12} className="text-orange-500" />
          <span>{dest.state}</span>
        </div>
        
        <div className="flex items-end justify-between mb-4">
          <h3 className="font-['DM_Serif_Display'] text-3xl sm:text-4xl text-gray-900 group-hover:text-orange-600 transition-colors leading-none">{dest.name}</h3>
          <span className="text-gray-500 text-xs font-medium mb-1">{dest.hotelCount || 42} hotels</span>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-2">
            {dest.tags?.slice(0, 2).map((t: string) => (
              <span key={t} className="bg-gray-100 text-gray-600 text-[11px] font-medium px-3 py-1.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
          
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-gray-900 border border-gray-200 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-400 transition-all duration-300">
            <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Destinations() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const [search, setSearch] = useState(params.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedState, setSelectedState] = useState(params.get("state") || "All India");
  const [page, setPage] = useState(1);
  const router = useRouter(); const setLoc = (path: string) => router.push(path);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const queryParams: any = {
    page, limit: 12,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(selectedState !== "All India" && { state: selectedState }),
  };

  const { data, isLoading } = useListDestinations(queryParams, {
    query: { queryKey: getListDestinationsQueryKey(queryParams) }
  });

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Header */}
      <div className="bg-[#1c1917] pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-orange-300 font-semibold text-sm uppercase tracking-widest mb-3 block">India & Beyond</span>
            <h1 className="font-['DM_Serif_Display'] text-5xl md:text-6xl text-white mb-4">
              Discover Destinations
            </h1>
            <p className="text-white/60 text-lg">
              {total > 0 ? `${total} incredible destinations` : "Explore the beauty of India"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations, states..."
            className="w-full max-w-xl pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 shadow-sm transition-all"
            data-testid="input-destination-search"
          />
        </div>

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
              data-testid={`filter-state-${state.replace(/ /g, "-")}`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-3xl shimmer-skeleton h-80" />
            ))}
          </div>
        ) : data?.destinations?.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="font-['DM_Serif_Display'] text-2xl text-gray-700 mb-2">No destinations found</h3>
            <p className="text-sm mb-6">Try a different search or state filter.</p>
            <button onClick={() => { setSearch(""); setSelectedState("All India"); }} className="btn-primary px-6 py-2.5 text-sm"><span>Clear filters</span></button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${debouncedSearch}-${selectedState}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {data?.destinations?.map((dest: any) => (
                <DestCard key={dest.id} dest={dest} />
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
              <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === page ? "bg-orange-600 text-white shadow-lg shadow-orange-500/25" : "border border-gray-200 text-gray-600 hover:border-orange-400"}`}>{p}</button>
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
