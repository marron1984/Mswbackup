"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useTrackEvent } from "./tracking-client";

export function FixedCTA() {
  const track = useTrackEvent();
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "0120-000-000";
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "#";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-2 md:hidden">
      <div className="flex gap-2 max-w-lg mx-auto">
        <a
          href={`tel:${phone.replace(/-/g, "")}`}
          onClick={() => track("click_tel")}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg py-3 font-bold text-sm hover:bg-green-700 transition-colors"
        >
          <Phone className="h-5 w-5" />
          電話で相談
        </a>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("click_line")}
          className="flex-1 flex items-center justify-center gap-2 bg-[#06C755] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#05b34d] transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          LINEで相談
        </a>
      </div>
    </div>
  );
}
