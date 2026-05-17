"use client";

import { useState, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Guestbook from "@/components/Guestbook";
import GiftSection from "@/components/GiftSection";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import CoupleIntro from "@/components/CoupleIntro";
import MusicPlayer from "@/components/MusicPlayer";
import { useSettings } from "@/lib/SettingsContext";

function toDirectImageUrl(url: string): string {
  if (!url) return "";

  // Google Drive patterns
  const fileIdFromFilePath = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
  if (fileIdFromFilePath) {
    return `https://drive.google.com/uc?export=view&id=${fileIdFromFilePath}`;
  }

  const fileIdFromOpenParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1];
  if (fileIdFromOpenParam) {
    return `https://drive.google.com/uc?export=view&id=${fileIdFromOpenParam}`;
  }

  return url;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();
  const rawHeroImageUrl = settings?.hero_image_url || "";
  const convertedHeroImageUrl = toDirectImageUrl(rawHeroImageUrl);
  const heroImageUrl = convertedHeroImageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";
  const heroQuoteBottom = settings?.hero_quote_bottom || "";
  const weddingDate = settings?.wedding_date ? new Date(settings.wedding_date) : new Date("2026-06-07");
  const weddingDateLabel = weddingDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <main className="min-h-screen selection:bg-[#e8d4b2] selection:text-jawa-dark bg-jawa-ivory jawa-pattern overflow-x-hidden">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="space-y-0"
          >
            <MusicPlayer src={settings?.music_url || ""} title={settings?.music_title || ""} />

            {/* Header */}
            <section
              className="relative min-h-[72vh] pt-16 pb-8 flex flex-col items-center justify-center text-center space-y-8 bg-cover bg-center bg-fixed"
              style={{ backgroundImage: `url('${heroImageUrl}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#2f2118]/75 via-[#3b2a1f]/65 to-[#2a1d14]/75 backdrop-blur-[2px]" />
              <div className="absolute inset-0 jawa-pattern opacity-20 mix-blend-soft-light" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative z-10 text-white px-4 max-w-3xl w-full space-y-6"
              >
                <p className="uppercase tracking-[0.4em] text-xs font-medium text-jawa-cream/90">The Wedding Of</p>
                <h1 className="text-5xl md:text-7xl font-bold font-serif text-jawa-cream drop-shadow-2xl">Habibie & Lathifa</h1>

                {convertedHeroImageUrl && (
                  <div className="flex justify-center">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                      <img
                        src={convertedHeroImageUrl}
                        alt="Foto pasangan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {heroQuoteBottom && (
                  <div className="mx-auto max-w-2xl bg-[#f8f3e8]/15 border border-jawa-gold/40 rounded-2xl px-5 py-4 backdrop-blur-sm jawa-frame">
                    <p className="text-sm md:text-base text-jawa-cream/95 italic leading-relaxed">
                      {heroQuoteBottom}
                    </p>
                  </div>
                )}
              </motion.div>
            </section>

            {/* Couple Intro Section */}
            <section id="couple-intro" className="relative -mt-16">
              <CoupleIntro />
            </section>

            {/* Countdown Section (moved down above Location) */}
            <section className="relative z-20 mb-12 px-4">
              <div className="max-w-5xl mx-auto rounded-[2rem] border border-jawa-gold/35 bg-[#f8f3e8]/90 shadow-xl backdrop-blur-sm jawa-frame overflow-hidden">
                <div className="px-6 md:px-10 pt-8 md:pt-10 pb-3 text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-10 md:w-16 h-[1px] bg-jawa-gold/60" />
                    <span className="text-jawa-maroon/85 text-[10px] md:text-xs uppercase tracking-[0.38em] font-semibold">
                      Save The Date
                    </span>
                    <span className="w-10 md:w-16 h-[1px] bg-jawa-gold/60" />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-jawa-dark italic tracking-wide">
                    Hitung Mundur Menuju Hari Bahagia
                  </h3>
                </div>

                <div className="px-2 md:px-4 pb-4 md:pb-6">
                  <Countdown />
                </div>

                <div className="px-6 md:px-10 pb-6 md:pb-8">
                  <p className="mx-auto max-w-2xl text-center text-sm md:text-base uppercase tracking-[0.24em] text-jawa-brown/75 font-semibold">
                    {weddingDateLabel}
                  </p>
                </div>

                <div className="relative px-6 md:px-10 pb-6 md:pb-8">
                  <div className="mx-auto flex items-center justify-center gap-3">
                    <div className="h-px w-24 bg-jawa-gold/40" />
                    <span className="text-jawa-maroon/70 text-xs uppercase tracking-[0.35em]">❦</span>
                    <div className="h-px w-24 bg-jawa-gold/40" />
                  </div>
                </div>
              </div>
            </section>

            {/* Location Section */}
            <section id="location">
              <Location />
            </section>

            {/* Gift Section */}
            <section id="gift" className="py-24 bg-[#f7efe1]">
              <div className="max-w-4xl mx-auto px-4">
                <GiftSection />
              </div>
            </section>

            {/* Guestbook Section */}
            <section id="guestbook" className="py-24 bg-[#efe4d0]">
              <div className="max-w-4xl mx-auto px-4">
                <Guestbook />
              </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="bg-jawa-ivory">
              <Gallery />
            </section>

            {/* Footer */}
            <footer className="py-16 md:py-20 bg-jawa-cream text-center jawa-pattern">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-center items-center space-x-4 text-jawa-maroon">
                  <span className="w-12 h-[1px] bg-jawa-gold/50" />
                  <p className="font-serif italic text-2xl text-jawa-dark">Habibie & Lathifa</p>
                  <span className="w-12 h-[1px] bg-jawa-gold/50" />
                </div>
                <p className="text-jawa-brown font-medium max-w-sm mx-auto leading-relaxed">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
                </p>
                <div className="pt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-jawa-maroon font-semibold tracking-[0.28em] uppercase text-sm hover:text-jawa-dark transition"
                  >
                    #BiLaSah
                  </button>
                  <div>
                    <p className="text-jawa-brown/70 text-[10px] uppercase tracking-[0.4em]">© 2026 Wedding Invitation</p>
                    <p className="text-jawa-brown/60 text-[9px] mt-2 italic font-light">Created with love</p>
                  </div>
                </div>
              </motion.div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
