"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hotel, Plus, MapPin, Star, Building, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProviderDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // Wait, I should fetch the provider's hotels. Since we haven't built the API for it yet, we can build a placeholder UI that looks great.
  // The objective is to build the UI dashboard. We can mock the data or leave it empty state for now.
  
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "provider")) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen bg-[#1c1917] flex justify-center items-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1c1917] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-['DM_Serif_Display'] text-white">Provider Dashboard</h1>
            <p className="text-white/60 mt-1">Manage your properties, bookings, and revenue.</p>
          </div>
          <Link href="/provider/listings/new">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Plus size={18} />
              Add New Property
            </motion.button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#292524] p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Building className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-white/60 text-sm font-medium">Total Properties</p>
                <h3 className="text-2xl font-bold text-white">0</h3>
              </div>
            </div>
          </div>
          <div className="bg-[#292524] p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                <Users className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-white/60 text-sm font-medium">Total Bookings</p>
                <h3 className="text-2xl font-bold text-white">0</h3>
              </div>
            </div>
          </div>
          <div className="bg-[#292524] p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                <Star className="text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-white/60 text-sm font-medium">Average Rating</p>
                <h3 className="text-2xl font-bold text-white">-</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-[#292524] rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Your Properties</h2>
          </div>
          
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building size={24} className="text-white/40" />
            </div>
            <h3 className="text-white font-medium mb-2">No properties yet</h3>
            <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
              You haven't added any properties to Wanderstay yet. Add your first property to start receiving bookings.
            </p>
            <Link href="/provider/listings/new">
              <button className="text-orange-400 hover:text-orange-300 font-medium text-sm">
                + Add your first property
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
