"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Users,
  UserMinus,
  UserCheck,
  LogOut,
  Download,
  Search,
  Calendar,
  Filter,
  UserPlus,
  Link as LinkIcon,
  Copy,
  Check,
  Send,
  Trash2,
  ExternalLink,
  Settings as SettingsIcon,
  Clock,
  Heart as HeartIcon,
  Image as GalleryIcon,
  Plus,
  Save
} from "lucide-react";
import { useSettings, LoveStoryItem, GalleryItem } from "@/lib/SettingsContext";

interface GuestData {
  id: string;
  name: string;
  attendance: "Hadir" | "Tidak Hadir";
  guest_count: number;
  message: string;
  created_at: string;
}

interface Invitation {
  id: string;
  name: string;
  link: string;
  isCopied: boolean;
}

export default function AdminDashboard() {
  const { settings, refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<"responses" | "invite" | "settings">("responses");
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"Semua" | "Hadir" | "Tidak Hadir">("Semua");

  // Invitation States
  const [bulkInput, setBulkInput] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Content Settings States
  const [weddingDate, setWeddingDate] = useState<string>("");
  const [weddingEndTime, setWeddingEndTime] = useState<string>("");
  const [loveStory, setLoveStory] = useState<LoveStoryItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin/login");
      return;
    }

    fetchGuests();
    // Load invitations from local storage if any
    const savedInvites = localStorage.getItem("wedding_invitations");
    if (savedInvites) {
      setInvitations(JSON.parse(savedInvites));
    }
  }, [router]);

  // Sync content settings state with DB
  useEffect(() => {
    if (settings) {
      setWeddingDate(settings.wedding_date.slice(0, 16)); // Format YYYY-MM-DDTHH:mm
      setWeddingEndTime(settings.wedding_end_time.slice(0, 16));
      setLoveStory(settings.love_story || []);
      setGallery(settings.gallery || []);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("settings")
        .update({
          wedding_date: weddingDate,
          wedding_end_time: weddingEndTime,
          love_story: loveStory,
          gallery: gallery,
          updated_at: new Date().toISOString()
        })
        .eq("id", "wedding_config");

      if (error) throw error;
      await refreshSettings();
      alert("Pengaturan berhasil disimpan!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Gagal menyimpan pengaturan. Pastikan tabel 'settings' sudah dibuat.");
    } finally {
      setIsSaving(false);
    }
  };


  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          setDbError("Table 'guestbook' belum dibuat di Supabase.");
        } else {
          setDbError(error.message);
        }
        throw error;
      }
      setGuests(data || []);
      setDbError(null);
    } catch (error) {
      console.error("Error fetching guests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/admin/login");
  };

  const handleGenerateInvitations = () => {
    if (!bulkInput.trim()) return;

    const names = bulkInput
      .split("\n")
      .map(name => name.trim())
      .filter(name => name !== "");

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const finalBaseUrl = baseUrl || "https://wedding-habibie-lala.vercel.app";

    const newInvitations: Invitation[] = names.map(name => ({
      id: Math.random().toString(36).substring(7),
      name,
      link: `${finalBaseUrl}?to=${encodeURIComponent(name)}`,
      isCopied: false,
    }));

    const updatedInvitations = [...newInvitations, ...invitations];
    setInvitations(updatedInvitations);
    localStorage.setItem("wedding_invitations", JSON.stringify(updatedInvitations));
    setBulkInput("");
  };

  const copyToClipboard = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setInvitations(prev =>
      prev.map(inv => inv.id === id ? { ...inv, isCopied: true } : inv)
    );
    setTimeout(() => {
      setInvitations(prev =>
        prev.map(inv => inv.id === id ? { ...inv, isCopied: false } : inv)
      );
    }, 2000);
  };

  const deleteInvitation = (id: string) => {
    const updated = invitations.filter(inv => inv.id !== id);
    setInvitations(updated);
    localStorage.setItem("wedding_invitations", JSON.stringify(updated));
  };

  const clearAllInvitations = () => {
    if (confirm("Hapus semua daftar undangan?")) {
      setInvitations([]);
      localStorage.removeItem("wedding_invitations");
    }
  };

  const shareToWhatsApp = (name: string, link: string) => {
    const message = `Halo ${name}, kami mengundang Anda untuk hadir di acara pernikahan kami. Silakan buka undangan digital kami pada link berikut: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const stats = {
    totalRespon: guests.length,
    totalHadir: guests.filter(g => g.attendance === "Hadir").length,
    totalTidakHadir: guests.filter(g => g.attendance === "Tidak Hadir").length,
    totalPax: guests.reduce((acc, g) => acc + (g.attendance === "Hadir" ? (g.guest_count || 1) : 0), 0),
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "Semua" || guest.attendance === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-merah-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 p-4 md:p-8 font-serif">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-sage-900">Admin Dashboard</h1>
            <p className="text-sage-500 italic">Wedding Habibie & Lala • Management & Analytics</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-white text-merah-600 border border-merah-200 rounded-xl hover:bg-merah-50 transition-all font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 bg-white/40 p-1.5 rounded-2xl border border-white/50 w-fit">
          <button
            onClick={() => setActiveTab("responses")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "responses"
                ? "bg-merah-700 text-white shadow-md"
                : "text-sage-600 hover:bg-white/50"
              }`}
          >
            <Users className="w-4 h-4 inline-block mr-2" />
            Data Tamu (RSVP)
          </button>
          <button
            onClick={() => setActiveTab("invite")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "invite"
                ? "bg-merah-700 text-white shadow-md"
                : "text-sage-600 hover:bg-white/50"
              }`}
          >
            <UserPlus className="w-4 h-4 inline-block mr-2" />
            Buat Undangan
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "settings"
                ? "bg-merah-700 text-white shadow-md"
                : "text-sage-600 hover:bg-white/50"
              }`}
          >
            <SettingsIcon className="w-4 h-4 inline-block mr-2" />
            Pengaturan Konten
          </button>
        </div>

        <AnimatePresence>
          {dbError && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-merah-50 border border-merah-200 rounded-2xl p-4 flex items-start space-x-3 text-merah-700 overflow-hidden"
            >
              <div className="p-1">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-bold">Database Connection Error</p>
                <p className="italic opacity-80">{dbError} Pastikan Anda sudah menjalankan SQL script di Supabase SQL Editor.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === "responses" ? (
            <motion.div
              key="responses"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Respon", value: stats.totalRespon, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Total Hadir", value: stats.totalHadir, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Tidak Hadir", value: stats.totalTidakHadir, icon: UserMinus, color: "text-merah-600", bg: "bg-merah-50" },
                  { label: "Total Pax", value: stats.totalPax, icon: Users, color: "text-sage-600", bg: "bg-sage-50" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glassmorphism p-6 bg-white/60 border-white/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-sage-500 uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                      </div>
                      <div className={`${stat.bg} p-3 rounded-2xl`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/40 p-4 rounded-3xl border border-white/50 backdrop-blur-sm">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
                  <input
                    type="text"
                    placeholder="Cari nama tamu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 border border-sage-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-merah-500/20 focus:border-merah-500 transition-all text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sage-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="w-full md:w-40 pl-9 pr-8 py-3 bg-white/80 border border-sage-200 rounded-2xl appearance-none text-sm focus:outline-none"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Hadir">Hadir</option>
                      <option value="Tidak Hadir">Tidak Hadir</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      const headers = ["Nama", "Kehadiran", "Jumlah Tamu", "Pesan", "Waktu Konfirmasi"];
                      const rows = filteredGuests.map(g => [
                        g.name,
                        g.attendance,
                        g.attendance === "Hadir" ? g.guest_count : 0,
                        g.message.replace(/,/g, " "),
                        new Date(g.created_at).toLocaleString("id-ID")
                      ]);
                      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
                      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                      const link = document.createElement("a");
                      const url = URL.createObjectURL(blob);
                      link.setAttribute("href", url);
                      link.setAttribute("download", `Data_Tamu_Wedding_Habibie_Lala.csv`);
                      link.click();
                    }}
                    className="flex items-center justify-center px-6 py-3 bg-sage-800 text-white rounded-2xl hover:bg-sage-900 transition-all text-sm font-bold shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="glassmorphism bg-white/60 border-white/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-sage-100/50">
                        <th className="p-5 text-sm font-bold text-sage-700 uppercase tracking-widest border-b border-sage-200">Nama Tamu</th>
                        <th className="p-5 text-sm font-bold text-sage-700 uppercase tracking-widest border-b border-sage-200">Status</th>
                        <th className="p-5 text-sm font-bold text-sage-700 uppercase tracking-widest border-b border-sage-200">Pax</th>
                        <th className="p-5 text-sm font-bold text-sage-700 uppercase tracking-widest border-b border-sage-200">Ucapan</th>
                        <th className="p-5 text-sm font-bold text-sage-700 uppercase tracking-widest border-b border-sage-200">Waktu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sage-100">
                      {filteredGuests.map((guest) => (
                        <motion.tr
                          key={guest.id}
                          className="hover:bg-white/40 transition-colors"
                        >
                          <td className="p-5 font-bold text-sage-900">{guest.name}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${guest.attendance === "Hadir"
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-merah-50 text-merah-700 border-merah-100"
                              }`}>
                              {guest.attendance}
                            </span>
                          </td>
                          <td className="p-5 text-sage-600 font-medium">
                            {guest.attendance === "Hadir" ? guest.guest_count : "-"}
                          </td>
                          <td className="p-5 text-sage-600 text-sm italic max-w-xs truncate">
                            "{guest.message}"
                          </td>
                          <td className="p-5 text-sage-400 text-[10px] uppercase">
                            {new Date(guest.created_at).toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short"
                            })}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "invite" ? (
            <motion.div
              key="invite"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Input Form */}
              <div className="lg:col-span-1 space-y-6">
                <div className="glassmorphism p-6 bg-white/60 border-white/50 space-y-4">
                  <h3 className="text-xl font-bold text-sage-900 flex items-center">
                    <UserPlus className="w-5 h-5 mr-2 text-merah-600" />
                    Input Daftar Tamu
                  </h3>
                  <p className="text-sm text-sage-600 italic">
                    Masukkan nama tamu (satu nama per baris). Link unik akan dibuat otomatis untuk setiap nama.
                  </p>
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    rows={10}
                    className="w-full p-4 bg-white/80 border border-sage-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-merah-500/20 focus:border-merah-500 transition-all text-sm resize-none"
                    placeholder="Contoh:&#10;Budi Sudarsono&#10;Keluarga Bapak Ahmad&#10;Susi & Partner"
                  />
                  <button
                    onClick={handleGenerateInvitations}
                    className="w-full py-4 bg-merah-700 text-white rounded-xl font-bold shadow-lg hover:bg-merah-800 transition-all flex items-center justify-center"
                  >
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Generate Link Undangan
                  </button>
                </div>
              </div>

              {/* Invitation List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glassmorphism p-6 bg-white/60 border-white/50 space-y-6 min-h-[400px]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-sage-900 flex items-center">
                      <LinkIcon className="w-5 h-5 mr-2 text-merah-600" />
                      Daftar Link Undangan
                    </h3>
                    {invitations.length > 0 && (
                      <button
                        onClick={clearAllInvitations}
                        className="text-xs text-merah-600 font-bold hover:underline flex items-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Hapus Semua
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {invitations.length === 0 ? (
                      <div className="text-center py-20">
                        <p className="text-sage-400 italic">Belum ada link yang dibuat. Silakan input nama tamu di sebelah kiri.</p>
                      </div>
                    ) : (
                      invitations.map((inv) => (
                        <motion.div
                          key={inv.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/80 border border-sage-100 rounded-2xl gap-4 hover:shadow-md transition-all"
                        >
                          <div className="space-y-1">
                            <p className="font-bold text-sage-900">{inv.name}</p>
                            <p className="text-[10px] text-sage-400 truncate max-w-[200px] sm:max-w-xs">{inv.link}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyToClipboard(inv.id, inv.link)}
                              className={`p-2.5 rounded-xl transition-all flex items-center text-xs font-bold ${inv.isCopied
                                  ? "bg-green-100 text-green-700"
                                  : "bg-sage-100 text-sage-700 hover:bg-sage-200"
                                }`}
                            >
                              {inv.isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                              {inv.isCopied ? "Tersalin" : "Salin Link"}
                            </button>
                            <button
                              onClick={() => shareToWhatsApp(inv.name, inv.link)}
                              className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all flex items-center text-xs font-bold"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              WhatsApp
                            </button>
                            <button
                              onClick={() => deleteInvitation(inv.id)}
                              className="p-2.5 bg-merah-50 text-merah-600 rounded-xl hover:bg-merah-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pb-20"
            >
              {/* Wedding Time Settings */}
              <div className="glassmorphism p-8 bg-white/60 border-white/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-sage-900 flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-merah-600" />
                    Waktu Pernikahan
                  </h3>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="flex items-center px-6 py-3 bg-merah-700 text-white rounded-2xl font-bold shadow-lg hover:bg-merah-800 transition-all disabled:bg-sage-300"
                  >
                    {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Simpan Perubahan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-700 uppercase tracking-widest">Waktu Mulai (Akad/Pemberkatan)</label>
                    <input
                      type="datetime-local"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full p-4 bg-white/80 border border-sage-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-merah-500/20 focus:border-merah-500 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-700 uppercase tracking-widest">Waktu Selesai (Resepsi)</label>
                    <input
                      type="datetime-local"
                      value={weddingEndTime}
                      onChange={(e) => setWeddingEndTime(e.target.value)}
                      className="w-full p-4 bg-white/80 border border-sage-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-merah-500/20 focus:border-merah-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Love Story Editor */}
              <div className="glassmorphism p-8 bg-white/60 border-white/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-sage-900 flex items-center">
                    <HeartIcon className="w-6 h-6 mr-3 text-merah-600" />
                    Love Story (Timeline)
                  </h3>
                  <button
                    onClick={() => setLoveStory([...loveStory, { year: "", title: "", description: "" }])}
                    className="flex items-center px-4 py-2 bg-sage-100 text-sage-700 rounded-xl font-bold hover:bg-sage-200 transition-all text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Tambah Momen
                  </button>
                </div>

                <div className="space-y-4">
                  {loveStory.map((item, index) => (
                    <motion.div key={index} layout className="p-6 bg-white/80 border border-sage-100 rounded-3xl space-y-4 relative group">
                      <button
                        onClick={() => setLoveStory(loveStory.filter((_, i) => i !== index))}
                        className="absolute top-4 right-4 text-merah-400 hover:text-merah-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-sage-500 uppercase">Waktu/Tahun</label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => {
                              const newStory = [...loveStory];
                              newStory[index].year = e.target.value;
                              setLoveStory(newStory);
                            }}
                            className="w-full p-3 bg-sage-50 border border-sage-100 rounded-xl focus:outline-none"
                            placeholder="Contoh: Januari 2021"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-sage-500 uppercase">Judul Momen</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newStory = [...loveStory];
                              newStory[index].title = e.target.value;
                              setLoveStory(newStory);
                            }}
                            className="w-full p-3 bg-sage-50 border border-sage-100 rounded-xl focus:outline-none"
                            placeholder="Contoh: Awal Pertemuan"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-sage-500 uppercase">Deskripsi</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const newStory = [...loveStory];
                            newStory[index].description = e.target.value;
                            setLoveStory(newStory);
                          }}
                          className="w-full p-3 bg-sage-50 border border-sage-100 rounded-xl focus:outline-none resize-none"
                          rows={2}
                          placeholder="Ceritakan singkat momen ini..."
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Gallery Editor */}
              <div className="glassmorphism p-8 bg-white/60 border-white/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-sage-900 flex items-center">
                    <GalleryIcon className="w-6 h-6 mr-3 text-merah-600" />
                    Galeri Foto (URL)
                  </h3>
                  <button
                    onClick={() => setGallery([...gallery, { url: "", alt: "" }])}
                    className="flex items-center px-4 py-2 bg-sage-100 text-sage-700 rounded-xl font-bold hover:bg-sage-200 transition-all text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Tambah Foto
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gallery.map((item, index) => (
                    <div key={index} className="p-4 bg-white/80 border border-sage-100 rounded-3xl space-y-3 relative group">
                      <button
                        onClick={() => setGallery(gallery.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 text-merah-400 hover:text-merah-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          const newGallery = [...gallery];
                          newGallery[index].url = e.target.value;
                          setGallery(newGallery);
                        }}
                        className="w-full p-2 text-sm bg-sage-50 border border-sage-100 rounded-lg focus:outline-none"
                        placeholder="Link Gambar (URL)"
                      />
                      {item.url && (
                        <div className="h-20 w-full rounded-xl overflow-hidden bg-sage-100">
                          <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
