"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MailOpen, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/lib/SettingsContext";

interface HeroProps {
  onOpen: () => void;
}

interface Particle {
  id: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
}

export default function Hero({ onOpen }: HeroProps) {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to")?.trim();
  const [particles, setParticles] = useState<Particle[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    // Generate floating particles
    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden font-serif">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${settings?.hero_image_url?.trim() || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#2f2118]/75 via-[#3b2a1f]/70 to-[#2a1d14]/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0 jawa-pattern opacity-20 mix-blend-soft-light" />
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -left-24 w-64 h-64 border border-jawa-gold/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-32 -right-32 w-96 h-96 border border-jawa-gold/20 rounded-full"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="flex justify-center"
          >
            <Heart className="w-8 h-8 text-merah-400 fill-merah-400/20" />
          </motion.div>

          <p className="uppercase tracking-[0.4em] text-white/80 text-xs md:text-sm font-medium">
            The Wedding Of
          </p>
          {settings?.hero_date_text ? (
            <p className="text-sm md:text-base text-white/80 mt-2">
              {settings.hero_date_text}
            </p>
          ) : null}

          <div className="space-y-3">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl md:text-6xl font-serif font-extrabold text-white drop-shadow-2xl leading-tight md:whitespace-nowrap">
                Habibie Satrio Nugroho
              </h1>
              <p className="text-base md:text-xl text-white/85 tracking-[0.12em] uppercase mt-1">
                S.Kom., M.Han
              </p>
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white/95 drop-shadow-xl">
              &
            </h2>

            <div className="flex flex-col items-center">
              <h1 className="text-3xl md:text-6xl font-serif font-extrabold text-white drop-shadow-2xl leading-tight">
                Lathifa Ailia Putri
              </h1>
              <p className="text-base md:text-xl text-white/85 tracking-[0.12em] uppercase mt-1">
                S.H.
              </p>
            </div>
          </div>

          {settings?.hero_quote_bottom ? (
            <p className="text-sm md:text-base text-white/80 italic mt-3">
              {settings.hero_quote_bottom}
            </p>
          ) : null}

        </motion.div>

        {guestName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mx-auto w-full max-w-md py-5 md:py-6 border-y border-white/20 text-white"
          >
            <p className="text-sm md:text-base text-white/80 tracking-wide">Kepada Yth.</p>
            <p className="mt-1 text-base md:text-lg text-white/90">Bapak/Ibu/Saudara/i</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-tight">
              {guestName}
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/80 italic">Di Tempat</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="group relative inline-flex items-center px-8 py-4 bg-jawa-cream text-jawa-dark rounded-full font-bold shadow-2xl border border-jawa-gold/40 transition-all hover:bg-[#efe1c6] hover:text-jawa-maroon"
          >
            <MailOpen className="mr-3 w-5 h-5 group-hover:animate-bounce" />
            Buka Undangan
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Petals/Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              top: p.top,
              left: p.left,
              opacity: 0
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              opacity: [0, 0.2, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay
            }}
            className="absolute w-4 h-4 bg-white/10 rounded-full blur-sm"
          />
        ))}
      </div>
    </section>
  );
}
