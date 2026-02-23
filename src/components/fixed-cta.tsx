"use client";

import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTrackEvent } from "./tracking-client";

export function FixedCTA() {
  const track = useTrackEvent();
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "0120-000-000";
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "#";

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/30 p-2 md:hidden"
    >
      <div className="flex gap-2 max-w-lg mx-auto">
        <a
          href={`tel:${phone.replace(/-/g, "")}`}
          onClick={() => track("click_tel")}
          className="flex-1 flex items-center justify-center gap-2 gradient-cta text-white rounded-xl py-3.5 font-bold text-sm shadow-lg shadow-navy-600/20 active:scale-95 transition-transform"
        >
          <Phone className="h-5 w-5" />
          電話で相談
        </a>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("click_line")}
          className="flex-1 flex items-center justify-center gap-2 bg-[#06C755] text-white rounded-xl py-3.5 font-bold text-sm shadow-lg shadow-[#06C755]/20 active:scale-95 transition-transform"
        >
          <MessageCircle className="h-5 w-5" />
          LINEで相談
        </a>
      </div>
    </motion.div>
  );
}
