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
  const resepsiTime = "10.00 WIB";


  return (
    <section className="py-24 px-6 font-serif bg-jawa-ivory jawa-pattern">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="w-12 h-12 bg-[#efe1c6] border border-jawa-gold/40 rounded-full flex items-center justify-center mx-auto"
          >
            <MapPin className="w-6 h-6 text-jawa-maroon" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-jawa-dark tracking-tight">Lokasi Acara</h2>
          <p className="text-jawa-brown italic text-lg">Griya Sekar Kinasih, Bekasi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8 glassmorphism jawa-frame p-8 bg-jawa-cream/85 border border-jawa-gold/35 shadow-xl"
          >
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[#efe1c6] p-3 rounded-2xl border border-jawa-gold/35">
                  <Calendar className="w-6 h-6 text-jawa-maroon" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-jawa-dark">Hari & Tanggal</h3>
                  <p className="text-jawa-brown">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#efe1c6] p-3 rounded-2xl border border-jawa-gold/35">
                  <Clock className="w-6 h-6 text-jawa-maroon" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-jawa-dark">Waktu</h3>
                  <p className="text-jawa-brown">Akad 08.00 WIB • Resepsi 10.00 WIB</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#efe1c6] p-3 rounded-2xl border border-jawa-gold/35">
                  <MapPin className="w-6 h-6 text-jawa-maroon" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-jawa-dark">Alamat</h3>
                  <p className="text-jawa-brown leading-relaxed">
                    Griya Sekar Kinasih. Q299+8J7, RT.004/RW.012, Duren Jaya, Kec. Bekasi Tim., Kota Bks, Jawa Barat 17112
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 py-4 bg-jawa-ivory border border-jawa-gold/35 text-jawa-dark rounded-2xl font-bold text-sm shadow-sm hover:bg-[#efe1c6] transition-all"
                >
                  <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" className="w-5 h-5 mr-3" alt="Google" />
                  Tambahkan ke Google Calendar
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={icsContent}
                  download="Wedding_Habibie_Lathifa.ics"
                  className="flex items-center justify-center px-6 py-4 bg-jawa-ivory border border-jawa-gold/35 text-jawa-dark rounded-2xl font-bold text-sm shadow-sm hover:bg-[#efe1c6] transition-all"
                >
                  <Calendar className="w-5 h-5 mr-3 text-jawa-maroon" />
                  Unduh Kalender
                </motion.a>
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-6 py-4 bg-jawa-maroon text-jawa-cream rounded-2xl font-bold shadow-lg hover:bg-[#5f2323] transition-all"
              >
                <ExternalLink className="w-5 h-5 mr-3" />
                Panduan Arah di Google Maps
              </motion.a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-jawa-gold/30 rounded-3xl shadow-lg">
                  <p className="text-sm uppercase tracking-[0.28em] text-jawa-maroon font-bold mb-3">Akad</p>
                  <p className="text-4xl font-bold text-jawa-dark mb-2">{akadTime}</p>
                  <p className="text-jawa-brown leading-relaxed">Acara akad dimulai tepat pada waktu yang tercantum.</p>
                </div>
                <div className="p-6 bg-white border border-jawa-gold/30 rounded-3xl shadow-lg">
                  <p className="text-sm uppercase tracking-[0.28em] text-jawa-maroon font-bold mb-3">Resepsi</p>
                  <p className="text-4xl font-bold text-jawa-dark mb-2">{resepsiTime}</p>
                  <p className="text-jawa-brown leading-relaxed">Acara resepsi dimulai setelah akad selesai.</p>
                </div>
              </div>

              <div className="p-6 bg-white border border-jawa-gold/35 rounded-3xl shadow-lg">
                <h3 className="text-xl font-bold text-jawa-dark mb-3">Informasi Lokasi</h3>
                <p className="text-jawa-brown leading-relaxed mb-4">
                  Lokasi acara berada di Griya Sekar Kinasih, Bekasi. Silakan gunakan tombol Google Maps untuk mendapatkan arah yang akurat dan profesional.
                </p>
                <p className="text-sm text-jawa-maroon uppercase tracking-[0.24em] font-semibold mb-2">Alamat Utama</p>
                <p className="text-jawa-brown leading-relaxed">
                  Q299+8J7, RT.004/RW.012, Duren Jaya, Kec. Bekasi Tim., Kota Bekasi, Jawa Barat 17112.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
