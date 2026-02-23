import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/admin-nav";
import { Badge } from "@/components/ui/badge";
import { SOURCE_TYPES } from "@/lib/constants";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { SourceForm } from "./source-form";

export const dynamic = "force-dynamic";

export default async function AdminSourcesPage() {
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { leads: true } } },
  });

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <AdminNav />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-navy-950">紹介元一覧</h1>
          <span className="text-sm text-navy-400">{sources.length}件</span>
        </div>

        {/* Add source form */}
        <SourceForm />

        {/* Table */}
        <div className="bg-white rounded-2xl border border-navy-100/50 shadow-sm overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/50 bg-navy-50/30">
                  <th className="text-left py-3 px-4 font-medium text-navy-400">名前</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-400">種別</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-400">部署</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-400">担当者</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-400">電話</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-400">案件数</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-400">登録日</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => {
                  const typeDef = SOURCE_TYPES.find((t) => t.value === source.type);
                  return (
                    <tr key={source.id} className="border-b border-navy-50 hover:bg-navy-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{source.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{typeDef?.label || source.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-navy-500">{source.department || "-"}</td>
                      <td className="py-3 px-4 text-navy-500">{source.personName || "-"}</td>
                      <td className="py-3 px-4 text-navy-500">{source.phone || "-"}</td>
                      <td className="py-3 px-4 text-navy-500">{source._count.leads}</td>
                      <td className="py-3 px-4 text-navy-400">
                        {format(new Date(source.createdAt), "yyyy/MM/dd", { locale: ja })}
                      </td>
                    </tr>
                  );
                })}
                {sources.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-navy-400">
                      紹介元が登録されていません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
