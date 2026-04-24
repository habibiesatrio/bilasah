"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface LoveStoryItem {
  year: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  url: string;
  alt: string;
}

export interface WeddingSettings {
  wedding_date: string;
  wedding_end_time: string;
  love_story: LoveStoryItem[];
  gallery: GalleryItem[];
}

interface SettingsContextType {
  settings: WeddingSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<WeddingSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", "wedding_config")
        .single();

      if (error) throw error;
      if (data) {
        setSettings({
          wedding_date: data.wedding_date,
          wedding_end_time: data.wedding_end_time,
          love_story: data.love_story || [],
          gallery: data.gallery || [],
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Fallback data if DB not ready
      setSettings({
        wedding_date: "2026-04-23T09:00:00",
        wedding_end_time: "2026-04-23T13:00:00",
        love_story: [],
        gallery: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Subscribe to changes
    const channel = supabase
      .channel("settings_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings", filter: "id=eq.wedding_config" },
        () => fetchSettings()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
