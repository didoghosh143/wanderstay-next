"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LocationImage } from "./LocationImage";

export function SpecialOfferPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show the popup after 4 seconds if it hasn't been dismissed
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isDismissed]);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-[360px] md:w-[360px]"
        >
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-orange-100 flex flex-col group">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              aria-label="Close offer"
            >
              <X size={16} />
            </button>

            {/* Image Header */}
            <div className="relative h-32 overflow-hidden">
              <LocationImage
                title="Luxury Hotel"
                fallbackUrl="/images/hotel-kolkata-1.png"
                alt="Luxury Hotel"
                containerClassName="absolute inset-0"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white">
                <div className="bg-rose-500 rounded-full p-1">
                  <Tag size={12} className="text-white fill-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Limited Time</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col">
              <h3 className="font-['DM_Serif_Display'] text-2xl text-gray-900 leading-tight mb-2">
                20% Off Your First Luxury Stay
              </h3>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                Book any premium hotel today and get an exclusive discount on your reservation. Don't miss out!
              </p>
              
              <Link href="/hotels" onClick={handleClose} className="w-full">
                <button className="w-full py-3 px-4 bg-gray-900 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-colors duration-300 flex items-center justify-center gap-2 group/btn">
                  Claim Offer Now
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
