import Link from "next/link";
import { Phone, MessageCircle, Calendar, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThanksAnimation } from "@/components/thanks-animation";

export default function ThanksPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "0120-000-000";
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "#";

  return (
    <main className="min-h-screen bg-[#fafbff]">
      {/* Header */}
      <header className="glass border-b border-white/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-cta flex items-center justify-center">
            <Heart className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-navy-900">ケアナビ</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <ThanksAnimation>
          <div className="text-center mb-10">
            {/* Success icon */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full bg-teal-100 animate-ping opacity-20" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <svg
                  className="h-10 w-10 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-navy-950 mb-3 tracking-tight">
              ご相談を受け付けました
            </h1>
            <p className="text-navy-500">
              内容を確認の上、担当者より速やかにご連絡いたします。
            </p>
          </div>

          {/* Next actions */}
          <div className="bg-white rounded-2xl border border-navy-100/50 shadow-sm p-6 md:p-8 max-w-md mx-auto">
            <h2 className="font-bold text-lg text-navy-900 mb-5 text-center">
              より早くご案内をご希望の方へ
            </h2>
            <div className="space-y-3">
              <a
                href={`tel:${phone.replace(/-/g, "")}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-navy-50/50 hover:bg-navy-50 border border-navy-100/50 transition-all duration-200 hover:shadow-sm group"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-navy-500 to-navy-700 shadow-md shadow-navy-500/20 group-hover:scale-105 transition-transform">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-navy-800">今すぐ電話する</div>
                  <div className="text-sm text-navy-500">{phone}</div>
                </div>
              </a>

              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[#06C755]/5 hover:bg-[#06C755]/10 border border-[#06C755]/10 transition-all duration-200 hover:shadow-sm group"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#06C755] shadow-md shadow-[#06C755]/20 group-hover:scale-105 transition-transform">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-navy-800">LINEで友だち追加</div>
                  <div className="text-sm text-navy-500">
                    チャットでやり取りできます
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-navy-50/30 border border-navy-100/30">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-md shadow-teal-500/20">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-navy-800">面談予約</div>
                  <div className="text-sm text-navy-500">
                    折り返し時に日程調整いたします
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/">
              <Button
                variant="outline"
                className="rounded-xl border-navy-200 text-navy-600 hover:bg-navy-50 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                トップに戻る
              </Button>
            </Link>
          </div>
        </ThanksAnimation>
      </div>
    </main>
  );
}
