import Link from "next/link";
import { Phone, MessageCircle, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ThanksPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "0120-000-000";
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "#";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="font-bold text-lg text-gray-900">
            介護施設の<span className="text-green-600">無料</span>相談
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          ご相談を受け付けました
        </h1>
        <p className="text-gray-600 mb-8">
          内容を確認の上、担当者より速やかにご連絡いたします。
        </p>

        <div className="space-y-4 max-w-md mx-auto">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-4">
                より早くご案内をご希望の方へ
              </h2>
              <div className="space-y-3">
                <a
                  href={`tel:${phone.replace(/-/g, "")}`}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-green-700">今すぐ電話する</div>
                    <div className="text-sm text-gray-600">{phone}</div>
                  </div>
                </a>

                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-[#06C755]/10 rounded-lg hover:bg-[#06C755]/20 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-[#06C755] rounded-full">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-green-700">LINEで友だち追加</div>
                    <div className="text-sm text-gray-600">
                      チャットでやり取りできます
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-blue-700">面談予約</div>
                    <div className="text-sm text-gray-600">
                      折り返しのご連絡時に日程調整いたします
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Link href="/" className="inline-block mt-8">
          <Button variant="outline">トップに戻る</Button>
        </Link>
      </div>
    </main>
  );
}
