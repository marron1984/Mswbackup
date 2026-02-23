import { prisma } from "./db";

interface NotifyPayload {
  leadId: string;
  contactName: string;
  contactPhone: string;
  consultantType: string;
  desiredArea: string;
  moveInTiming: string;
  careLevel: string;
}

export async function notifyNewLead(payload: NotifyPayload) {
  const type = process.env.NOTIFICATION_TYPE || "slack";

  try {
    if (type === "slack") {
      await sendSlackNotification(payload);
    } else if (type === "email") {
      await sendEmailNotification(payload);
    }

    await prisma.notificationLog.create({
      data: {
        type,
        leadId: payload.leadId,
        success: true,
        meta: JSON.stringify(payload),
      },
    });
  } catch (error) {
    console.error("[notification:error]", error);
    await prisma.notificationLog.create({
      data: {
        type,
        leadId: payload.leadId,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        meta: JSON.stringify(payload),
      },
    });
  }
}

async function sendSlackNotification(payload: NotifyPayload) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[notification] SLACK_WEBHOOK_URL not configured, skipping");
    return;
  }

  const text = [
    "📋 *新規相談が届きました*",
    `・相談者: ${payload.contactName}`,
    `・電話: ${payload.contactPhone}`,
    `・区分: ${payload.consultantType}`,
    `・希望エリア: ${payload.desiredArea}`,
    `・入居時期: ${payload.moveInTiming}`,
    `・介護度: ${payload.careLevel}`,
    `<${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads/${payload.leadId}|管理画面で確認>`,
  ].join("\n");

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Slack webhook failed: ${res.status}`);
  }
}

async function sendEmailNotification(payload: NotifyPayload) {
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const to = process.env.NOTIFICATION_EMAIL_TO;
  if (!to) {
    console.warn("[notification] NOTIFICATION_EMAIL_TO not configured, skipping");
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `【新規相談】${payload.contactName}様`,
    text: [
      "新規相談が届きました",
      "",
      `相談者: ${payload.contactName}`,
      `電話: ${payload.contactPhone}`,
      `区分: ${payload.consultantType}`,
      `希望エリア: ${payload.desiredArea}`,
      `入居時期: ${payload.moveInTiming}`,
      `介護度: ${payload.careLevel}`,
      "",
      `管理画面: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads/${payload.leadId}`,
    ].join("\n"),
  });
}
