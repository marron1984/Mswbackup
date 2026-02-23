import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/admin-nav";
import { Badge } from "@/components/ui/badge";
import { LEAD_STATUSES, CONSULTANT_TYPES, SEVERITY_LEVELS } from "@/lib/constants";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status;
  const page = parseInt(params.page || "1", 10);
  const perPage = 20;

  const where = statusFilter ? { status: statusFilter } : {};

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { source: true },
    }),
    prisma.lead.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">案件一覧</h1>
          <span className="text-sm text-gray-500">{total}件</span>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            href="/admin/leads"
            className={`px-3 py-1 rounded-full text-sm ${
              !statusFilter
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            すべて
          </Link>
          {LEAD_STATUSES.map((s) => (
            <Link
              key={s.value}
              href={`/admin/leads?status=${s.value}`}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === s.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">日時</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">氏名</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">区分</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">ステータス</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">重要度</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">エリア</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">電話</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">紹介元</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const statusDef = LEAD_STATUSES.find((s) => s.value === lead.status);
                  const consultantDef = CONSULTANT_TYPES.find(
                    (t) => t.value === lead.consultantType
                  );
                  const severityDef = SEVERITY_LEVELS.find((s) => s.value === lead.severity);
                  return (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                        {format(new Date(lead.createdAt), "MM/dd HH:mm", {
                          locale: ja,
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {lead.contactName || "未設定"}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {consultantDef?.label || lead.consultantType || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {statusDef && (
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusDef.color}`}>
                            {statusDef.label}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            lead.severity === "high"
                              ? "destructive"
                              : lead.severity === "med"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {severityDef?.label || lead.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {lead.desiredArea || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {lead.contactPhone || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {lead.source?.name || lead.sourceName || "-"}
                      </td>
                    </tr>
                  );
                })}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      案件がありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/leads?page=${p}${statusFilter ? `&status=${statusFilter}` : ""}`}
                className={`px-3 py-1 rounded text-sm ${
                  p === page
                    ? "bg-gray-900 text-white"
                    : "bg-white border text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
