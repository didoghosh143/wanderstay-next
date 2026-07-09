"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Instagram, Twitter, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1c1917] text-white/60 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                <Compass size={18} className="text-white" />
              </div>
              <span className="font-['DM_Serif_Display'] text-xl text-white">Wanderstay</span>
            </Link>
            <p className="text-white/50 leading-relaxed mb-6 max-w-sm text-sm">
              Your premium gateway to India's most breathtaking destinations — from the mangroves of Sundarbans to the palaces of Rajasthan.
            </p>
            <div className="flex items-center gap-2 text-sm mb-2">
              <MapPin size={14} className="text-orange-400 flex-shrink-0" />
              <span>Bankura, West Bengal, India</span>
            </div>
            <div className="flex items-center gap-2 text-sm mb-6">
              <Mail size={14} className="text-orange-400 flex-shrink-0" />
              <span>hello@wanderstay.in</span>
            </div>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-orange-500/20 border border-white/10 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Explore",
              links: [
                { label: "All Destinations", href: "/destinations" },
                { label: "West Bengal", href: "/destinations?state=West+Bengal" },
                { label: "Rajasthan", href: "/destinations?state=Rajasthan" },
                { label: "Kerala & Goa", href: "/destinations?state=Kerala" },
              ],
            },
            {
              title: "Hotels",
              links: [
                { label: "Browse Hotels", href: "/hotels" },
                { label: "Luxury Stays", href: "/hotels?minRating=5" },
                { label: "Budget Friendly", href: "/hotels?maxPrice=5000" },
                { label: "My Bookings", href: "/bookings" },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "Help Center", href: "#" },
                { label: "Cancellation Policy", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm hover:text-white transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Wanderstay. Made with ❤️ in West Bengal, India.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
