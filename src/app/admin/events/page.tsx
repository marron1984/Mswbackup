import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/admin-nav";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; name?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const nameFilter = params.name;
  const perPage = 50;

  const where = nameFilter ? { name: nameFilter } : {};

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { lead: { select: { id: true, contactName: true } } },
    }),
    prisma.event.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  // Aggregate counts
  const eventCounts = await prisma.event.groupBy({
    by: ["name"],
    _count: true,
    orderBy: { _count: { name: "desc" } },
  });

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <AdminNav />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-navy-950 mb-6">イベント一覧</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {eventCounts.map((ec) => (
            <Link
              key={ec.name}
              href={`/admin/events?name=${ec.name}`}
              className={`bg-white rounded-2xl border border-navy-100/50 p-4 text-center hover:border-navy-200 hover:shadow-sm transition-all duration-200 ${
                nameFilter === ec.name ? "border-navy-600 shadow-sm" : ""
              }`}
            >
              <div className="text-2xl font-bold text-navy-950">{ec._count}</div>
              <div className="text-xs text-navy-400 mt-1">{ec.name}</div>
            </Link>
          ))}
        </div>

        {nameFilter && (
          <div className="mb-4">
            <Link href="/admin/events" className="text-sm text-navy-600 hover:underline underline-offset-2">
              フィルターを解除
            </Link>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-navy-100/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/50 bg-navy-50/30">
                  <th className="text-left py-3 px-4 font-medium text-navy-400">日時</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-400">イベント</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-400">案件</th>
                  <th className="text-left py-3 px-4 font-medium text-navy-400">メタ</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-navy-50 hover:bg-navy-50/50 transition-colors">
                    <td className="py-3 px-4 text-navy-400 whitespace-nowrap">
                      {format(new Date(event.createdAt), "MM/dd HH:mm:ss", {
                        locale: ja,
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{event.name}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {event.lead ? (
                        <Link
                          href={`/admin/leads/${event.lead.id}`}
                          className="text-navy-600 hover:underline underline-offset-2"
                        >
                          {event.lead.contactName || event.lead.id.substring(0, 8)}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4 text-navy-400 text-xs max-w-xs truncate">
                      {event.meta || "-"}
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-navy-400">
                      イベントがありません
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
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(
              (p) => (
                <Link
                  key={p}
                  href={`/admin/events?page=${p}${nameFilter ? `&name=${nameFilter}` : ""}`}
                  className={`px-3 py-1 rounded text-sm ${
                    p === page
                      ? "gradient-cta text-white shadow-sm"
                      : "bg-white border border-navy-100 text-navy-500 hover:border-navy-200"
                  }`}
                >
                  {p}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
