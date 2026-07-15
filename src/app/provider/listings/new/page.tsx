"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building, MapPin, IndianRupee, Image as ImageIcon } from "lucide-react";

export default function NewListingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "provider")) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen bg-[#1c1917] flex justify-center items-center text-white">Loading...</div>;
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all text-sm";

  return (
    <div className="min-h-screen bg-[#1c1917] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-['DM_Serif_Display'] text-white">Add New Property</h1>
          <p className="text-white/60 mt-1">List your hotel, resort, or homestay on Wanderstay.</p>
        </div>

        <div className="bg-[#292524] p-6 sm:p-8 rounded-3xl border border-white/5">
          <form className="space-y-6">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Building className="text-orange-500" size={20} />
                Basic Information
              </h2>
              <div>
                <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Property Name</label>
                <input type="text" placeholder="e.g. Taj Lake Palace" className={inputClass} />
              </div>
              <div>
                <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Description</label>
                <textarea rows={4} placeholder="Describe your property..." className={inputClass} />
              </div>
            </div>

            <hr className="border-white/5" />

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <MapPin className="text-orange-500" size={20} />
                Location
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Destination City</label>
                  <input type="text" placeholder="e.g. Udaipur" className={inputClass} />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">State</label>
                  <input type="text" placeholder="e.g. Rajasthan" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Full Address</label>
                <input type="text" placeholder="Complete street address" className={inputClass} />
              </div>
            </div>

            <hr className="border-white/5" />

            {/* Pricing */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <IndianRupee className="text-orange-500" size={20} />
                Pricing
              </h2>
              <div>
                <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Price per night (₹)</label>
                <input type="number" placeholder="e.g. 5000" className={inputClass} />
              </div>
            </div>
            
            <hr className="border-white/5" />
            
            {/* Images Placeholder */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <ImageIcon className="text-orange-500" size={20} />
                Images
              </h2>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center">
                <ImageIcon size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/60 text-sm">Drag and drop images here, or click to browse.</p>
                <p className="text-white/40 text-xs mt-1">Maximum 5 images allowed.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium">
                Cancel
              </button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-orange-500/20"
                onClick={(e) => {
                  e.preventDefault();
                  alert("This is a demo. Listing submitted for admin approval!");
                  router.push("/provider/dashboard");
                }}
              >
                Submit for Approval
              </motion.button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
