"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";

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
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[92vw] max-w-[320px] md:w-[320px]"
        >
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-orange-100 flex flex-col group">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              aria-label="Close offer"
            >
              <X size={14} />
            </button>

            {/* Image Header */}
            <div className="relative h-28 overflow-hidden bg-gray-200">
              <img
                src="/images/hotel-1.png"
                alt="Luxury Hotel"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-white">
                <div className="bg-rose-500 rounded-full p-1">
                  <Tag size={10} className="text-white fill-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Limited Time</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col">
              <h3 className="font-['DM_Serif_Display'] text-xl text-gray-900 leading-tight mb-1.5">
                20% Off Luxury Stays
              </h3>
              <p className="text-gray-500 text-xs mb-4 leading-relaxed">
                Book any premium hotel today and get an exclusive discount. Don't miss out!
              </p>
              
              <Link href="/hotels" onClick={handleClose} className="w-full">
                <button className="w-full py-2.5 px-4 bg-gray-900 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-colors duration-300 flex items-center justify-center gap-2 group/btn">
                  Claim Offer
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
