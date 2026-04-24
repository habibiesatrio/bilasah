"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication for demonstration
    // In production, use Supabase Auth or a more secure method
    if (username === "admin" && password === "habibielala2026") {
      localStorage.setItem("isAdminLoggedIn", "true");
      router.push("/admin");
    } else {
      setError("Username atau password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-4 font-serif">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glassmorphism p-8 bg-white/40 border-sage-200"
      >
        <div className="text-center mb-8 space-y-2">
          <div className="w-16 h-16 bg-merah-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-merah-600" />
          </div>
          <h1 className="text-3xl font-bold text-sage-900">Admin Login</h1>
          <p className="text-sage-500 italic">Wedding Habibie & Lala</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-sage-700 ml-1">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-sage-400 group-focus-within:text-merah-500 transition-colors" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-sage-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-merah-500/20 focus:border-merah-500 transition-all"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-sage-700 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-sage-400 group-focus-within:text-merah-500 transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-sage-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-merah-500/20 focus:border-merah-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-merah-600 text-sm text-center font-medium"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-merah-700 text-white rounded-xl font-bold shadow-lg hover:bg-merah-800 transition-all flex items-center justify-center"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Masuk ke Dashboard
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
