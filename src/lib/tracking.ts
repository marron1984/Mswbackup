// Server-side event tracking
import { prisma } from "./db";

export type TrackingEventName =
  | "view_lp"
  | "start_form"
  | "submit_form"
  | "click_tel"
  | "click_line";

export async function trackEvent(
  name: TrackingEventName,
  leadId?: string,
  meta?: Record<string, unknown>
) {
  try {
    await prisma.event.create({
      data: {
        name,
        leadId: leadId ?? null,
        meta: meta ? JSON.stringify(meta) : null,
      },
    });
    console.log(`[event] ${name}`, { leadId, meta });
  } catch (error) {
    console.error(`[event:error] Failed to track ${name}:`, error);
  }
}
