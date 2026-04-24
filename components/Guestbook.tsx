"use client";

import React, { useState, useEffect, Suspense } from "react";
import { MessageSquare, Users, User, Send, Heart, CheckCircle2, UserPlus, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  attendance: "Hadir" | "Tidak Hadir";
  guest_count: number;
  created_at: string;
}

function GuestbookContent() {
  const searchParams = useSearchParams();
  const guestNameFromUrl = searchParams.get("to");

  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: guestNameFromUrl || "",
    message: "",
    attendance: "Hadir" as "Hadir" | "Tidak Hadir",
    guest_count: 1,
  });

  // Update name if URL parameter changes
  useEffect(() => {
    if (guestNameFromUrl) {
      setFormData(prev => ({ ...prev, name: guestNameFromUrl }));
    }
  }, [guestNameFromUrl]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // Error code 42P01 is "relation does not exist" in Postgres
        if (error.code === '42P01') {
          setDbError("Table 'guestbook' belum dibuat di Supabase. Silakan jalankan SQL script di README.");
        } else {
          setDbError(error.message);
        }
        throw error;
      }
      setMessages(data || []);
      setDbError(null);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("guestbook_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guestbook" },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = {
    hadir: messages.filter((m) => m.attendance === "Hadir").length,
    totalTamu: messages.reduce((acc, m) => acc + (m.attendance === "Hadir" ? (m.guest_count || 1) : 0), 0),
    tidakHadir: messages.filter((m) => m.attendance === "Tidak Hadir").length,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("guestbook").insert([
        {
          name: formData.name,
          message: formData.message,
          attendance: formData.attendance,
          guest_count: formData.attendance === "Hadir" ? formData.guest_count : 0,
        },
      ]);

      if (error) throw error;

      setShowSuccess(true);
      setFormData({ name: "", message: "", attendance: "Hadir", guest_count: 1 });
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      console.error("Error submitting message:", error);
      alert(`Gagal mengirim reservasi: ${error.message || "Pastikan tabel 'guestbook' sudah dibuat."}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 font-serif">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* DB Connection Reminder */}
        <AnimatePresence>
          {dbError && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-merah-50 border border-merah-200 rounded-2xl p-4 flex items-start space-x-3 text-merah-700 overflow-hidden"
            >
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-bold">Database Error</p>
                <p className="italic opacity-80">{dbError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glassmorphism p-6 flex items-center justify-between border-sage-300 bg-white/40"
          >
            <div>
              <p className="text-sage-700 text-sm uppercase tracking-wider font-semibold">Total Hadir</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-3xl font-bold text-merah-700">{stats.totalTamu}</p>
                <p className="text-xs text-sage-500 font-medium italic">Tamu</p>
              </div>
            </div>
            <div className="bg-merah-100 p-3 rounded-full">
              <Users className="text-merah-600 w-6 h-6" />
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glassmorphism p-6 flex items-center justify-between border-sage-300 bg-white/40"
          >
            <div>
              <p className="text-sage-700 text-sm uppercase tracking-wider font-semibold">Tidak Hadir</p>
              <p className="text-3xl font-bold text-sage-600">{stats.tidakHadir}</p>
            </div>
            <div className="bg-sage-100 p-3 rounded-full">
              <Users className="text-sage-600 w-6 h-6" />
            </div>
          </motion.div>
        </div>

        {/* Main Card */}
        <div className="glassmorphism p-8 space-y-8 border-sage-300 bg-white/30 backdrop-blur-xl">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Heart className="w-12 h-12 text-merah-600 mx-auto fill-merah-600/20" />
            </motion.div>
            <h1 className="text-5xl font-extrabold text-merah-800 tracking-tight">Reservasi</h1>
            <p className="text-sage-800 text-lg italic">Konfirmasi Kehadiran & Doa Restu</p>
          </div>

          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-green-50/50 border border-green-200 rounded-3xl p-8 text-center space-y-4"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold text-green-800">Terima Kasih, Sayang!</h3>
                <p className="text-green-700 italic">
                  Konfirmasi Anda telah kami terima dengan penuh sukacita. Doa restu Anda sangat berarti bagi awal perjalanan baru kami. Sampai jumpa di hari bahagia kami!
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="text-green-600 font-bold text-sm underline underline-offset-4"
                >
                  Kirim Pesan Lain
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-sage-900 ml-1">
                    Nama Lengkap
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-sage-400 group-focus-within:text-merah-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="block w-full pl-12 pr-4 py-4 border border-sage-200 rounded-2xl leading-5 bg-white/50 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-merah-500/20 focus:border-merah-500 sm:text-sm transition-all shadow-sm hover:bg-white/80"
                      placeholder="Masukkan nama lengkap Anda"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="attendance" className="block text-sm font-medium text-sage-900 ml-1">
                      Pilih Kehadiran
                    </label>
                    <div className="relative">
                      <select
                        id="attendance"
                        value={formData.attendance}
                        onChange={(e) => setFormData({ ...formData, attendance: e.target.value as any })}
                        className="block w-full pl-4 pr-10 py-4 border border-sage-200 rounded-2xl leading-5 bg-white/50 focus:outline-none focus:ring-2 focus:ring-merah-500/20 focus:border-merah-500 sm:text-sm transition-all appearance-none shadow-sm hover:bg-white/80"
                      >
                        <option value="Hadir">Hadir</option>
                        <option value="Tidak Hadir">Tidak Hadir</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-sage-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.attendance === "Hadir" && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-2"
                      >
                        <label htmlFor="guest_count" className="block text-sm font-medium text-sage-900 ml-1">
                          Jumlah Tamu
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <UserPlus className="h-5 w-5 text-sage-400 group-focus-within:text-merah-500 transition-colors" />
                          </div>
                          <input
                            type="number"
                            id="guest_count"
                            min="1"
                            max="5"
                            value={formData.guest_count}
                            onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) || 1 })}
                            className="block w-full pl-12 pr-4 py-4 border border-sage-200 rounded-2xl leading-5 bg-white/50 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-merah-500/20 focus:border-merah-500 sm:text-sm transition-all shadow-sm hover:bg-white/80"
                            required
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-sage-900 ml-1">
                    Ucapan & Doa Restu
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="block w-full px-4 py-4 border border-sage-200 rounded-2xl leading-5 bg-white/50 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-merah-500/20 focus:border-merah-500 sm:text-sm transition-all shadow-sm hover:bg-white/80 resize-none"
                    placeholder="Tuliskan pesan manis untuk Habibie & Lala..."
                    required
                  />
                </div>

                <div className="flex justify-start pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={submitting}
                    className={cn(
                      "inline-flex items-center px-10 py-4 border border-transparent text-base font-bold rounded-2xl shadow-lg text-white transition-all duration-200",
                      submitting ? "bg-sage-400 cursor-not-allowed" : "bg-merah-700 hover:bg-merah-800"
                    )}
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    ) : (
                      <Send className="mr-3 h-5 w-5" />
                    )}
                    {submitting ? "Mengirim..." : "Kirim Konfirmasi"}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* List Section */}
          <div className="pt-12 border-t border-sage-200/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <MessageSquare className="h-7 w-7 text-merah-700 mr-3" />
                <h2 className="text-3xl font-bold text-sage-900">Daftar Ucapan</h2>
              </div>
              <span className="text-sage-500 text-sm font-medium bg-sage-100 px-3 py-1 rounded-full">
                {messages.length} Pesan
              </span>
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-sage-200 scrollbar-track-transparent">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-10 h-10 border-4 border-merah-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sage-500 italic">Memuat ucapan...</p>
                </div>
              ) : messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sage-500 italic py-16 bg-white/20 rounded-3xl border border-dashed border-sage-300"
                >
                  Belum ada ucapan. Jadilah yang pertama memberikan doa!
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/70 p-6 rounded-3xl border border-white shadow-sm transition-all hover:shadow-md hover:bg-white/90"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-merah-500 to-sage-400 flex items-center justify-center text-white font-bold text-lg">
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <h3 className="font-bold text-sage-900 text-xl leading-none">{msg.name}</h3>
                            {msg.attendance === "Hadir" && (
                              <span className="text-[10px] text-sage-500 font-medium uppercase tracking-wider mt-1">
                                {msg.guest_count} Tamu
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={cn(
                          "px-4 py-1.5 rounded-2xl text-xs font-bold tracking-wide uppercase",
                          msg.attendance === "Hadir"
                            ? "bg-merah-50 text-merah-700 border border-merah-100"
                            : "bg-sage-50 text-sage-700 border border-sage-100"
                        )}>
                          {msg.attendance}
                        </span>
                      </div>
                      <p className="text-sage-800 leading-relaxed italic text-lg pl-1">"{msg.message}"</p>
                      <div className="flex items-center mt-4 text-sage-400 text-xs font-medium pl-1 uppercase tracking-widest">
                        <span>{new Date(msg.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Guestbook() {
  return (
    <Suspense fallback={<div className="text-center py-10 italic text-sage-500">Memuat Formulir...</div>}>
      <GuestbookContent />
    </Suspense>
  );
}
