import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { consultFormSchema } from "@/lib/validations";
import { generateDedupeKey, findDuplicate } from "@/lib/dedup";
import { trackEvent } from "@/lib/tracking";
import { notifyNewLead } from "@/lib/notification";
import {
  CONSULTANT_TYPES,
  CARE_LEVELS,
  MOVE_IN_TIMINGS,
} from "@/lib/constants";

function computeSeverity(medicalFlags: string[]): string {
  const highFlags = ["dialysis", "oxygen", "gastrostomy", "suction"];
  const hasHigh = medicalFlags.some((f) => highFlags.includes(f));
  if (hasHigh) return "high";
  if (medicalFlags.length >= 2) return "med";
  return "low";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = consultFormSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString();
        if (key) fieldErrors[key] = issue.message;
      }
      return NextResponse.json({ errors: fieldErrors }, { status: 400 });
    }

    const data = parsed.data;

    // 重複検知
    const dedupeKey = generateDedupeKey(data.contactPhone, data.contactEmail);
    const duplicate = await findDuplicate(dedupeKey);

    if (duplicate) {
      console.log(`[dedup] Duplicate found for lead ${duplicate.id}`);
      // 重複でも受け付けるが、ログに残す
    }

    // 医療依存度の算出
    const severity = computeSeverity(data.medicalFlags);

    // 相談者区分の判定 → sourceType
    let sourceType = "web";
    if (data.consultantType === "hospital") sourceType = "hospital";
    else if (data.consultantType === "caremanager") sourceType = "caremanager";

    const lead = await prisma.lead.create({
      data: {
        sourceType,
        status: "new",
        severity,
        consultantType: data.consultantType,
        desiredArea: data.desiredArea,
        moveInTiming: data.moveInTiming,
        budgetMax: data.budgetMax ?? null,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail || null,
        preferredContact: data.preferredContact,
        careLevel: data.careLevel,
        medicalFlags: JSON.stringify(data.medicalFlags),
        memo: data.memo || null,
        dedupeKey,
      },
    });

    // イベント記録
    await trackEvent("submit_form", lead.id, {
      consultantType: data.consultantType,
      severity,
      duplicate: !!duplicate,
    });

    // ラベル解決
    const consultantLabel =
      CONSULTANT_TYPES.find((t) => t.value === data.consultantType)?.label || data.consultantType;
    const careLevelLabel =
      CARE_LEVELS.find((l) => l.value === data.careLevel)?.label || data.careLevel;
    const moveInLabel =
      MOVE_IN_TIMINGS.find((t) => t.value === data.moveInTiming)?.label || data.moveInTiming;

    // 通知
    notifyNewLead({
      leadId: lead.id,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      consultantType: consultantLabel,
      desiredArea: data.desiredArea,
      moveInTiming: moveInLabel,
      careLevel: careLevelLabel,
    }).catch((err) => {
      console.error("[notification:error]", err);
    });

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (error) {
    console.error("[api/consult:error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
