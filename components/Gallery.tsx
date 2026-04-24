"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { useSettings } from "@/lib/SettingsContext";

export default function Gallery() {
  const { settings } = useSettings();

  const defaultPhotos = [
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
      className: "col-span-2 row-span-2",
      alt: "Wedding photo 1",
    },
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
      className: "col-span-1 row-span-1",
      alt: "Wedding photo 2",
    },
    {
      url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop",
      className: "col-span-1 row-span-1",
      alt: "Wedding photo 3",
    },
    {
      url: "https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=2070&auto=format&fit=crop",
      className: "col-span-1 row-span-2",
      alt: "Wedding photo 4",
    },
    {
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=2070&auto=format&fit=crop",
      className: "col-span-1 row-span-1",
      alt: "Wedding photo 5",
    },
  ];

  const photos = settings?.gallery && settings.gallery.length > 0 
    ? settings.gallery.map((item, index) => ({
        ...item,
        className: index === 0 ? "col-span-2 row-span-2" : index === 3 ? "col-span-1 row-span-2" : "col-span-1 row-span-1"
      }))
    : defaultPhotos;

  return (
    <section className="py-24 px-6 font-serif">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto"
          >
            <ImageIcon className="w-6 h-6 text-sage-600" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-sage-900 tracking-tight">Galeri Foto</h2>
          <p className="text-sage-600 italic text-lg">Momen-momen indah yang kami abadikan...</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`relative group overflow-hidden rounded-3xl shadow-lg border border-white/30 ${photo.className}`}
            >
              <div className="absolute inset-0 bg-sage-950/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-end p-6">
                <span className="text-white font-medium text-sm tracking-[0.2em] uppercase">
                  Habibie & Lala
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
