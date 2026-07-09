"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, MapPin, Heart, ArrowRight } from "lucide-react";
import { LocationImage } from "./LocationImage";

export function HotelCard({ hotel, className = "" }: { hotel: any; className?: string }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`bg-white rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(249,115,22,0.15)] border border-gray-100 hover:border-orange-200 transition-all duration-300 group flex flex-col ${className}`}
      data-testid={`card-hotel-${hotel.id}`}
    >
      <div className="relative h-64 overflow-hidden group/hotel shrink-0">
        <LocationImage
          title={hotel.name}
          fallbackUrl={hotel.images?.[0] || "/images/hotel-kolkata-1.png"}
          alt={hotel.name}
          containerClassName="absolute inset-0"
          className="w-full h-full object-cover transition-transform duration-700 group-hover/hotel:scale-110"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 z-10"
          aria-label="Save hotel"
        >
          <Heart size={16} className={liked ? "text-rose-500 fill-rose-500" : "text-gray-400"} />
        </button>
        {hotel.rating >= 4.8 && (
          <div className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg z-10">
            Top Rated
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight pr-2 line-clamp-1">{hotel.name}</h3>
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg shrink-0">
            <Star size={12} className="text-orange-600 fill-orange-600" />
            <span className="text-orange-700 font-bold text-xs">{hotel.rating?.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 mb-4 mt-1">
          <MapPin size={14} className="text-gray-400 shrink-0" />
          <span className="text-gray-500 text-sm line-clamp-1">{hotel.destinationName}, {hotel.state}</span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5 block">from</span>
            <p className="text-2xl font-extrabold text-gray-900 flex items-baseline gap-1">
              ₹{hotel.pricePerNight?.toLocaleString("en-IN")}
              <span className="text-sm font-medium text-gray-500 font-normal">/night</span>
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/hotels/${hotel.id}`);
            }}
            className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors duration-300"
            aria-label="View details"
          >
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
