"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MailOpen, Calendar, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const guestName = searchParams.get("to");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [weddingDate, setWeddingDate] = useState<string>("");

  useEffect(() => {
    // Generate particles only on client to avoid hydration mismatch
    const newParticles = [...Array(6)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);

    const fetchWeddingDate = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "wedding_date")
        .single();

      if (error) {
        console.error("Error fetching wedding date:", error);
        return;
      }

      setWeddingDate(data.value);
    };

    fetchWeddingDate();
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden font-serif">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-sage-950/50 backdrop-blur-[2px]" />
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -left-24 w-64 h-64 border border-white/10 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-32 -right-32 w-96 h-96 border border-white/10 rounded-full"
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

          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-white drop-shadow-2xl">
            Habibie Satrio Nugroho, S.Kom., M.Han
          </h1>
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-white drop-shadow-2xl">
            &
          </h1>
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-white drop-shadow-2xl">
            Lathifa Ailia Putri, S.H.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex items-center justify-center space-x-3 text-white/90"
        >
          <Calendar className="w-5 h-5 text-merah-400" />
          <p className="text-xl md:text-2xl font-light italic tracking-wide">
            {weddingDate || "Tanggal Belum Ditentukan"}
          </p>
        </motion.div>

        {guestName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="py-6 border-y border-white/20"
          >
            <p className="text-white/70 text-sm mb-1 uppercase tracking-widest">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {guestName}
            </h2>
            <p className="text-white/70 text-sm mt-2 italic">Kamu Diundang ke Pernikahan Kami</p>
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
            className="group relative inline-flex items-center px-8 py-4 bg-white text-sage-900 rounded-full font-bold shadow-2xl transition-all hover:bg-merah-50 hover:text-merah-900"
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
