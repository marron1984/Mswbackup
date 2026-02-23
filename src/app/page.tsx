import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Clock,
  Shield,
  MapPin,
  ChevronRight,
  Heart,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FixedCTA } from "@/components/fixed-cta";
import { TrackPageView } from "@/components/tracking-client";
import { FadeUp, FadeIn, ScaleOnHover, SlideIn } from "@/components/motion";
import { StaggerGrid, HeroAnimation, FlowTimeline, StatsCounter } from "@/components/lp-sections";

export default function LPPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "0120-000-000";
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "#";

  return (
    <main className="min-h-screen bg-[#fafbff] overflow-hidden">
      <TrackPageView name="view_lp" />

      {/* ── Header (glass) ── */}
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-cta flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-navy-950">
              ケアナビ
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${phone.replace(/-/g, "")}`}
              className="flex items-center gap-2 text-navy-700 font-semibold hover:text-navy-900 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                <Phone className="h-4 w-4 text-teal-600" />
              </div>
              {phone}
            </a>
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#06C755] text-white rounded-full px-4 py-2 text-sm font-bold hover:bg-[#05b34d] transition-colors shadow-md shadow-[#06C755]/20"
            >
              <MessageCircle className="h-4 w-4" />
              LINE相談
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative gradient-hero grain py-16 md:py-28">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-navy-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6">
          <HeroAnimation>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur rounded-full px-4 py-1.5 text-sm font-semibold text-navy-700 shadow-sm mb-6 border border-navy-100/50">
                <Sparkles className="h-4 w-4 text-amber-500" />
                相談無料・即レス対応
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-navy-950 mb-6 leading-[1.1]">
                退院先・入居先を
                <br />
                <span className="gradient-text">最短</span>で探す
              </h1>

              <p className="text-lg md:text-xl text-navy-700/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                当日ヒアリング、最短24時間で候補をご提示。
                <br className="hidden sm:block" />
                病院MSW・退院支援の方もお気軽にご相談ください。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link href="/consult">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto gradient-cta text-white text-lg px-10 py-5 h-auto rounded-full shadow-xl shadow-navy-600/20 hover:shadow-2xl hover:shadow-navy-600/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    無料で相談する
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </Link>
                <a href={`tel:${phone.replace(/-/g, "")}`}>
                  <Button
                    size="xl"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/80 backdrop-blur border-navy-200 text-navy-700 hover:bg-white text-lg px-10 py-5 h-auto rounded-full shadow-lg shadow-navy-100/50 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Phone className="h-5 w-5 mr-1" />
                    電話で相談する
                  </Button>
                </a>
              </div>

              <p className="text-sm text-navy-500">
                受付時間 9:00〜18:00（土日祝も対応可）
              </p>
            </div>
          </HeroAnimation>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 md:py-16 bg-white border-y border-navy-100/50">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <StatsCounter />
        </div>
      </section>

      {/* ── Concerns ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-teal-600 tracking-wide uppercase mb-2">
                Worries
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-navy-950">
                こんなお悩みありませんか？
              </h2>
            </div>
          </FadeUp>

          <StaggerGrid
            items={[
              { icon: "clock", text: "退院が迫っているが、入居先が見つからない" },
              { icon: "alert", text: "要介護度が高く、受け入れ先が限られている" },
              { icon: "medical", text: "医療的ケアが必要で、対応施設がわからない" },
              { icon: "wallet", text: "費用が心配で、予算内の施設を探したい" },
              { icon: "users", text: "家族だけで施設を比較するのが大変" },
              { icon: "help", text: "ケアマネや病院から紹介されたが選び方がわからない" },
            ]}
          />
        </div>
      </section>

      {/* ── 3 Reasons ── */}
      <section className="py-16 md:py-24 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(66,99,235,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(18,184,134,0.1),transparent_50%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6">
          <FadeUp>
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-teal-400 tracking-wide uppercase mb-2">
                Why Choose Us
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                選ばれる3つの理由
              </h2>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "最短24時間で候補提示",
                desc: "ご相談当日にヒアリング。最短で翌日には候補施設をご提案します。",
                gradient: "from-navy-600 to-navy-800",
              },
              {
                icon: Shield,
                title: "医療ケア対応もお任せ",
                desc: "胃ろう、吸引、透析など医療依存度の高い方の施設探しも豊富な実績。",
                gradient: "from-teal-600 to-teal-800",
              },
              {
                icon: MapPin,
                title: "ご希望エリアを網羅",
                desc: "地域密着のネットワークで、ご希望エリアの施設を幅広くカバーします。",
                gradient: "from-navy-500 to-teal-700",
              },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <ScaleOnHover>
                  <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 h-full">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} mb-5 shadow-lg`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </ScaleOnHover>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flow ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <FadeUp>
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-teal-600 tracking-wide uppercase mb-2">
                How it Works
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-navy-950">
                ご利用の流れ
              </h2>
            </div>
          </FadeUp>

          <FlowTimeline />
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-navy-50/50 to-transparent">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-teal-600 tracking-wide uppercase mb-2">
                Voice
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-navy-950">
                ご利用者の声
              </h2>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: "K.S 様（ご家族）",
                text: "父の退院が迫り焦っていましたが、相談した翌日に3件の候補を提示していただけました。おかげで安心して退院できました。",
              },
              {
                name: "病院MSW T.N 様",
                text: "医療的ケアが必要な患者さんの受入先探しでいつも助かっています。対応が早く、施設の情報も正確なので信頼しています。",
              },
            ].map((v, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <ScaleOnHover>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-navy-100/50 h-full">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-navy-700 leading-relaxed mb-4 text-sm">
                      &ldquo;{v.text}&rdquo;
                    </p>
                    <p className="text-navy-500 text-sm font-medium">{v.name}</p>
                  </div>
                </ScaleOnHover>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-16 md:py-24 gradient-cta overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1),transparent_70%)]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              まずはお気軽にご相談ください
            </h2>
            <p className="mb-10 text-white/70 max-w-lg mx-auto">
              相談は完全無料です。お電話・LINE・フォームからお問い合わせいただけます。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/consult">
                <Button
                  size="xl"
                  className="w-full sm:w-auto bg-white text-navy-800 hover:bg-navy-50 text-lg px-10 py-5 h-auto rounded-full font-bold shadow-xl shadow-navy-900/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  フォームで相談する
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <a href={`tel:${phone.replace(/-/g, "")}`}>
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 text-lg px-10 py-5 h-auto rounded-full transition-all duration-300"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {phone}
                </Button>
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 bg-navy-950 text-white/50">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-cta flex items-center justify-center">
                <Heart className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-white/80">ケアナビ</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                プライバシーポリシー
              </Link>
            </div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} ケアナビ
            </p>
          </div>
        </div>
      </footer>

      {/* Fixed mobile CTA */}
      <FixedCTA />
      <div className="h-16 md:hidden" />
    </main>
  );
}
