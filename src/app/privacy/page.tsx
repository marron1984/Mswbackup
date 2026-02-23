import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fafbff]">
      <header className="glass sticky top-0 z-40 border-b border-white/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-navy-400 hover:text-navy-600 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="font-bold text-navy-900">プライバシーポリシー</div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 prose prose-navy">
        <h1 className="text-2xl font-bold mb-6">プライバシーポリシー</h1>

        <p className="text-navy-600 mb-6">
          当サービス（以下「当社」）は、お客様の個人情報の保護を重要な責務と認識し、以下の方針に基づき個人情報の適切な取り扱いに努めます。
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">1. 個人情報の収集</h2>
        <p className="text-navy-600 mb-4">
          当社は、サービスの提供に必要な範囲で、以下の個人情報を収集することがあります。
        </p>
        <ul className="list-disc pl-6 text-navy-600 space-y-1 mb-4">
          <li>氏名</li>
          <li>電話番号</li>
          <li>メールアドレス</li>
          <li>ご相談内容（介護度、医療的ケアの有無、希望エリア等）</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">2. 個人情報の利用目的</h2>
        <p className="text-navy-600 mb-4">収集した個人情報は、以下の目的で利用します。</p>
        <ul className="list-disc pl-6 text-navy-600 space-y-1 mb-4">
          <li>老人ホーム・介護施設のご紹介、見学手配等のサービス提供</li>
          <li>お問い合わせへの回答、ご連絡</li>
          <li>サービスの改善・開発</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">3. 個人情報の第三者提供</h2>
        <p className="text-navy-600 mb-4">
          当社は、以下の場合を除き、お客様の同意なく個人情報を第三者に提供しません。
        </p>
        <ul className="list-disc pl-6 text-navy-600 space-y-1 mb-4">
          <li>ご紹介先の介護施設への情報提供（お客様の同意を得た場合）</li>
          <li>法令に基づく場合</li>
          <li>人の生命、身体または財産の保護のために必要な場合</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">4. 個人情報の管理</h2>
        <p className="text-navy-600 mb-4">
          当社は、個人情報の正確性を保ち、不正アクセス、紛失、改ざん等を防止するため、適切な安全管理措置を講じます。
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">5. 個人情報の開示・訂正・削除</h2>
        <p className="text-navy-600 mb-4">
          お客様ご自身の個人情報について、開示・訂正・削除等のご請求があった場合は、ご本人確認の上、適切に対応いたします。
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">6. お問い合わせ</h2>
        <p className="text-navy-600 mb-4">
          個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。
        </p>
        <p className="text-navy-600 mb-4">
          電話: {process.env.NEXT_PUBLIC_PHONE_NUMBER || "0120-000-000"}
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">7. ポリシーの変更</h2>
        <p className="text-navy-600 mb-4">
          当社は、必要に応じて本ポリシーを変更することがあります。変更後のポリシーは、当ページに掲載した時点から効力を生じるものとします。
        </p>

        <p className="text-navy-400 text-sm mt-8">制定日: 2025年1月1日</p>
      </div>
    </main>
  );
}
