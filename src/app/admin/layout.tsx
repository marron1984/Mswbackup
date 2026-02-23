import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理画面 | 介護施設紹介",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
