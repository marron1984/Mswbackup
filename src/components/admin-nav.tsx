"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Building, BarChart3, LogOut, Heart } from "lucide-react";

const navItems = [
  { href: "/admin/leads", label: "案件一覧", icon: Users },
  { href: "/admin/sources", label: "紹介元", icon: Building },
  { href: "/admin/events", label: "イベント", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-navy-100/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin/leads" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-cta flex items-center justify-center">
                <Heart className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-navy-900 tracking-tight">管理画面</span>
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-navy-100/80 text-navy-900 shadow-sm"
                        : "text-navy-500 hover:text-navy-800 hover:bg-navy-50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-navy-400 hover:text-navy-600 rounded-lg hover:bg-navy-50 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
