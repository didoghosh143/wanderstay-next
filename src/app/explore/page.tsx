"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, MapPin, X, Compass, ArrowRight, ExternalLink } from "lucide-react";
import { useSearchMonuments, useMonumentDetails, MonumentSearchResult } from "@/lib/exploreApi";

// ── Fade animations ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const CATEGORIES = {
  "🌍 World Wonders": ["Eiffel Tower", "Colosseum", "Machu Picchu", "Statue of Liberty", "Great Wall of China", "Pyramids of Giza"],
  "🇮🇳 Incredible India": ["Taj Mahal", "Hawa Mahal", "Gateway of India", "Qutb Minar", "Red Fort", "Mysore Palace"],
  "🐅 West Bengal": ["Victoria Memorial", "Howrah Bridge", "Darjeeling Himalayan Railway", "Hazarduari Palace", "Dakshineswar Kali Temple", "Belur Math"],
};

// ── Monument Detail Modal ──────────────────────────────────────────────────
function MonumentModal({ title, onClose }: { title: string; onClose: () => void }) {
  const { data, isLoading, isError } = useMonumentDetails(title);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur transition-colors"
        >
          <X size={20} />
        </button>

        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-violet-600">
            <Loader2 size={32} className="animate-spin" />
            <p className="font-medium text-sm text-gray-500">Discovering {title}...</p>
          </div>
        ) : isError || !data ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="text-4xl mb-2">🏛️</div>
            <h3 className="text-xl font-bold text-gray-900">Information Unavailable</h3>
            <p className="text-gray-500">We couldn't retrieve details for this location.</p>
          </div>
        ) : (
          <>
            {/* Header Image */}
            <div className="relative h-64 sm:h-80 bg-gray-100 flex-shrink-0">
              {data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <Compass size={48} className="mb-4 opacity-20" />
                  <span>No image available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <h2 className="font-['DM_Serif_Display'] text-3xl sm:text-5xl text-white drop-shadow-lg leading-tight">
                  {data.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="prose prose-violet max-w-none">
                {data.extract.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800 font-semibold transition-colors"
                >
                  Read more on Wikipedia <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Suggested Monument Card ────────────────────────────────────────────────
function SuggestedMonumentCard({ 
  title, 
  onClick 
}: { 
  title: string; 
  onClick: () => void 
}) {
  const { data, isLoading } = useMonumentDetails(title);
  
  const imageSource = data?.thumbnailUrl || data?.imageUrl;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.01 }}
      onClick={onClick}
      className="relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-lg group bg-gray-100"
    >
      {imageSource ? (
        <img 
          src={imageSource} 
          alt={title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
          {isLoading ? (
             <Loader2 size={24} className="animate-spin text-gray-400" />
          ) : (
             <Compass size={24} className="text-gray-400 opacity-50" />
          )}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin size={14} className="text-violet-300" />
          <span className="text-violet-300 font-semibold text-xs tracking-wider uppercase">Monument</span>
        </div>
        <h3 className="font-['DM_Serif_Display'] text-2xl text-white">{title}</h3>
      </div>
    </motion.div>
  );
}

// ── Page Component ─────────────────────────────────────────────────────────
export default function Explore() {
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedMonument, setSelectedMonument] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<keyof typeof CATEGORIES>("🌍 World Wonders");

  const { data: results, isLoading, isError } = useSearchMonuments(activeSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setActiveSearch("");
  };

  return (
    <div className="min-h-screen bg-[#fafbff] pt-20">
      {/* ── Hero Section ── */}
      <section className="relative bg-[#060b18] py-20 sm:py-28 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4 block">World Knowledge Base</span>
            <h1 className="font-['DM_Serif_Display'] text-4xl sm:text-6xl text-white mb-6 leading-tight">
              Explore Every Corner <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
                of the Globe
              </span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-12">
              Discover the history and beauty of monuments, cities, and natural wonders worldwide.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onSubmit={handleSearch}
            className="flex relative max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-2xl focus-within:bg-white/15 focus-within:border-white/30 transition-all"
          >
            <div className="flex-1 flex items-center gap-3 px-6">
              <Search size={20} className="text-violet-300 flex-shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for Taj Mahal, Grand Canyon, Eiffel Tower..."
                className="w-full bg-transparent text-white placeholder-white/40 outline-none text-base sm:text-lg"
              />
              {query && (
                <button type="button" onClick={clearSearch} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!query.trim()}
              className="bg-white text-violet-700 hover:bg-violet-50 font-bold px-8 py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Explore
            </button>
          </motion.form>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 sm:py-24 min-h-[50vh]">
        
        {/* Loading State */}
        {isLoading && activeSearch && (
          <div className="flex flex-col items-center justify-center py-20 text-violet-600 gap-4">
            <Loader2 size={40} className="animate-spin" />
            <p className="text-gray-500 font-medium">Searching the archives...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h3>
            <p className="text-gray-500">We couldn't connect to the Wikipedia database. Please try again.</p>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && !isError && activeSearch && results && (
          <motion.div variants={stagger} initial="hidden" animate="show">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900">Results for "{activeSearch}"</h2>
              <p className="text-gray-500 mt-1">{results.length} locations found</p>
            </div>
            
            {results.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
                <p className="text-gray-500">Try searching for something else like "Victoria Memorial".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result: MonumentSearchResult) => (
                  <motion.div
                    key={result.pageid}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    onClick={() => setSelectedMonument(result.title)}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:border-violet-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-['DM_Serif_Display'] text-2xl text-gray-900 group-hover:text-violet-700 transition-colors line-clamp-1">
                        {result.title}
                      </h3>
                      <div className="w-8 h-8 rounded-full bg-violet-50 flex flex-shrink-0 items-center justify-center group-hover:bg-violet-100 transition-colors text-violet-600">
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                    {/* Render raw HTML snippet safely (Wikipedia API returns HTML snippets) */}
                    <p
                      className="text-gray-500 text-sm leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: result.snippet + "..." }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Default Suggestions (Shown when not searching) */}
        {!activeSearch && (
          <motion.div variants={stagger} initial="hidden" animate="show">
            <div className="text-center mb-10">
              <h2 className="font-['DM_Serif_Display'] text-3xl md:text-4xl text-gray-900 mb-6">Wonders to Discover</h2>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {Object.keys(CATEGORIES).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as keyof typeof CATEGORIES)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeTab === tab 
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-200" 
                        : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300 hover:text-violet-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {CATEGORIES[activeTab].map((title, i) => (
                  <SuggestedMonumentCard 
                    key={title} 
                    title={title} 
                    onClick={() => setSelectedMonument(title)} 
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* ── Modal Portal ── */}
      <AnimatePresence>
        {selectedMonument && (
          <MonumentModal
            title={selectedMonument}
            onClose={() => setSelectedMonument(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
