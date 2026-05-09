"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, MapPin, Stars } from "lucide-react";
import { useSettings } from "@/lib/SettingsContext";

export default function LoveStory() {
  const { settings } = useSettings();

  const defaultStories = [
    {
      year: "Januari 2021",
      title: "Awal Pertemuan",
      description: "Kami pertama kali bertemu di sebuah acara seminar kampus. Berawal dari diskusi kecil hingga berlanjut ke percakapan yang tak ada habisnya.",
    },
    {
      year: "Mei 2022",
      title: "Kencan Pertama",
      description: "Kencan pertama kami di sebuah kedai kopi kecil di pusat kota. Di sana kami menyadari bahwa kami memiliki banyak kesamaan.",
    },
    {
      year: "Oktober 2024",
      title: "Lamaran",
      description: "Di bawah cahaya bintang, Habibie melamar Lala untuk mengikat janji suci menuju pernikahan.",
    },
    {
      year: "April 2026",
      title: "Pernikahan",
      description: "Hari yang paling dinantikan, kami akan memulai lembaran baru sebagai suami istri.",
    },
  ];

  const stories = settings?.love_story && settings.love_story.length > 0
    ? settings.love_story
    : defaultStories;

  const getIcon = (index: number) => {
    const icons = [
      <MessageCircle className="w-5 h-5" />,
      <MapPin className="w-5 h-5" />,
      <Stars className="w-5 h-5" />,
      <Heart className="w-5 h-5" />
    ];
    return icons[index % icons.length];
  };

  return (
    <section className="py-24 px-6 font-serif bg-jawa-ivory jawa-pattern">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="w-12 h-12 bg-[#efe1c6] border border-jawa-gold/40 rounded-full flex items-center justify-center mx-auto"
          >
            <Heart className="w-6 h-6 text-jawa-maroon fill-jawa-maroon/20" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-jawa-dark tracking-tight">Perjalanan Cinta Kami</h2>
          <p className="text-jawa-brown italic text-lg">Bagaimana kisah indah ini bermula...</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-jawa-gold/60 via-jawa-brown/40 to-jawa-maroon/60" />

          <div className="space-y-12">
            {stories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative flex items-center justify-between w-full ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-10 h-10 bg-jawa-cream border-2 border-jawa-gold/60 rounded-full flex items-center justify-center z-10 shadow-lg jawa-frame">
                  <div className="text-jawa-maroon">{getIcon(index)}</div>
                </div>

                {/* Content Card */}
                <div className="ml-12 md:ml-0 md:w-5/12 glassmorphism jawa-frame bg-jawa-cream/85 p-6 md:p-8 border border-jawa-gold/35 shadow-xl hover:shadow-2xl transition-all group">
                  <span className="text-jawa-maroon font-bold text-sm tracking-[0.2em] uppercase block mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    {story.year}
                  </span>
                  <h3 className="text-2xl font-bold text-jawa-dark mb-3">{story.title}</h3>
                  <p className="text-jawa-brown leading-relaxed italic opacity-90 group-hover:opacity-100 transition-opacity">
                    "{story.description}"
                  </p>
                </div>

                {/* Empty space for alignment */}
                <div className="hidden md:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
