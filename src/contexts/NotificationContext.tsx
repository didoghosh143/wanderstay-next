"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

export type Notification = {
  id: string;
  title: string;
  message: string;
  image?: string;
  actionText?: string;
  onAction?: () => void;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  isTrayOpen: boolean;
  setTrayOpen: (open: boolean) => void;
  unreadCount: number;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isTrayOpen, setTrayOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<Notification | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Simulate receiving a notification after 5 seconds of app load
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        title: "20% Off Luxury Stays!",
        message: "Book any premium hotel today and get an exclusive discount. Don't miss out!",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80", // ITC Royal Bengal image
        actionText: "Claim Offer",
        onAction: () => {
          // You can route to /hotels here or show a modal
        }
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isTrayOpen) {
      // Mark all as read when tray opens
      setReadIds(new Set(notifications.map(n => n.id)));
    }
  }, [isTrayOpen, notifications]);

  const addNotification = (notif: Omit<Notification, "id">) => {
    const newNotif = { ...notif, id: Math.random().toString(36).substring(7) };
    setNotifications((prev) => [newNotif, ...prev]);
    setActivePopup(newNotif);
    
    // Auto-hide popup after 8 seconds
    setTimeout(() => {
      setActivePopup((current) => current?.id === newNotif.id ? null : current);
    }, 8000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (activePopup?.id === id) {
      setActivePopup(null);
    }
  };

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, isTrayOpen, setTrayOpen, unreadCount }}>
      {children}
      
      {/* Active Popup */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0.3,
              // Animate towards top right (navbar area)
              x: typeof window !== "undefined" && window.innerWidth < 768 ? 150 : 350, 
              y: typeof window !== "undefined" && window.innerWidth < 768 ? -500 : -600 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[100] md:w-80 bg-[#1c1917]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex"
          >
            {activePopup.image && (
              <div className="w-1/3 relative hidden sm:block">
                <Image src={activePopup.image} alt={activePopup.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-4 flex-1 relative">
              <button 
                onClick={() => setActivePopup(null)}
                className="absolute top-2 right-2 text-white/50 hover:text-white bg-black/20 rounded-full p-1 transition-colors z-10"
              >
                <X size={14} />
              </button>
              <div className="flex items-start gap-3 mb-2 sm:hidden">
                {activePopup.image && (
                  <div className="w-12 h-12 relative rounded-xl overflow-hidden shrink-0 shadow-lg">
                    <Image src={activePopup.image} alt={activePopup.title} fill className="object-cover" />
                  </div>
                )}
                <div>
                   <span className="inline-block bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">OFFER</span>
                   <h4 className="font-semibold text-white text-sm leading-tight">{activePopup.title}</h4>
                </div>
              </div>
              <div className="hidden sm:block mb-2">
                 <span className="inline-block bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">OFFER</span>
                 <h4 className="font-semibold text-white text-sm leading-tight">{activePopup.title}</h4>
              </div>
              <p className="text-white/70 text-xs mb-3 leading-relaxed">{activePopup.message}</p>
              {activePopup.actionText && (
                <button 
                  onClick={() => {
                    activePopup.onAction?.();
                    setActivePopup(null);
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
                >
                  {activePopup.actionText}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
