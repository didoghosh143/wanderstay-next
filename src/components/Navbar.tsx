"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname as useLocation } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Bookmark, ChevronDown, Compass, Bell } from "lucide-react";
import Image from "next/image";
import { useNotification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout, getGetMeQueryKey } from "@/lib/mockApi";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { notifications, removeNotification, isTrayOpen, setTrayOpen, unreadCount } = useNotification();
  const location = useLocation();
  const isHome = location === "/";
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const logout = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.setQueryData(getGetMeQueryKey(), null);
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({ title: "Signed out", description: "See you next time!" });
        setUserMenuOpen(false);
      },
    },
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location]);

  const transparent = isHome && !scrolled;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Destinations", path: "/destinations" },
    { name: "Hotels", path: "/hotels" },
  ];

  return (
    <>
      <div className="fixed top-4 left-4 right-4 md:top-6 md:left-1/2 md:-translate-x-1/2 md:w-[90%] max-w-5xl z-50">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{
            backgroundColor: transparent ? "rgba(255, 255, 255, 0.03)" : "rgba(41, 37, 36, 0.85)", // stone-800
            backdropFilter: "blur(20px)",
            borderColor: transparent ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)",
            boxShadow: transparent ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "0 10px 40px rgba(0,0,0,0.4)",
          }}
          className="rounded-full border px-4 md:px-6 h-16 flex items-center justify-between"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div 
              whileHover={{ rotate: 180 }} 
              transition={{ duration: 0.5 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/40"
            >
              <Compass size={18} className="text-white" />
            </motion.div>
            <span className="font-['DM_Serif_Display'] text-xl font-normal text-white tracking-wide">
              Wanderstay
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            {navLinks.map((link) => {
              const isActive = location === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? "text-white" : "text-white/70 hover:text-white"}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setTrayOpen(!isTrayOpen)}
                className="relative p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#292524]"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </button>
              
              {/* Notification Tray */}
              <AnimatePresence>
                {isTrayOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute right-0 mt-4 w-80 max-h-[400px] overflow-y-auto bg-[#292524] border border-white/10 rounded-3xl shadow-2xl p-2 z-50 custom-scrollbar"
                  >
                    <div className="px-4 py-3 mb-2 flex justify-between items-center">
                      <h3 className="text-white font-semibold">Notifications</h3>
                      {notifications.length > 0 && (
                        <span className="text-xs text-white/50">{notifications.length}</span>
                      )}
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-white/50 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors relative group flex gap-3 items-start">
                            {notif.image && (
                              <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 mt-0.5">
                                <Image src={notif.image} alt="" fill className="object-cover" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="text-white text-sm font-medium leading-tight mb-1">{notif.title}</h4>
                              <p className="text-white/60 text-xs leading-snug line-clamp-2">{notif.message}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notif.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.name[0].toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`text-white/70 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute right-0 mt-4 w-56 bg-[#292524] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-2 z-50"
                    >
                      <div className="px-4 py-3 mb-2 bg-white/5 rounded-2xl">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-white/50 text-xs truncate">{user.email}</p>
                      </div>
                      <Link href="/bookings" className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-sm font-medium">
                        <Bookmark size={15} /> My Bookings
                      </Link>
                      <button
                        onClick={() => logout.mutate({})}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-sm font-medium mt-1"
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openAuthModal("register")}
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 text-sm px-6 py-2 rounded-full font-semibold transition-colors"
                >
                  Get Started
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile menu toggle & Notification */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Notification Bell */}
            <button
              onClick={() => setTrayOpen(!isTrayOpen)}
              className="relative text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-orange-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white border-2 border-transparent"
                >
                  {unreadCount}
                </motion.div>
              )}
            </button>
            <button
              className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setTrayOpen(false);
              }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <motion.div animate={{ rotate: menuOpen ? 90 : 0 }}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.div>
            </button>
          </div>
        </motion.nav>

        {/* Mobile Notification Tray */}
        <AnimatePresence>
          {isTrayOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-20 left-0 right-0 bg-[#1c1917]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 shadow-2xl md:hidden overflow-hidden max-h-[60vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-white font-semibold text-lg">Notifications</h3>
              </div>
              
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-white/50 text-sm">
                  No notifications yet
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 bg-white/5 rounded-2xl relative flex gap-3 items-start">
                      {notif.image && (
                        <div className="w-12 h-12 relative rounded-xl overflow-hidden shrink-0 mt-0.5 shadow-lg">
                          <Image src={notif.image} alt="" fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-medium leading-tight mb-1.5">{notif.title}</h4>
                        <p className="text-white/60 text-sm leading-snug">{notif.message}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notif.id);
                        }}
                        className="absolute top-2 right-2 text-white/30 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-20 left-0 right-0 bg-[#1c1917]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 shadow-2xl md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="block py-3 px-5 text-white/80 hover:text-white hover:bg-white/5 rounded-2xl transition-colors font-medium text-lg"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <div className="h-px bg-white/10 my-4 mx-2" />
              
              {isAuthenticated && user ? (
                <div className="space-y-1">
                  <div className="px-5 py-3 mb-2 bg-white/5 rounded-2xl">
                    <p className="text-white font-semibold truncate">{user.name}</p>
                    <p className="text-white/50 text-sm truncate">{user.email}</p>
                  </div>
                  <Link href="/bookings" className="flex items-center gap-3 py-3 px-5 text-white/80 hover:text-white hover:bg-white/5 rounded-2xl transition-colors font-medium">
                    <Bookmark size={18} /> My Bookings
                  </Link>
                  <button
                    onClick={() => logout.mutate({})}
                    className="w-full flex items-center gap-3 py-3 px-5 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-colors font-medium"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-2">
                  <button onClick={() => { openAuthModal("login"); setMenuOpen(false); }} className="py-3 px-4 rounded-2xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
                    Sign In
                  </button>
                  <button onClick={() => { openAuthModal("register"); setMenuOpen(false); }} className="py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/25">
                    Get Started
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop for user/notification menus */}
      {(userMenuOpen || isTrayOpen) && <div className="fixed inset-0 z-40" onClick={() => { setUserMenuOpen(false); setTrayOpen(false); }} />}
    </>
  );
}
