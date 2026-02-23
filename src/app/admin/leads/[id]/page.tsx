import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LEAD_STATUSES,
  CONSULTANT_TYPES,
  CARE_LEVELS,
  MOVE_IN_TIMINGS,
  MEDICAL_FLAGS,
  PREFERRED_CONTACTS,
  SEVERITY_LEVELS,
} from "@/lib/constants";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { LeadActions } from "./lead-actions";

export const dynamic = "force-dynamic";

function resolveLabel(
  list: readonly { value: string; label: string }[],
  value: string | null
): string {
  if (!value) return "-";
  return list.find((item) => item.value === value)?.label || value;
}

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      source: true,
      events: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  if (!lead) {
    notFound();
  }

  const sources = await prisma.source.findMany({ orderBy: { name: "asc" } });

  const medicalFlagsList: string[] = lead.medicalFlags
    ? JSON.parse(lead.medicalFlags)
    : [];

  const statusDef = LEAD_STATUSES.find((s) => s.value === lead.status);
  const severityDef = SEVERITY_LEVELS.find((s) => s.value === lead.severity);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {lead.contactName || "名前未設定"}
          </h1>
          {statusDef && (
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusDef.color}`}>
              {statusDef.label}
            </span>
          )}
          <Badge
            variant={
              lead.severity === "high"
                ? "destructive"
                : lead.severity === "med"
                ? "secondary"
                : "outline"
            }
          >
            重要度: {severityDef?.label || lead.severity}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">相談者区分</dt>
                    <dd className="font-medium">
                      {resolveLabel(CONSULTANT_TYPES, lead.consultantType)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">流入元</dt>
                    <dd className="font-medium">{lead.sourceType}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">受付日時</dt>
                    <dd className="font-medium">
                      {format(new Date(lead.createdAt), "yyyy/MM/dd HH:mm", {
                        locale: ja,
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">更新日時</dt>
                    <dd className="font-medium">
                      {format(new Date(lead.updatedAt), "yyyy/MM/dd HH:mm", {
                        locale: ja,
                      })}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>連絡先</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">氏名</dt>
                    <dd className="font-medium">{lead.contactName || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">電話番号</dt>
                    <dd className="font-medium">
                      {lead.contactPhone ? (
                        <a
                          href={`tel:${lead.contactPhone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {lead.contactPhone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">メール</dt>
                    <dd className="font-medium">
                      {lead.contactEmail ? (
                        <a
                          href={`mailto:${lead.contactEmail}`}
                          className="text-blue-600 hover:underline"
                        >
                          {lead.contactEmail}
                        </a>
                      ) : (
                        "-"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">希望連絡方法</dt>
                    <dd className="font-medium">
                      {resolveLabel(PREFERRED_CONTACTS, lead.preferredContact)}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>介護・医療情報</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">要介護度</dt>
                    <dd className="font-medium">
                      {resolveLabel(CARE_LEVELS, lead.careLevel)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">医療処置</dt>
                    <dd className="font-medium">
                      {medicalFlagsList.length > 0
                        ? medicalFlagsList
                            .map((f) =>
                              MEDICAL_FLAGS.find((mf) => mf.value === f)?.label || f
                            )
                            .join("、")
                        : "なし"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>希望条件</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">希望エリア</dt>
                    <dd className="font-medium">{lead.desiredArea || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">入居時期</dt>
                    <dd className="font-medium">
                      {resolveLabel(MOVE_IN_TIMINGS, lead.moveInTiming)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">予算上限</dt>
                    <dd className="font-medium">
                      {lead.budgetMax ? `${lead.budgetMax}万円/月` : "-"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {lead.memo && (
              <Card>
                <CardHeader>
                  <CardTitle>相談者メモ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{lead.memo}</p>
                </CardContent>
              </Card>
            )}

            {/* Events */}
            <Card>
              <CardHeader>
                <CardTitle>イベント履歴</CardTitle>
              </CardHeader>
              <CardContent>
                {lead.events.length === 0 ? (
                  <p className="text-sm text-gray-500">イベントなし</p>
                ) : (
                  <div className="space-y-2">
                    {lead.events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 text-sm py-2 border-b last:border-0"
                      >
                        <span className="text-gray-400 whitespace-nowrap">
                          {format(new Date(event.createdAt), "MM/dd HH:mm", {
                            locale: ja,
                          })}
                        </span>
                        <Badge variant="outline">{event.name}</Badge>
                        {event.meta && (
                          <span className="text-gray-500 text-xs truncate">
                            {event.meta}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar actions */}
          <div>
            <LeadActions
              leadId={lead.id}
              currentStatus={lead.status}
              currentSeverity={lead.severity}
              currentMemo={lead.memo || ""}
              currentSourceId={lead.sourceId || ""}
              sources={sources.map((s) => ({ id: s.id, name: s.name }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
