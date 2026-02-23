import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { leadUpdateSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = leadUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const data = parsed.data;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.severity !== undefined && { severity: data.severity }),
        ...(data.memo !== undefined && { memo: data.memo }),
        ...(data.sourceId !== undefined && { sourceId: data.sourceId }),
      },
    });

    return NextResponse.json({ ok: true, lead });
  } catch (error) {
    console.error("[api/admin/leads/update:error]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
