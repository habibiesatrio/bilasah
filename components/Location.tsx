"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, ExternalLink } from "lucide-react";
import { useSettings } from "@/lib/SettingsContext";

export default function Location() {
  const { settings } = useSettings();

  const weddingDate = settings?.wedding_date ? new Date(settings.wedding_date) : new Date("2026-04-23T09:00:00");
  const weddingEndDate = settings?.wedding_end_time ? new Date(settings.wedding_end_time) : new Date("2026-04-23T13:00:00");

  const formatTimeForCalendar = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const startTime = formatTimeForCalendar(weddingDate);
  const endTime = formatTimeForCalendar(weddingEndDate);

  const eventTitle = "Pernikahan Habibie & Lala";
  const eventDescription = "Kami mengundang Anda untuk merayakan hari bahagia kami.";
  const eventLocation = "Griya Sekar Kinasih. Q299+8J7, RT.004/RW.012, Duren Jaya, Kec. Bekasi Tim., Kota Bks, Jawa Barat 17112";

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;

  // Apple/ICS format
  const icsContent = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription}
LOCATION:${eventLocation}
END:VEVENT
END:VCALENDAR`;

  const formattedDate = weddingDate.toLocaleDateString("id-ID", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedTime = `${weddingDate.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} - ${weddingEndDate.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB`;


  return (
    <section className="py-24 px-6 font-serif bg-white/50">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="w-12 h-12 bg-merah-100 rounded-full flex items-center justify-center mx-auto"
          >
            <MapPin className="w-6 h-6 text-merah-600" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-sage-900 tracking-tight">Lokasi Acara</h2>
          <p className="text-sage-600 italic text-lg">Griya Sekar Kinasih, Bekasi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8 glassmorphism p-8 bg-white/60 border-sage-200 shadow-xl"
          >
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-merah-50 p-3 rounded-2xl">
                  <Calendar className="w-6 h-6 text-merah-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-sage-900">Hari & Tanggal</h3>
                  <p className="text-sage-700">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-merah-50 p-3 rounded-2xl">
                  <Clock className="w-6 h-6 text-merah-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-sage-900">Waktu</h3>
                  <p className="text-sage-700">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-merah-50 p-3 rounded-2xl">
                  <MapPin className="w-6 h-6 text-merah-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-sage-900">Alamat</h3>
                  <p className="text-sage-700 leading-relaxed">
                    Griya Sekar Kinasih. Q299+8J7, RT.004/RW.012, Duren Jaya, Kec. Bekasi Tim., Kota Bks, Jawa Barat 17112
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-6 py-4 bg-white border border-sage-200 text-sage-800 rounded-2xl font-bold text-sm shadow-sm hover:bg-sage-50 transition-all"
              >
                <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" className="w-5 h-5 mr-3" alt="Google" />
                Google Calendar
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={icsContent}
                download="Wedding_Habibie_Lala.ics"
                className="flex items-center justify-center px-6 py-4 bg-white border border-sage-200 text-sage-800 rounded-2xl font-bold text-sm shadow-sm hover:bg-sage-50 transition-all"
              >
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                Apple Calendar
              </motion.a>
            </div>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://maps.app.goo.gl/i7Kzy2UU2BQdkBeQ6"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center px-6 py-4 bg-merah-700 text-white rounded-2xl font-bold shadow-lg hover:bg-merah-800 transition-all"
            >
              <ExternalLink className="w-5 h-5 mr-3" />
              Buka di Google Maps
            </motion.a>
          </motion.div>

          {/* Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.121545674!2d107.0182657!3d-6.2477383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698ef65f573e65%3A0xc3f140026e95c1a8!2sGriya%20Sekar%20Kinasih!5e0!3m2!1sid!2sid!4v1713861234567!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
