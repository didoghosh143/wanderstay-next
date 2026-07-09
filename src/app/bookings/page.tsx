"use client";
import { useState } from "react";
import { usePathname as useLocation, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, MapPin, CheckCircle2, Clock, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { useListBookings, useCancelBooking, getListBookingsQueryKey } from "@/lib/mockApi";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type BookingStatus = "all" | "upcoming" | "completed" | "cancelled";

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  upcoming: { label: "Upcoming", icon: Clock, color: "text-orange-700", bg: "bg-orange-50" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-rose-700", bg: "bg-rose-50" },
};

function nights(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Bookings() {
  const router = useRouter(); const setLoc = (path: string) => router.push(path);
  const { isAuthenticated, openAuthModal } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<BookingStatus>("all");
  const [cancelId, setCancelId] = useState<number | null>(null);

  const { data: bookings, isLoading } = useListBookings({
    query: { enabled: isAuthenticated }
  });

  const cancelMutation = useCancelBooking({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        toast({ title: "Booking cancelled", description: "Your refund will be processed in 5-7 days." });
        setCancelId(null);
      },
      onError: () => {
        toast({ title: "Failed to cancel", description: "Please try again.", variant: "destructive" });
        setCancelId(null);
      },
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fafaf9] pt-12 flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="text-7xl mb-6">🔐</div>
          <h2 className="font-['DM_Serif_Display'] text-3xl sm:text-4xl text-gray-900 mb-3">Sign in Required</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">Please sign in to view and manage your travel bookings.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => openAuthModal("login")} className="btn-primary px-8 py-3.5">
            <span>Sign In</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const filtered = tab === "all" ? bookings : (bookings as any[])?.filter((b: any) => b.status === tab);

  const counts = {
    all: (bookings as any[])?.length ?? 0,
    upcoming: (bookings as any[])?.filter((b: any) => b.status === "upcoming").length ?? 0,
    completed: (bookings as any[])?.filter((b: any) => b.status === "completed").length ?? 0,
    cancelled: (bookings as any[])?.filter((b: any) => b.status === "cancelled").length ?? 0,
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Header */}
      <div className="bg-[#1c1917] pt-32 sm:pt-40 pb-10 sm:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-orange-300 font-semibold text-sm uppercase tracking-widest mb-3 block">Your Journey</span>
            <h1 className="font-['DM_Serif_Display'] text-3xl sm:text-5xl text-white mb-2">My Bookings</h1>
            <p className="text-white/60">{counts.all} booking{counts.all !== 1 ? "s" : ""} total</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {(["all", "upcoming", "completed", "cancelled"] as BookingStatus[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {counts[t] > 0 && <span className={`ml-1.5 text-xs ${tab === t ? "text-white/70" : "text-gray-400"}`}>({counts[t]})</span>}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-orange-600" /></div>
        ) : !filtered?.length ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="text-7xl mb-6">🧳</div>
            <h3 className="font-['DM_Serif_Display'] text-2xl sm:text-3xl text-gray-800 mb-3">No {tab === "all" ? "" : tab} bookings yet</h3>
            <p className="text-gray-500 mb-8">Your adventures are waiting to be booked!</p>
            <motion.button whileHover={{ scale: 1.04 }} onClick={() => setLoc("/hotels")} className="btn-primary px-8 py-3.5">
              <span>Explore Hotels</span>
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-5">
              {filtered?.map((booking: any, i: number) => {
                const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.upcoming;
                const Icon = config.icon;
                const nightCount = nights(booking.checkIn, booking.checkOut);
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-black/4 overflow-hidden"
                    data-testid={`card-booking-${booking.id}`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-44 h-44 sm:h-auto flex-shrink-0 bg-gray-100">
                        <img
                          src={booking.hotelImage}
                          alt={booking.hotelName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Info */}
                      <div className="flex-1 p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight mb-1">{booking.hotelName}</h3>
                            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                              <MapPin size={13} className="text-orange-400" />
                              <span>{booking.destinationName}</span>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.color} flex-shrink-0`}>
                            <Icon size={12} /> {config.label}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 py-3 sm:py-4 border-y border-gray-100">
                          <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Check-in</p>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={13} className="text-orange-500 hidden sm:block" />
                              <p className="text-xs sm:text-sm font-semibold text-gray-800">{fmt(booking.checkIn)}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Check-out</p>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={13} className="text-orange-500 hidden sm:block" />
                              <p className="text-xs sm:text-sm font-semibold text-gray-800">{fmt(booking.checkOut)}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Guests</p>
                            <div className="flex items-center gap-1.5">
                              <Users size={13} className="text-orange-500 hidden sm:block" />
                              <p className="text-xs sm:text-sm font-semibold text-gray-800">{booking.guests}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-400">{nightCount} night{nightCount > 1 ? "s" : ""}</p>
                            <p className="font-bold text-gray-900 text-lg sm:text-xl">₹{booking.totalPrice?.toLocaleString("en-IN")}</p>
                          </div>
                          {booking.status === "upcoming" && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setCancelId(booking.id)}
                              className="border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all"
                              data-testid={`button-cancel-${booking.id}`}
                            >
                              Cancel
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Cancel confirmation dialog */}
      <AnimatePresence>
        {cancelId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setCancelId(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-5 mx-auto">
                <AlertTriangle size={28} className="text-rose-500" />
              </div>
              <h3 className="font-['DM_Serif_Display'] text-2xl text-gray-900 text-center mb-3">Cancel Booking?</h3>
              <p className="text-gray-500 text-sm text-center mb-7">This action cannot be undone. Your refund will be processed within 5–7 business days.</p>
              <div className="flex gap-3">
                <button onClick={() => setCancelId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
                  Keep Booking
                </button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => cancelMutation.mutate({ id: cancelId })}
                  disabled={cancelMutation.isPending}
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  data-testid="button-confirm-cancel"
                >
                  {cancelMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
