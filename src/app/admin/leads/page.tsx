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
    <div className="min-h-screen bg-[#fafbff]">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">案件一覧</h1>
          <span className="text-sm text-navy-400 bg-navy-50 px-3 py-1 rounded-full">{total}件</span>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Link
            href="/admin/leads"
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              !statusFilter
                ? "gradient-cta text-white shadow-sm"
                : "bg-white text-navy-500 border border-navy-100 hover:border-navy-200 hover:text-navy-700"
            }`}
          >
            すべて
          </Link>
          {LEAD_STATUSES.map((s) => (
            <Link
              key={s.value}
              href={`/admin/leads?status=${s.value}`}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === s.value
                  ? "gradient-cta text-white shadow-sm"
                  : "bg-white text-navy-500 border border-navy-100 hover:border-navy-200 hover:text-navy-700"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-navy-100/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/50 bg-navy-50/30">
                  <th className="text-left py-3.5 px-4 font-semibold text-navy-500 text-xs uppercase tracking-wider">日時</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-navy-500 text-xs uppercase tracking-wider">氏名</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-navy-500 text-xs uppercase tracking-wider">区分</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-navy-500 text-xs uppercase tracking-wider">ステータス</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-navy-500 text-xs uppercase tracking-wider">重要度</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-navy-500 text-xs uppercase tracking-wider">エリア</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-navy-500 text-xs uppercase tracking-wider">電話</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-navy-500 text-xs uppercase tracking-wider">紹介元</th>
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
                    <tr key={lead.id} className="border-b border-navy-50 hover:bg-navy-50/50 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap text-navy-400">
                        {format(new Date(lead.createdAt), "MM/dd HH:mm", {
                          locale: ja,
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-navy-700 hover:text-navy-900 font-semibold hover:underline underline-offset-2 decoration-navy-300"
                        >
                          {lead.contactName || "未設定"}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-navy-500">
                        {consultantDef?.label || lead.consultantType || "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        {statusDef && (
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${statusDef.color}`}>
                            {statusDef.label}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            lead.severity === "high"
                              ? "destructive"
                              : lead.severity === "med"
                              ? "secondary"
                              : "outline"
                          }
                          className="rounded-lg"
                        >
                          {severityDef?.label || lead.severity}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-navy-500">
                        {lead.desiredArea || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-navy-500">
                        {lead.contactPhone || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-navy-500">
                        {lead.source?.name || lead.sourceName || "-"}
                      </td>
                    </tr>
                  );
                })}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-navy-400">
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
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/leads?page=${p}${statusFilter ? `&status=${statusFilter}` : ""}`}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  p === page
                    ? "gradient-cta text-white shadow-sm"
                    : "bg-white border border-navy-100 text-navy-500 hover:border-navy-200"
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
