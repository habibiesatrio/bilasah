"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, ExternalLink } from "lucide-react";
import { useSettings } from "@/lib/SettingsContext";

export default function Location() {
  const { settings } = useSettings();

  const parseLocalDateTime = (value: string | undefined, fallback: string) => {
    const source = value && value.trim() !== "" ? value : fallback;
    const match = source.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
    );

    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second || "0")
      );
    }

    const parsed = new Date(source);
    return Number.isNaN(parsed.getTime()) ? new Date(fallback) : parsed;
  };

  const weddingDate = parseLocalDateTime(settings?.wedding_date, "2026-04-23T08:00:00");

  const eventStartDate = new Date(weddingDate);
  eventStartDate.setHours(8, 0, 0, 0);
  const eventEndDate = new Date(weddingDate);
  eventEndDate.setHours(12, 0, 0, 0);

  const formatTimeForCalendar = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const startTime = formatTimeForCalendar(eventStartDate);
  const endTime = formatTimeForCalendar(eventEndDate);

  const eventTitle = "Pernikahan Habibie dan Lathifa";
  const eventDescription = "Kami mengundang Anda untuk hadir di pernikahan Habibie & Lathifa di Griya Sekar Kinasih.";
  const eventLocation = "Griya Sekar Kinasih, Bekasi";

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;

  const icsBase = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "BEGIN:VEVENT",
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:${eventDescription}`,
    `LOCATION:${eventLocation}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\n");

  const icsContent = `data:text/calendar;charset=utf8,${encodeURIComponent(icsBase)}`;

  const formattedDate = weddingDate.toLocaleDateString("id-ID", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const googleMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=Griya+Sekar+Kinasih+Bekasi&travelmode=driving";
  const akadTime = "08.00 WIB";
  const resepsiTime = "11.00 WIB";


  return (
    <section className="py-16 px-6 font-serif bg-[#F5F1E8] jawa-pattern">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="w-12 h-12 bg-[#E5D4B8] border border-[#C89B7B]/30 rounded-full flex items-center justify-center mx-auto"
          >
            <MapPin className="w-6 h-6 text-[#7BA876]" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#3b2a1f] tracking-tight">Lokasi Acara</h2>
          <p className="text-[#5D4E37] italic text-lg">Griya Sekar Kinasih, Bekasi</p>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-8 bg-[#F5F1E8]/80 border border-[#C89B7B]/20 rounded-[2rem] shadow-md"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-[#7BA876] font-bold mb-4">Alamat Acara</p>
            <p className="text-xl font-semibold text-[#3b2a1f] mb-3">Griya Sekar Kinasih, Bekasi</p>
            <p className="text-[#5D4E37] leading-relaxed">
              Griya Sekar Kinasih. Q299+8J7, RT.004/RW.012, Duren Jaya, Kec. Bekasi Tim., Kota Bks, Jawa Barat 17112
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="p-8 bg-[#F5F1E8]/80 border border-[#C89B7B]/20 rounded-[2rem] shadow-md"
            >
              <p className="text-sm uppercase tracking-[0.28em] text-[#7BA876] font-bold mb-4">Akad</p>
              <p className="text-4xl font-bold text-[#3b2a1f] mb-3">{akadTime}</p>
              <p className="text-[#5D4E37] leading-relaxed">
                Acara akad akan dimulai tepat pada waktu yang tercantum. Mohon hadir lebih awal untuk persiapan dan doa bersama.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="p-8 bg-[#F5F1E8]/80 border border-[#C89B7B]/20 rounded-[2rem] shadow-md"
            >
              <p className="text-sm uppercase tracking-[0.28em] text-[#5F7FA8] font-bold mb-4">Resepsi</p>
              <p className="text-4xl font-bold text-[#3b2a1f] mb-3">{resepsiTime}</p>
              <p className="text-[#5D4E37] leading-relaxed">
                Acara resepsi dimulai setelah akad selesai. Terima kasih atas kehadiran dan doa restu Anda.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-4 bg-[#F5F1E8] border border-[#C89B7B]/30 text-[#3b2a1f] rounded-2xl font-bold text-sm shadow-sm hover:bg-[#E5D4B8] transition-all"
            >
              <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" className="w-5 h-5 mr-3" alt="Google" />
              Tambahkan ke Google Calendar
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={icsContent}
              download="Wedding_Habibie_Lathifa.ics"
              className="flex items-center justify-center px-6 py-4 bg-[#F5F1E8] border border-[#C89B7B]/30 text-[#3b2a1f] rounded-2xl font-bold text-sm shadow-sm hover:bg-[#E5D4B8] transition-all"
            >
              <Calendar className="w-5 h-5 mr-3 text-[#7BA876]" />
              Unduh Kalender
            </motion.a>
          </div>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-4 bg-[#5F7FA8] text-[#F5F1E8] rounded-2xl font-bold shadow-lg hover:bg-[#506B95] transition-all"
          >
            <ExternalLink className="w-5 h-5 mr-3" />
            Panduan Arah di Google Maps
          </motion.a>
        </div>
      </div>
    </section>
  );
}
