import Link from "next/link";
import { Phone, MessageCircle, Clock, Shield, MapPin, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FixedCTA } from "@/components/fixed-cta";
import { TrackPageView } from "@/components/tracking-client";

export default function LPPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "0120-000-000";
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "#";

  return (
    <main className="min-h-screen bg-white">
      <TrackPageView name="view_lp" />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-lg text-gray-900">
            介護施設の<span className="text-green-600">無料</span>相談
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${phone.replace(/-/g, "")}`}
              className="flex items-center gap-1 text-green-600 font-bold"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-[#06C755] text-white rounded px-3 py-1.5 text-sm font-bold"
            >
              <MessageCircle className="h-4 w-4" />
              LINE相談
            </a>
          </div>
        </div>
      </header>

      {/* Hero / First View */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-green-100 text-green-800 rounded-full px-4 py-1 text-sm font-semibold mb-4">
            相談無料・即レス対応
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            退院先・入居先を<br className="md:hidden" />
            <span className="text-green-600">最短</span>で探す
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            当日ヒアリング、最短24時間で候補をご提示。<br />
            病院MSW・退院支援の方もお気軽にご相談ください。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link href="/consult">
              <Button size="xl" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 h-auto">
                無料で相談する
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
            <a href={`tel:${phone.replace(/-/g, "")}`}>
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 py-4 h-auto"
              >
                <Phone className="h-5 w-5 mr-1" />
                電話で相談する
              </Button>
            </a>
          </div>

          <p className="text-sm text-gray-500">
            受付時間: 9:00〜18:00（土日祝も対応可）
          </p>
        </div>
      </section>

      {/* こんな方におすすめ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
            こんなお悩みありませんか？
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "退院が迫っているが、入居先が見つからない",
              "要介護度が高く、受け入れ先が限られている",
              "医療的ケアが必要で、対応施設がわからない",
              "費用が心配で、予算内の施設を探したい",
              "家族だけで施設を比較するのが大変",
              "ケアマネや病院から紹介されたが選び方がわからない",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg bg-gray-50"
              >
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 強み */}
      <section className="py-12 md:py-16 bg-green-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">
            選ばれる3つの理由
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                <Clock className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">最短24時間で候補提示</h3>
              <p className="text-gray-600 text-sm">
                ご相談当日にヒアリング。最短で翌日には候補施設をご提案します。
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                <Shield className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">医療ケア対応もお任せ</h3>
              <p className="text-gray-600 text-sm">
                胃ろう、吸引、透析など医療依存度の高い方の施設探しも豊富な実績。
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                <MapPin className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">ご希望エリアを網羅</h3>
              <p className="text-gray-600 text-sm">
                地域密着のネットワークで、ご希望エリアの施設を幅広くカバーします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ご利用の流れ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">
            ご利用の流れ
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "お問い合わせ", desc: "電話・LINE・フォームからご相談" },
              { step: "2", title: "ヒアリング", desc: "ご要望・ご状況を詳しく伺います" },
              { step: "3", title: "施設ご提案", desc: "条件に合う施設を複数ご紹介" },
              { step: "4", title: "見学・入居", desc: "見学手配から入居までサポート" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full font-bold text-lg mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            まずはお気軽にご相談ください
          </h2>
          <p className="mb-8 text-green-100">
            相談は無料です。お電話・LINE・フォームからお問い合わせいただけます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/consult">
              <Button size="xl" className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-4 h-auto font-bold">
                フォームで相談する
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
            <a href={`tel:${phone.replace(/-/g, "")}`}>
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-green-700 text-lg px-8 py-4 h-auto"
              >
                <Phone className="h-5 w-5 mr-1" />
                {phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <div className="mb-4 space-x-4">
            <Link href="/privacy" className="hover:text-white">
              プライバシーポリシー
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} 介護施設紹介サービス</p>
        </div>
      </footer>

      {/* Fixed mobile CTA */}
      <FixedCTA />

      {/* Bottom padding for mobile fixed CTA */}
      <div className="h-16 md:hidden" />
    </main>
  );
}
