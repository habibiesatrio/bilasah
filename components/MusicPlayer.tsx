"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Pause, Play } from "lucide-react";

interface MusicPlayerProps {
  src: string;
  title?: string;
}

export default function MusicPlayer({ src, title }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isYouTube, setIsYouTube] = useState(false);
  const [videoId, setVideoId] = useState<string>("");

  // Extract YouTube video ID
  useEffect(() => {
    if (!src) return;
    
    // Check if it's a YouTube URL
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of youtubePatterns) {
      const match = src.match(pattern);
      if (match && match[1]) {
        setIsYouTube(true);
        setVideoId(match[1]);
        return;
      }
    }
    
    setIsYouTube(false);
    setVideoId("");
  }, [src]);

  // Auto-play for direct audio files
  useEffect(() => {
    if (isYouTube || !src) return;
    
    const audio = audioRef.current;
    if (!audio || !src) return;

    audio.volume = 0.45;
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [src, isYouTube]);

  if (!src) return null;

  const toggleMusic = async () => {
    if (isYouTube) {
      // Toggle YouTube iframe via postMessage
      const iframe = document.querySelector('iframe[src*="youtube"]') as HTMLIFrameElement;
      if (iframe?.contentWindow) {
        if (isPlaying) {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } else {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
        setIsPlaying(!isPlaying);
      }
    } else {
      const audio = audioRef.current;
      if (!audio) return;

      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <>
      {/* YouTube IFrame (hidden, controlled via API) */}
      {isYouTube && (
        <iframe
          id="youtube-player"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1`}
          className="hidden"
          allow="autoplay; encrypted-media"
        />
      )}

      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
        {title && !isYouTube && (
          <div className="hidden sm:flex max-w-[220px] items-center gap-2 rounded-full border border-jawa-gold/35 bg-[#f8f3e8]/90 px-4 py-2 text-xs font-semibold text-jawa-dark shadow-lg backdrop-blur">
            <Music className="h-4 w-4 text-jawa-maroon" />
            <span className="truncate">{title}</span>
          </div>
        )}

        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Pause musik" : "Putar musik"}
          title={isPlaying ? "Pause musik" : "Putar musik"}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-jawa-gold/40 bg-jawa-maroon text-jawa-cream shadow-xl transition-all hover:bg-jawa-dark"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 pl-0.5" />}
        </button>

        {!isYouTube && <audio ref={audioRef} src={src} loop preload="auto" />}
      </div>
    </>
  );
}
