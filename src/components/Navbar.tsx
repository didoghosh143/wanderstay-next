"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname as useLocation, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Bookmark, ChevronDown, Compass } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout, getGetMeQueryKey } from "@/lib/mockApi";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const logout = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        queryClient.clear();
        toast({ title: "Signed out", description: "See you next time!" });
        setUserMenuOpen(false);
      },
    },
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: transparent ? "rgba(0,0,0,0)" : "rgba(10,15,40,0.96)",
          backdropFilter: transparent ? "blur(0px)" : "blur(24px)",
          boxShadow: transparent ? "none" : "0 1px 32px rgba(0,0,0,0.3)",
        }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all duration-300">
              <Compass size={18} className="text-white" />
            </div>
            <span className="font-['DM_Serif_Display'] text-xl font-normal text-white tracking-wide">
              Wanderstay
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
            <Link href="/explore" className="hover:text-white transition-colors duration-200 relative group">
              Explore
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            <Link href="/destinations" className="hover:text-white transition-colors duration-200 relative group">
              Destinations
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            <Link href="/hotels" className="hover:text-white transition-colors duration-200 relative group">
              Hotels
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold">{user.name.split(" ")[0]}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-[#0f1729] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white text-sm font-semibold">{user.name}</p>
                        <p className="text-white/50 text-xs">{user.email}</p>
                      </div>
                      <Link href="/bookings" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm">
                        <Bookmark size={15} /> My Bookings
                      </Link>
                      <button
                        onClick={() => logout.mutate({})}
                        className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-sm"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal("login")}
                  className="text-white/80 hover:text-white text-sm font-semibold px-4 py-2 transition-colors duration-200"
                >
                  Sign In
                </button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => openAuthModal("register")}
                  className="btn-primary text-sm px-6 py-2.5"
                >
                  <span>Get Started</span>
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#060b18]/98 backdrop-blur-2xl border-b border-white/10 px-5 py-6 space-y-2 md:hidden"
          >
            <Link href="/explore" className="block py-3 px-4 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium">
              Explore
            </Link>
            <Link href="/destinations" className="block py-3 px-4 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium">
              Destinations
            </Link>
            <Link href="/hotels" className="block py-3 px-4 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium">
              Hotels
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/bookings" className="flex items-center gap-2 py-3 px-4 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium">
                  <Bookmark size={16} /> My Bookings
                </Link>
                <button
                  onClick={() => logout.mutate({})}
                  className="w-full flex items-center gap-2 py-3 px-4 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-medium"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <div className="pt-4 flex flex-col gap-3">
                <button onClick={() => { openAuthModal("login"); setMenuOpen(false); }} className="btn-ghost w-full text-center">
                  Sign In
                </button>
                <button onClick={() => { openAuthModal("register"); setMenuOpen(false); }} className="btn-primary w-full text-center">
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for user menu */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
}
