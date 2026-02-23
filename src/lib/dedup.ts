import { createHash } from "crypto";
import { prisma } from "./db";

export function generateDedupeKey(phone?: string, email?: string): string | null {
  const raw = phone?.replace(/[-\s]/g, "") || email;
  if (!raw) return null;
  return createHash("sha256").update(raw).digest("hex").substring(0, 16);
}

export async function findDuplicate(dedupeKey: string | null) {
  if (!dedupeKey) return null;

  const existing = await prisma.lead.findFirst({
    where: { dedupeKey },
    orderBy: { createdAt: "desc" },
  });

  return existing;
}
