"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useSettings } from "@/lib/SettingsContext";

export default function GiftSection() {
  const { settings } = useSettings();
  const title = settings?.gift_title || "Untuk yang ingin memberikan hadiah";
  const description = settings?.gift_description || "Bagi tamu yang ingin memberi kado, silakan gunakan transfer bank di bawah ini. Terima kasih atas doa dan kebaikan Anda.";
  const mandiriAccount = settings?.gift_mandiri_account || "";
  const bcaAccount = settings?.gift_bca_account || "";
  const showMandiri = settings?.gift_show_mandiri ?? true;
  const showBca = settings?.gift_show_bca ?? true;

  const hasLogos = (showMandiri && mandiriAccount) || (showBca && bcaAccount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="glassmorphism jawa-frame rounded-[2rem] border border-jawa-gold/30 bg-white/80 p-10 shadow-2xl"
    >
      <div className="text-center space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-jawa-maroon font-semibold">Hadiah & Dukungan</p>
        <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-jawa-dark">{title}</h2>
        <p className="mx-auto max-w-2xl text-jawa-brown text-base md:text-lg leading-relaxed">{description}</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {showMandiri && mandiriAccount ? (
          <div className="rounded-3xl border border-[#ffd63d]/40 bg-[#fff7d6]/80 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0b0]/90 text-[#1a3a82] font-black text-xl">M</div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-jawa-brown font-bold">Bank</p>
                <p className="text-xl font-bold text-jawa-dark">Mandiri</p>
              </div>
            </div>
            <p className="text-sm text-jawa-brown/80">No. Rekening</p>
            <p className="mt-2 font-semibold text-xl text-jawa-maroon">{mandiriAccount}</p>
            <p className="mt-3 text-xs text-jawa-brown/70 italic">Silakan transfer sesuai nominal yang Anda kehendaki.</p>
          </div>
        ) : null}

        {showBca && bcaAccount ? (
          <div className="rounded-3xl border border-[#003c91]/20 bg-[#e8f0ff]/80 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#002f71] text-white font-black text-xl">B</div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-jawa-brown font-bold">Bank</p>
                <p className="text-xl font-bold text-jawa-dark">BCA</p>
              </div>
            </div>
            <p className="text-sm text-jawa-brown/80">No. Rekening</p>
            <p className="mt-2 font-semibold text-xl text-jawa-maroon">{bcaAccount}</p>
            <p className="mt-3 text-xs text-jawa-brown/70 italic">Terima kasih atas perhatian dan doa restu Anda.</p>
          </div>
        ) : null}

        {!hasLogos && (
          <div className="md:col-span-2 rounded-3xl border border-sage-200 bg-sage-50 p-6 text-center">
            <p className="text-sage-700 text-sm">Gift section sedang dalam pengaturan. Silakan isi data bank dan pilih logo Mandiri/BCA di panel admin.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
