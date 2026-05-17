"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/lib/SettingsContext";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const { settings } = useSettings();
  const targetDate = new Date(settings?.wedding_date || "2026-04-23T09:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  const items = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto px-4 py-8">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="glassmorphism jawa-frame bg-[#f8f3e8]/80 backdrop-blur-md p-4 md:p-6 text-center border border-jawa-gold/35"
        >
          <span className="block text-2xl md:text-4xl font-bold text-jawa-maroon font-serif">
            {item.value.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-jawa-brown font-medium">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
