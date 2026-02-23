import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const createSourceSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  department: z.string().optional(),
  personName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSourceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const data = parsed.data;

    const source = await prisma.source.create({
      data: {
        type: data.type,
        name: data.name,
        department: data.department || null,
        personName: data.personName || null,
        phone: data.phone || null,
        email: data.email || null,
      },
    });

    return NextResponse.json({ ok: true, source });
  } catch (error) {
    console.error("[api/admin/sources:error]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
