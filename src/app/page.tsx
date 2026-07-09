"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname as useLocation, useRouter } from "next/navigation";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Users, Star, ArrowRight, ChevronDown, Sparkles, TrendingUp, Shield, Zap, Heart } from "lucide-react";
import { useListDestinations, useListHotels, getListDestinationsQueryKey, getListHotelsQueryKey } from "@/lib/mockApi";
import { useAuth } from "@/contexts/AuthContext";
import { LocationImage } from "@/components/LocationImage";

// ── Animated counter ──────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(start);
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString("en-IN")}{suffix}</span>;
}

// ── Fade-up variant ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

// ── Destination card ──────────────────────────────────────────────────────
function DestCard({ dest, index }: { dest: any; index: number }) {
  const router = useRouter(); const setLoc = (path: string) => router.push(path);
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => setLoc(`/destinations/${dest.slug}`)}
      className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-orange-900/10 flex-shrink-0 snap-center w-[85vw] md:w-[350px] h-[440px] transition-all border border-white/50 bg-slate-50"
      data-testid={`card-destination-${dest.slug}`}
    >
      <LocationImage
        title={dest.name}
        fallbackUrl={dest.images?.[0] || "/images/dest-kolkata.png"}
        alt={dest.name}
        containerClassName="absolute inset-0"
        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
      />
      
      {/* Light subtle gradient - no harsh black */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top right rating badge - Light Glassmorphism */}
      <div className="absolute top-5 right-5 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/40 shadow-sm text-gray-900">
        <Star size={14} className="text-amber-500 fill-amber-500" />
        <span className="font-bold text-sm">{dest.rating?.toFixed(1) || "4.7"}</span>
      </div>

      {/* Content at bottom - Light, Feel-Good Glassmorphic Panel */}
      <div className="absolute inset-x-4 bottom-4 p-5 rounded-[1.5rem] bg-gradient-to-br from-white/80 via-white/70 to-orange-50/60 backdrop-blur-md border border-white/50 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-2 text-orange-600 text-[11px] font-bold tracking-[0.15em] uppercase">
            <MapPin size={14} className="text-orange-500" />
            <span>{dest.state}</span>
          </div>
          
          <div className="flex items-end justify-between mb-4">
            <h3 className="font-['DM_Serif_Display'] text-3xl sm:text-4xl text-gray-900 group-hover:text-orange-600 transition-colors duration-300 leading-none">{dest.name}</h3>
            <span className="text-gray-600 text-xs font-medium mb-1">{dest.properties || 42} hotels</span>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-wrap gap-2">
              {dest.tags?.slice(0, 2).map((t: string) => (
                <span key={t} className="bg-black/5 text-gray-700 text-[11px] font-medium px-3 py-1.5 rounded-full border border-black/5">
                  {t}
                </span>
              ))}
            </div>
            
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 border border-gray-200 transform group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-400 group-hover:scale-110 transition-all duration-300 shadow-md">
              <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Hotel card ────────────────────────────────────────────────────────────
function HotelCard({ hotel }: { hotel: any }) {
  const router = useRouter(); const setLoc = (path: string) => router.push(path);
  const [liked, setLiked] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => setLoc(`/hotels/${hotel.id}`)}
      className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-orange-900/10 flex-shrink-0 snap-center w-[85vw] md:w-[350px] h-[440px] transition-all border border-white/50 bg-slate-50"
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
          <div className="flex items-center gap-1.5 mb-2 text-orange-600 text-[11px] font-bold tracking-[0.15em] uppercase">
            <MapPin size={14} className="text-orange-500" />
            <span>{hotel.destinationName}, {hotel.state}</span>
          </div>
          
          <div className="flex items-start justify-between mb-4 gap-2">
            <h3 className="font-['DM_Serif_Display'] text-2xl sm:text-3xl text-gray-900 group-hover:text-orange-600 transition-colors duration-300 leading-tight">{hotel.name}</h3>
            <div className="flex items-center gap-1 bg-white/50 px-2 py-1.5 rounded-lg border border-white/40 flex-shrink-0 shadow-sm">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span className="text-gray-900 font-bold text-xs">{hotel.rating?.toFixed(1) || "4.8"}</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between mt-auto">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.15em] mb-1 block">from</span>
              <p className="text-2xl font-extrabold text-gray-900 flex items-baseline gap-1">₹{hotel.pricePerNight?.toLocaleString("en-IN")}<span className="text-xs font-medium text-gray-600">/night</span></p>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 border border-gray-200 transform group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-400 group-hover:scale-110 transition-all duration-300 shadow-md">
              <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main home page ────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter(); const setLoc = (path: string) => router.push(path);
  const { openAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Guests");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const statsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const hotelsRef = useRef<HTMLDivElement>(null);

  const statsInView = useInView(statsRef, { once: true });
  const destInView = useInView(destRef, { once: true, margin: "-80px" });
  const hotelsInView = useInView(hotelsRef, { once: true, margin: "-80px" });

  const { data: destData } = useListDestinations(
    { page: 1, limit: 6 },
    { query: { queryKey: getListDestinationsQueryKey({ page: 1, limit: 6 }) } }
  );

  const { data: hotelsData } = useListHotels(
    { page: 1, limit: 6 },
    { query: { queryKey: getListHotelsQueryKey({ page: 1, limit: 6 }) } }
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    setLoc(`/hotels?${params.toString()}`);
  };

  const STATES = ["West Bengal", "Rajasthan", "Goa", "Kerala", "Himachal Pradesh", "Tamil Nadu", "Uttarakhand"];

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1c1917]">
        {/* Parallax bg */}
        <motion.div
          className="absolute inset-0 bg-cover bg-[center_top_2rem] sm:bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80)", y: parallaxY }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1917]/60 via-[#1c1917]/30 to-[#1c1917]/80" />
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "2s" }} />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-36 sm:pt-32"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium px-5 py-2.5 rounded-full mb-8 shadow-lg"
          >
            <Sparkles size={14} className="text-orange-300" />
            India's Premier Travel Platform
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse ml-1" />
          </motion.div>

          {/* Heading */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mb-6"
          >
            {["Discover India's", "Timeless Magic"].map((line, i) => (
              <motion.div key={i} variants={fadeUp}>
                <h1 className="font-['DM_Serif_Display'] text-5xl sm:text-7xl md:text-8xl text-white leading-tight">
                  {i === 1 ? (
                    <span className="italic">{line}</span>
                  ) : line}
                </h1>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            From the tea gardens of Darjeeling to the palaces of Rajasthan — your extraordinary journey begins here.
          </motion.p>

          {/* Search card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="glass-card rounded-3xl p-4 md:p-6 max-w-4xl mx-auto shadow-2xl shadow-black/30"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 bg-white/10 hover:bg-white/15 transition-colors rounded-2xl px-5 py-3.5 flex items-center gap-3">
                <Search size={18} className="text-orange-300 flex-shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Where in India?"
                  className="bg-transparent text-white placeholder-white/40 outline-none w-full text-sm font-medium"
                  data-testid="input-hero-search"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="bg-white/10 hover:bg-white/15 transition-colors rounded-2xl px-5 py-3.5 flex items-center gap-3">
                  <Calendar size={16} className="text-orange-300 flex-shrink-0" />
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="bg-transparent text-white/80 outline-none text-sm min-w-[120px]" />
                </div>
                <div className="bg-white/10 hover:bg-white/15 transition-colors rounded-2xl px-5 py-3.5 flex items-center gap-3">
                  <Calendar size={16} className="text-orange-300 flex-shrink-0" />
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="bg-transparent text-white/80 outline-none text-sm min-w-[120px]" />
                </div>
              </div>
              <div className="bg-white/10 hover:bg-white/15 transition-colors rounded-2xl px-5 py-3.5 flex items-center gap-3 min-w-[140px]">
                <Users size={16} className="text-orange-300 flex-shrink-0" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent text-white/80 outline-none text-sm w-full appearance-none cursor-pointer"
                >
                  {["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5+ Guests"].map(g => (
                    <option key={g} value={g} className="text-gray-900">{g}</option>
                  ))}
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSearch}
                className="btn-primary px-8 py-3.5 text-sm flex items-center gap-2"
                data-testid="button-hero-search"
              >
                <Search size={16} /><span>Search</span>
              </motion.button>
            </div>
          </motion.div>

          {/* State quick-filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
          >
            {STATES.map((state) => (
              <button
                key={state}
                onClick={() => setLoc(`/destinations?state=${encodeURIComponent(state)}`)}
                className="text-white/60 hover:text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 transition-all duration-200"
              >
                {state}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── West Bengal Spotlight ──────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-[#292524] to-[#1a0f3d] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌿</span>
                <span className="text-orange-300 font-semibold text-sm uppercase tracking-wider">Local Spotlight</span>
              </div>
              <h2 className="font-['DM_Serif_Display'] text-4xl md:text-5xl text-white mb-4">
                Explore West Bengal
              </h2>
              <p className="text-white/60 max-w-lg text-base leading-relaxed">
                From Bankura's terracotta temples and Bishnupur's ancient heritage to Darjeeling's misty peaks, Sundarbans' wild mangroves, and Kolkata's colonial grandeur — your home state is extraordinary.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Kolkata", "Darjeeling", "Sundarbans", "Digha", "Bishnupur", "Shantiniketan"].map((place) => (
                <motion.button
                  key={place}
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={() => setLoc(`/destinations/${place.toLowerCase()}`)}
                  className="bg-white/10 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200"
                >
                  {place}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Destinations ─────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6" ref={destRef}>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={destInView ? "show" : "hidden"}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-14"
        >
          <motion.div variants={fadeUp}>
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-widest mb-3 block">Top Picks</span>
            <h2 className="font-['DM_Serif_Display'] text-5xl md:text-6xl text-gray-900">
              Featured<br /><span className="italic">Destinations</span>
            </h2>
          </motion.div>
          <motion.button
            variants={fadeUp}
            onClick={() => setLoc("/destinations")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold text-sm group mt-6 md:mt-0"
          >
            Explore all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={destInView ? "show" : "hidden"}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 md:overflow-visible"
        >
          {destData?.destinations ? (
            destData.destinations.slice(0, 6).map((dest: any, i: number) => (
              <DestCard key={dest.id} dest={dest} index={i} />
            ))
          ) : (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[2rem] shimmer-skeleton w-[85vw] md:w-[350px] flex-shrink-0 h-[440px]" />
            ))
          )}
        </motion.div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section ref={statsRef} className="py-20 bg-[#1c1917] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-['DM_Serif_Display'] text-4xl md:text-5xl text-white mb-3">Trusted by Travelers</h2>
            <p className="text-white/50">Across every corner of incredible India</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: 500000, suffix: "+", label: "Happy Travelers", icon: <TrendingUp className="text-orange-400" size={28} /> },
              { stat: 10000, suffix: "+", label: "Curated Hotels", icon: <Shield className="text-amber-400" size={28} /> },
              { stat: 150, suffix: "+", label: "Destinations", icon: <MapPin className="text-pink-400" size={28} /> },
              { stat: 49, suffix: "/5 ★", label: "Avg. Rating", icon: <Zap className="text-amber-400" size={28} /> },
            ].map(({ stat, suffix, label, icon }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">{icon}</div>
                <div className="font-['DM_Serif_Display'] text-4xl md:text-5xl text-white mb-2">
                  <Counter target={stat} suffix={suffix} />
                </div>
                <p className="text-white/50 font-medium text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Hotels ────────────────────────────────────── */}
      <section className="py-24" ref={hotelsRef}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={hotelsInView ? "show" : "hidden"}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12"
          >
            <motion.div variants={fadeUp}>
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-widest mb-3 block">Handpicked</span>
              <h2 className="font-['DM_Serif_Display'] text-5xl md:text-6xl text-gray-900">
                Luxury<br /><span className="italic">Hotels</span>
              </h2>
            </motion.div>
            <motion.button
              variants={fadeUp}
              onClick={() => setLoc("/hotels")}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold text-sm group mt-6 md:mt-0"
            >
              View all hotels <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate={hotelsInView ? "show" : "hidden"}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 md:overflow-visible"
          >
            {hotelsData?.hotels ? (
              hotelsData.hotels.slice(0, 6).map((hotel: any) => (
                <motion.div key={hotel.id} variants={fadeUp} className="flex-shrink-0">
                  <HotelCard hotel={hotel} />
                </motion.div>
              ))
            ) : (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl shimmer-skeleton h-[380px] w-[85vw] md:w-[350px] flex-shrink-0" />
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Why Wanderstay ────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-['DM_Serif_Display'] text-5xl text-gray-900 mb-4">Why Choose Wanderstay?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">The smartest way to discover and book incredible stays across India.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: "🔒", title: "Secure Booking", desc: "End-to-end encrypted transactions. Your payment and personal data are always protected.", color: "from-orange-500 to-amber-500" },
              { emoji: "❌", title: "Free Cancellation", desc: "Change of plans? Most hotels offer free cancellation up to 24 hours before check-in.", color: "from-rose-500 to-pink-500" },
              { emoji: "🏆", title: "Curated Quality", desc: "Every property is personally reviewed and verified by our India travel experts.", color: "from-amber-500 to-orange-500" },
            ].map(({ emoji, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl p-8 shadow-lg shadow-orange-100/50 border border-orange-100/60"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                  {emoji}
                </div>
                <h3 className="font-['DM_Serif_Display'] text-2xl text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-orange-600 via-amber-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 3px 3px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto px-6 text-center"
        >
          <div className="text-5xl mb-6">✉️</div>
          <h2 className="font-['DM_Serif_Display'] text-5xl md:text-6xl text-white mb-5">Stay Inspired</h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            Get exclusive travel guides, secret destinations across Bengal and beyond, and VIP hotel deals delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/15 backdrop-blur border border-white/25 rounded-2xl px-6 py-4 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-white text-orange-700 font-bold px-8 py-4 rounded-2xl hover:bg-orange-50 transition-colors shadow-xl whitespace-nowrap text-sm"
            >
              Subscribe Free
            </motion.button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
