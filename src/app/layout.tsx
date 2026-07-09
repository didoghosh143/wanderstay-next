import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { Toaster } from "@/components/ui/toaster";
import { SmoothScrolling } from "@/components/SmoothScrolling";

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Wanderstay — Discover India",
  description: "Discover breathtaking destinations across India, curated luxury hotels, and book your next unforgettable adventure with Wanderstay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSerifDisplay.variable} ${plusJakartaSans.variable} font-sans antialiased bg-black text-white`}
      >
        <SmoothScrolling>
          <Providers>
            <Navbar />
            {children}
            <Footer />
            <AuthModal />
            <Toaster />
          </Providers>
        </SmoothScrolling>
      </body>
    </html>
  );
}
