import { NextRequest, NextResponse } from "next/server";
import { trackEvent, type TrackingEventName } from "@/lib/tracking";

const VALID_EVENTS: TrackingEventName[] = [
  "view_lp",
  "start_form",
  "submit_form",
  "click_tel",
  "click_line",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, leadId, meta } = body;

    if (!name || !VALID_EVENTS.includes(name)) {
      return NextResponse.json({ error: "Invalid event name" }, { status: 400 });
    }

    await trackEvent(name, leadId, meta);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
