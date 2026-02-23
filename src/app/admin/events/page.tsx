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
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">イベント一覧</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {eventCounts.map((ec) => (
            <Link
              key={ec.name}
              href={`/admin/events?name=${ec.name}`}
              className={`bg-white rounded-lg border p-4 text-center hover:border-gray-300 transition-colors ${
                nameFilter === ec.name ? "border-gray-900" : ""
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">{ec._count}</div>
              <div className="text-xs text-gray-500 mt-1">{ec.name}</div>
            </Link>
          ))}
        </div>

        {nameFilter && (
          <div className="mb-4">
            <Link href="/admin/events" className="text-sm text-blue-600 hover:underline">
              フィルターを解除
            </Link>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">日時</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">イベント</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">案件</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">メタ</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
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
                          className="text-blue-600 hover:underline"
                        >
                          {event.lead.contactName || event.lead.id.substring(0, 8)}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs max-w-xs truncate">
                      {event.meta || "-"}
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
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
                      ? "bg-gray-900 text-white"
                      : "bg-white border text-gray-600 hover:bg-gray-50"
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
