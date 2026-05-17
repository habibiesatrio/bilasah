"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Clipboard } from "lucide-react";
import { useSettings } from "@/lib/SettingsContext";

export default function GiftSection() {
  const { settings } = useSettings();
  const [copiedAccount, setCopiedAccount] = useState<"mandiri" | "bca" | "" >("");

  const copyToClipboard = async (value: string, label: "mandiri" | "bca") => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedAccount(label);
      window.setTimeout(() => setCopiedAccount(""), 2000);
    } catch (error) {
      console.error("Unable to copy", error);
    }
  };
  const title = settings?.gift_title || "Kehadiran dan doa restu Anda merupakan hadiah terindah bagi kami";
  const description = settings?.gift_description || "Namun apabila berkenan memberikan tanda kasih, dapat melalui rekening berikut:";
  const mandiriAccount = settings?.gift_mandiri_account || "";
  const mandiriHolder = settings?.gift_mandiri_holder || "";
  const bcaAccount = settings?.gift_bca_account || "";
  const bcaHolder = settings?.gift_bca_holder || "";
  const showMandiri = settings?.gift_show_mandiri ?? true;
  const showBca = settings?.gift_show_bca ?? true;

  const hasLogos = (showMandiri && mandiriAccount) || (showBca && bcaAccount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="glassmorphism jawa-frame rounded-[2rem] border border-[#C89B7B]/25 bg-[#F5F1E8]/90 p-10 shadow-lg"
    >
      <div className="text-center space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-[#7BA876] font-semibold">Wedding Gift</p>
        {/* <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-jawa-dark">Terima kasih atas segala doa, kasih, dan perhatiannya.</h2> */}
        <p className="mx-auto max-w-2xl text-jawa-brown text-base md:text-lg leading-relaxed">Kehadiran dan doa restu Anda merupakan hadiah terindah bagi kami, Namun jika anda bermaksud mengirimkan hadiah pernikahan lain, bisa melalui rekening berikut:</p>
      </div>  

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {showMandiri && mandiriAccount ? (
          <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#E5D4B8]/40 p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/30 overflow-hidden">
                <img src="/mandiri.svg" alt="Logo Bank Mandiri" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#5D4E37] font-bold">Bank</p>
                <p className="text-xl font-bold text-[#3b2a1f]">Mandiri</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#5D4E37]/70">No. Rekening</p>
                  <p className="mt-2 font-semibold text-xl text-[#7BA876]">{mandiriAccount}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(mandiriAccount, "mandiri")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#7BA876]/30 bg-white/90 px-4 py-2 text-sm font-semibold text-[#3b2a1f] transition hover:bg-[#fffdf6]"
                >
                  <Clipboard className="w-4 h-4" />
                  {copiedAccount === "mandiri" ? "Tersalin" : "Salin"}
                </button>
              </div>
              {mandiriHolder && (
                <>
                  <p className="text-sm text-[#5D4E37]/70">A.n</p>
                  <p className="mt-1 font-medium text-base text-[#7BA876]">{mandiriHolder}</p>
                </>
              )}
              <p className="mt-3 text-xs text-[#5D4E37]/60 italic">Semoga hadiah ini menjadi keberkahan bagi kita.</p>
            </div>
          </div>
        ) : null}

        {showBca && bcaAccount ? (
          <div className="rounded-3xl border border-[#5F7FA8]/20 bg-[#5F7FA8]/10 p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5F7FA8]/30 overflow-hidden">
                <img src="/bca.svg" alt="Logo Bank BCA" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#5D4E37] font-bold">Bank</p>
                <p className="text-xl font-bold text-[#3b2a1f]">BCA</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#5D4E37]/70">No. Rekening</p>
                  <p className="mt-2 font-semibold text-xl text-[#5F7FA8]">{bcaAccount}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bcaAccount, "bca")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#5F7FA8]/30 bg-white/90 px-4 py-2 text-sm font-semibold text-[#3b2a1f] transition hover:bg-[#f8fbff]"
                >
                  <Clipboard className="w-4 h-4" />
                  {copiedAccount === "bca" ? "Tersalin" : "Salin"}
                </button>
              </div>
              {bcaHolder && (
                <>
                  <p className="text-sm text-[#5D4E37]/70">A.n</p>
                  <p className="mt-1 font-medium text-base text-[#5F7FA8]">{bcaHolder}</p>
                </>
              )}
              <p className="mt-3 text-xs text-[#5D4E37]/60 italic">Terima kasih atas perhatian dan doa restu Anda.</p>
            </div>
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
