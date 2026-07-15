"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Building, AlertTriangle, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"users" | "providers" | "listings">("users");
  
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
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
        <div>
          <h1 className="text-3xl font-['DM_Serif_Display'] text-white flex items-center gap-3">
            <ShieldCheck className="text-orange-500" size={32} />
            Admin Dashboard
          </h1>
          <p className="text-white/60 mt-1">Platform overview and moderation tools.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#292524] p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium">Total Users</p>
              <h3 className="text-xl font-bold text-white">0</h3>
            </div>
          </div>
          <div className="bg-[#292524] p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium">Total Providers</p>
              <h3 className="text-xl font-bold text-white">0</h3>
            </div>
          </div>
          <div className="bg-[#292524] p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Building className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium">Total Listings</p>
              <h3 className="text-xl font-bold text-white">0</h3>
            </div>
          </div>
          <div className="bg-[#292524] p-5 rounded-2xl border border-rose-500/20 flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-rose-400" size={20} />
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium">Pending Approvals</p>
              <h3 className="text-xl font-bold text-white">0</h3>
            </div>
          </div>
        </div>

        {/* Data Tabs */}
        <div className="bg-[#292524] rounded-3xl border border-white/5 overflow-hidden">
          <div className="border-b border-white/5 p-2 flex gap-1">
            {(["users", "providers", "listings"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium rounded-xl transition-all capitalize ${
                  activeTab === tab 
                  ? "bg-white/10 text-white" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            {activeTab === "users" && (
              <>
                <Users size={40} className="text-white/20 mb-4" />
                <h3 className="text-white font-medium mb-1">User Management</h3>
                <p className="text-white/50 text-sm">List of registered tourists will appear here.</p>
              </>
            )}
            {activeTab === "providers" && (
              <>
                <ShieldCheck size={40} className="text-white/20 mb-4" />
                <h3 className="text-white font-medium mb-1">Provider Management</h3>
                <p className="text-white/50 text-sm">List of registered providers and verification statuses will appear here.</p>
              </>
            )}
            {activeTab === "listings" && (
              <>
                <Building size={40} className="text-white/20 mb-4" />
                <h3 className="text-white font-medium mb-1">Listing Approvals</h3>
                <p className="text-white/50 text-sm">Pending hotel and homestay listings will appear here for review.</p>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
