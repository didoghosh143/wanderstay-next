"use client";
import { usePathname as useLocation, useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, ArrowRight, ChevronRight, Loader2, Heart } from "lucide-react";
import { useState } from "react";
import { useGetDestination, useListHotels, getGetDestinationQueryKey, getListHotelsQueryKey, LOCATION_COORDS } from "@/lib/mockApi";
import { GoogleMap } from "@/components/GoogleMap";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function HotelCard({ hotel }: { hotel: any }) {
  const router = useRouter(); const setLoc = (path: string) => router.push(path);
  const [liked, setLiked] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 group"
      data-testid={`card-hotel-${hotel.id}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={hotel.images?.[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center" aria-label="Save">
          <Heart size={14} className={liked ? "text-rose-500 fill-rose-500" : "text-gray-400"} />
        </button>
        <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-lg">
          <div className="flex gap-0.5">{Array.from({ length: hotel.starRating || 4 }).map((_, i) => (<Star key={i} size={9} className="text-amber-400 fill-amber-400" />))}</div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{hotel.name}</h3>
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg flex-shrink-0">
            <Star size={10} className="text-orange-600 fill-orange-600" />
            <span className="text-orange-700 font-bold text-xs">{hotel.rating?.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <MapPin size={11} /><span>{hotel.address?.slice(0, 40)}...</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">per night</p>
            <p className="font-bold text-gray-900 text-lg">₹{hotel.pricePerNight?.toLocaleString("en-IN")}</p>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setLoc(`/hotels/${hotel.id}`)} className="btn-primary text-xs px-4 py-2.5">
            <span>Book Now</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function DestinationDetail() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : "";
  const router = useRouter(); const setLoc = (path: string) => router.push(path);

  const { data: dest, isLoading, isError } = useGetDestination(slug, {
    query: { queryKey: getGetDestinationQueryKey(slug), enabled: !!slug }
  });

  const { data: hotelsData } = useListHotels(
    { destinationSlug: slug, limit: 12 },
    { query: { queryKey: getListHotelsQueryKey({ destinationSlug: slug, limit: 12 }), enabled: !!slug } }
  );

  const coords = LOCATION_COORDS[slug];

  if (isLoading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-orange-600" />
    </div>
  );

  if (isError || !dest) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4 px-4">
      <div className="text-6xl">😔</div>
      <h2 className="font-['DM_Serif_Display'] text-2xl sm:text-3xl text-gray-800 text-center">Destination not found</h2>
      <Link href="/destinations" className="text-orange-600 font-semibold hover:underline">Browse destinations</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Hero */}
      <div className="relative h-[50vh] sm:h-[65vh] min-h-[300px] sm:min-h-[400px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${dest.images?.[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-[#1c1917]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <ChevronRight size={14} />
            <span className="text-white">{dest.name}</span>
          </nav>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-orange-300" />
              <span className="text-orange-300 font-semibold text-xs sm:text-sm uppercase tracking-wider">{dest.state}, {dest.country}</span>
            </div>
            <h1 className="font-['DM_Serif_Display'] text-3xl sm:text-5xl md:text-7xl text-white mb-4">{dest.name}</h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full border border-white/20">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-white font-bold text-sm">{dest.rating?.toFixed(1)}</span>
              </div>
              <div className="text-white/60 text-sm">{dest.hotelCount} hotels available</div>
              {dest.bestTimeToVisit && (
                <div className="hidden sm:flex items-center gap-1.5 text-white/60 text-sm">
                  <Calendar size={13} className="text-orange-300" />
                  <span>Best: {dest.bestTimeToVisit}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-['DM_Serif_Display'] text-2xl sm:text-3xl text-gray-900 mb-4">About {dest.name}</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-8">{dest.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {dest.tags?.map((tag: string) => (
                  <span key={tag} className="bg-orange-50 text-orange-700 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full border border-orange-100">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hotels in this destination */}
              {hotelsData?.hotels && hotelsData.hotels.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-['DM_Serif_Display'] text-2xl sm:text-3xl text-gray-900">Hotels in {dest.name}</h2>
                    <button onClick={() => setLoc(`/hotels?destinationSlug=${slug}`)} className="flex items-center gap-1.5 text-orange-600 font-semibold text-sm hover:text-orange-800 group">
                      View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  >
                    {hotelsData.hotels.slice(0, 4).map((hotel: any) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-5">
              {/* Quick facts */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h3 className="font-['DM_Serif_Display'] text-xl text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <MapPin size={15} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">Location</p>
                      <p className="text-sm font-medium text-gray-800">{dest.state}, {dest.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Star size={15} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">Rating</p>
                      <p className="text-sm font-medium text-gray-800">{dest.rating?.toFixed(1)} / 5.0</p>
                    </div>
                  </div>
                  {dest.bestTimeToVisit && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Calendar size={15} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Best Time to Visit</p>
                        <p className="text-sm font-medium text-gray-800">{dest.bestTimeToVisit}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <span className="text-amber-600 font-bold text-xs">🏨</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">Available Hotels</p>
                      <p className="text-sm font-medium text-gray-800">{dest.hotelCount} properties</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl p-5 sm:p-6 text-white">
                <h3 className="font-['DM_Serif_Display'] text-xl sm:text-2xl mb-2">Ready to Explore?</h3>
                <p className="text-white/70 text-sm mb-5">Book a hotel in {dest.name} and start your adventure.</p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setLoc(`/hotels?state=${encodeURIComponent(dest.state)}`)}
                  className="w-full bg-white text-orange-700 font-bold py-3 rounded-xl hover:bg-orange-50 transition-colors text-sm"
                >
                  Browse Hotels in {dest.state}
                </motion.button>
              </div>

              {/* Google Map */}
              {coords && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="relative h-48 sm:h-56">
                    <GoogleMap
                      lat={coords.lat}
                      lng={coords.lng}
                      label={`${dest.name}, ${dest.state}`}
                      showNearby={true}
                      className="h-full"
                    />
                  </div>
                  <div className="p-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name + " " + dest.state + " India")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-all"
                    >
                      <MapPin size={14} /> Open in Google Maps ↗
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
