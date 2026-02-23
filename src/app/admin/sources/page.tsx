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
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">紹介元一覧</h1>
          <span className="text-sm text-gray-500">{sources.length}件</span>
        </div>

        {/* Add source form */}
        <SourceForm />

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">名前</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">種別</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">部署</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">担当者</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">電話</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">案件数</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">登録日</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => {
                  const typeDef = SOURCE_TYPES.find((t) => t.value === source.type);
                  return (
                    <tr key={source.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{source.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{typeDef?.label || source.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{source.department || "-"}</td>
                      <td className="py-3 px-4 text-gray-600">{source.personName || "-"}</td>
                      <td className="py-3 px-4 text-gray-600">{source.phone || "-"}</td>
                      <td className="py-3 px-4 text-gray-600">{source._count.leads}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {format(new Date(source.createdAt), "yyyy/MM/dd", { locale: ja })}
                      </td>
                    </tr>
                  );
                })}
                {sources.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
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
