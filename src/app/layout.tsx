import type { Metadata } from "next";
import "./globals.css";
import { TrackingScripts } from "@/components/tracking-scripts";

export const metadata: Metadata = {
  title: "老人ホーム・介護施設の無料相談 | 退院先を最短で探す",
  description:
    "退院先・入居先を最短で探します。当日ヒアリング、最短24時間で候補をご提示。相談無料、即レス対応。病院MSW・退院支援の方もお気軽にご相談ください。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased font-sans">
        {children}
        <TrackingScripts />
      </body>
    </html>
  );
}
