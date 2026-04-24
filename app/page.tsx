"use client";

import { useState, Suspense, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Guestbook from "@/components/Guestbook";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import LoveStory from "@/components/LoveStory";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen selection:bg-merah-200 selection:text-merah-900 bg-sage-50 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <Suspense fallback={
              <div className="h-screen w-full flex items-center justify-center bg-sage-950 text-white font-serif">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-merah-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm tracking-[0.2em] opacity-50">MEMUAT UNDANGAN...</p>
                </div>
              </div>
            }>
              <Hero onOpen={() => setIsOpen(true)} />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-0"
          >
            {/* Minimalist Hero Background for the Opened State */}
            <section 
              className="h-[50vh] relative flex flex-col items-center justify-center text-center space-y-4 bg-cover bg-center bg-fixed"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop')" }}
            >
              <div className="absolute inset-0 bg-sage-950/60 backdrop-blur-[2px]" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative z-10 text-white px-4"
              >
                <p className="uppercase tracking-[0.4em] text-xs font-medium opacity-80 mb-2">The Wedding Of</p>
                <h1 className="text-5xl md:text-7xl font-bold font-serif">Habibie & Lala</h1>
              </motion.div>
            </section>

            {/* Countdown Section */}
            <section className="relative z-20 -mt-16 mb-24">
              <Countdown />
            </section>

            {/* Love Story Section */}
            <section id="story">
              <LoveStory />
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="bg-sage-50">
              <Gallery />
            </section>

            {/* Location Section */}
            <section id="location">
              <Location />
            </section>

            {/* Guestbook Section */}
            <section id="guestbook" className="py-24 bg-sage-100">
              <div className="max-w-4xl mx-auto px-4">
                <Guestbook />
              </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-white text-center border-t border-sage-100">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-center items-center space-x-4 text-merah-600">
                  <span className="w-12 h-[1px] bg-merah-200" />
                  <p className="font-serif italic text-2xl text-sage-800">Habibie & Lala</p>
                  <span className="w-12 h-[1px] bg-merah-200" />
                </div>
                <p className="text-sage-600 font-medium max-w-sm mx-auto leading-relaxed">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
                </p>
                <div className="pt-8">
                  <p className="text-sage-400 text-[10px] uppercase tracking-[0.4em]">© 2026 Wedding Invitation</p>
                  <p className="text-sage-300 text-[9px] mt-2 italic font-light">Created with love</p>
                </div>
              </motion.div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
