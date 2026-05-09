"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/lib/SettingsContext";

export default function CoupleIntro() {
  const { settings } = useSettings();
  const [groomImageSrc, setGroomImageSrc] = useState(settings?.groom_photo_url || "/images/groom.jpg");
  const [brideImageSrc, setBrideImageSrc] = useState(settings?.bride_photo_url || "/images/bride.jpg");

  useEffect(() => {
    setGroomImageSrc(settings?.groom_photo_url || "/images/groom.jpg");
    setBrideImageSrc(settings?.bride_photo_url || "/images/bride.jpg");
  }, [settings?.groom_photo_url, settings?.bride_photo_url]);

  return (
    <section className="py-24 px-6 bg-jawa-ivory jawa-pattern">
      <div className="max-w-6xl mx-auto space-y-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-4"
        >
          <p className="text-jawa-maroon text-sm md:text-base tracking-[0.18em] uppercase font-semibold">
            Bismillahirrahmanirrahim
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-jawa-dark font-serif">
            ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
          </h2>
          <p className="max-w-3xl mx-auto text-jawa-brown/90 italic leading-relaxed">
            Atas Berkah dan Rahmat Allah Subhanallahu Wa Ta'ala. Tanpa mengurangi rasa hormat. 
            Kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami :
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <motion.article
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-jawa-gold/35 bg-jawa-cream/90 shadow-lg p-8 md:p-10 text-center space-y-4 jawa-frame"
          >
            <div className="mx-auto w-32 h-32 rounded-full p-1.5 bg-gradient-to-b from-jawa-gold/70 via-[#ead6b0] to-jawa-maroon/70 shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-jawa-cream bg-[#efe1c6] flex items-center justify-center">
                {groomImageSrc ? (
                  <img
                    src={groomImageSrc}
                    alt="Foto Mempelai Pria"
                    className="w-full h-full object-cover"
                    onError={() => {
                      if (groomImageSrc !== "/images/groom.jpg") {
                        setGroomImageSrc("/images/groom.jpg");
                      } else {
                        setGroomImageSrc("");
                      }
                    }}
                  />
                ) : (
                  <Heart className="w-10 h-10 text-jawa-maroon" />
                )}
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-jawa-brown font-semibold">Mempelai Pria</p>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-jawa-dark leading-tight">
              Habibie Satrio Nugroho
            </h3>
            <p className="text-jawa-maroon font-medium tracking-[0.12em] uppercase text-sm md:text-base">
              S.Kom., M.Han
            </p>
            <p className="text-jawa-brown/95 leading-relaxed">
              Putra Pertama dari Bapak <span className="font-semibold">H. Mulyadi, S.E.</span> &amp; Ibu{" "}
              <span className="font-semibold">Diah Widiaty Mujianto, S.E.</span>
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-jawa-gold/35 bg-jawa-cream/90 shadow-lg p-8 md:p-10 text-center space-y-4 jawa-frame"
          >
            <div className="mx-auto w-32 h-32 rounded-full p-1.5 bg-gradient-to-b from-jawa-gold/70 via-[#ead6b0] to-jawa-maroon/70 shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-jawa-cream bg-[#efe1c6] flex items-center justify-center">
                {brideImageSrc ? (
                  <img
                    src={brideImageSrc}
                    alt="Foto Mempelai Wanita"
                    className="w-full h-full object-cover"
                    onError={() => {
                      if (brideImageSrc !== "/images/bride.jpg") {
                        setBrideImageSrc("/images/bride.jpg");
                      } else {
                        setBrideImageSrc("");
                      }
                    }}
                  />
                ) : (
                  <Heart className="w-10 h-10 text-jawa-maroon" />
                )}
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-jawa-brown font-semibold">Mempelai Wanita</p>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-jawa-dark leading-tight">
              Lathifa Ailia Putri
            </h3>
            <p className="text-jawa-maroon font-medium tracking-[0.12em] uppercase text-sm md:text-base">
              S.H.
            </p>
            <p className="text-jawa-brown/95 leading-relaxed">
              Putri Satu-satunya dari Bapak <span className="font-semibold">H. Mochamad Ainuljakin, S.H.</span> &amp; Ibu{" "}
              <span className="font-semibold">Dra. Hj. Sri Harlina</span>
            </p>
          </motion.article>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="text-center text-jawa-brown/90 italic max-w-3xl mx-auto"
        >
          “Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri,
          agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”
          <span className="block mt-2 font-semibold not-italic text-jawa-dark">QS. Ar-Rum: 21</span>
        </motion.p>
      </div>
    </section>
  );
}
