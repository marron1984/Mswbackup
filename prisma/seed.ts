import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

function dedupeKey(phone: string): string {
  return createHash("sha256")
    .update(phone.replace(/[-\s]/g, ""))
    .digest("hex")
    .substring(0, 16);
}

async function main() {
  console.log("Seeding database...");

  // Create sources
  const hospital1 = await prisma.source.create({
    data: {
      type: "hospital",
      name: "〇〇総合病院",
      department: "地域連携室",
      personName: "田中 花子",
      phone: "03-1234-5678",
      email: "tanaka@hospital.example.com",
    },
  });

  const hospital2 = await prisma.source.create({
    data: {
      type: "hospital",
      name: "△△医療センター",
      department: "退院支援課",
      personName: "佐藤 太郎",
      phone: "03-9876-5432",
    },
  });

  const caremanager1 = await prisma.source.create({
    data: {
      type: "caremanager",
      name: "居宅介護支援事業所 さくら",
      personName: "鈴木 一郎",
      phone: "045-111-2222",
      email: "suzuki@sakura-care.example.com",
    },
  });

  await prisma.source.create({
    data: {
      type: "community",
      name: "港北区地域包括支援センター",
      personName: "山田 美和",
      phone: "045-333-4444",
    },
  });

  // Create leads
  const leads = [
    {
      sourceType: "hospital",
      sourceName: "〇〇総合病院",
      status: "new",
      severity: "high",
      consultantType: "hospital",
      desiredArea: "横浜市港北区",
      moveInTiming: "urgent",
      budgetMax: 20,
      contactName: "山田 太郎",
      contactPhone: "090-1111-2222",
      contactEmail: "yamada@example.com",
      preferredContact: "phone",
      careLevel: "care4",
      medicalFlags: JSON.stringify(["gastrostomy", "suction"]),
      memo: "退院日が迫っている。MSWからの紹介。",
      sourceId: hospital1.id,
    },
    {
      sourceType: "web",
      status: "contacted",
      severity: "med",
      consultantType: "family",
      desiredArea: "川崎市中原区",
      moveInTiming: "1month",
      budgetMax: 15,
      contactName: "佐藤 花子",
      contactPhone: "080-3333-4444",
      preferredContact: "line",
      careLevel: "care3",
      medicalFlags: JSON.stringify(["dementia"]),
      memo: null,
    },
    {
      sourceType: "hospital",
      sourceName: "△△医療センター",
      status: "qualified",
      severity: "high",
      consultantType: "hospital",
      desiredArea: "東京都世田谷区",
      moveInTiming: "2weeks",
      budgetMax: 30,
      contactName: "鈴木 健一",
      contactPhone: "070-5555-6666",
      contactEmail: "suzuki.k@example.com",
      preferredContact: "email",
      careLevel: "care5",
      medicalFlags: JSON.stringify(["gastrostomy", "oxygen", "bedsore"]),
      memo: "透析は終了。酸素は24時間。",
      sourceId: hospital2.id,
    },
    {
      sourceType: "caremanager",
      sourceName: "居宅介護支援事業所 さくら",
      status: "tour_scheduled",
      severity: "low",
      consultantType: "caremanager",
      desiredArea: "横浜市青葉区",
      moveInTiming: "3months",
      budgetMax: 18,
      contactName: "高橋 美紀",
      contactPhone: "090-7777-8888",
      preferredContact: "phone",
      careLevel: "care2",
      medicalFlags: JSON.stringify([]),
      memo: "ご本人が自立志向。サ高住希望。",
      sourceId: caremanager1.id,
    },
    {
      sourceType: "web",
      status: "new",
      severity: "med",
      consultantType: "self",
      desiredArea: "横浜市中区",
      moveInTiming: "undecided",
      budgetMax: null,
      contactName: "渡辺 次郎",
      contactPhone: "080-9999-0000",
      preferredContact: "phone",
      careLevel: "support2",
      medicalFlags: JSON.stringify(["insulin"]),
      memo: "情報収集段階。",
    },
    {
      sourceType: "web",
      status: "contracted",
      severity: "med",
      consultantType: "family",
      desiredArea: "東京都品川区",
      moveInTiming: "1month",
      budgetMax: 25,
      contactName: "伊藤 美咲",
      contactPhone: "090-1234-0000",
      contactEmail: "ito@example.com",
      preferredContact: "email",
      careLevel: "care3",
      medicalFlags: JSON.stringify(["dementia", "catheter"]),
      memo: "グループホームに入居決定。",
    },
    {
      sourceType: "web",
      status: "lost",
      severity: "low",
      consultantType: "family",
      desiredArea: "千葉県船橋市",
      moveInTiming: "3months",
      budgetMax: 12,
      contactName: "中村 一美",
      contactPhone: "080-5678-1234",
      preferredContact: "phone",
      careLevel: "care1",
      medicalFlags: JSON.stringify([]),
      memo: "他社で決定。",
    },
  ];

  for (const leadData of leads) {
    const lead = await prisma.lead.create({
      data: {
        ...leadData,
        dedupeKey: dedupeKey(leadData.contactPhone),
      },
    });

    // Create events for each lead
    await prisma.event.create({
      data: {
        name: "submit_form",
        leadId: lead.id,
        meta: JSON.stringify({ consultantType: leadData.consultantType }),
      },
    });
  }

  // Create standalone events
  const eventNames = ["view_lp", "view_lp", "view_lp", "start_form", "start_form", "click_tel", "click_line"];
  for (const name of eventNames) {
    await prisma.event.create({
      data: { name },
    });
  }

  const counts = await Promise.all([
    prisma.lead.count(),
    prisma.source.count(),
    prisma.event.count(),
  ]);

  console.log(`Seeded: ${counts[0]} leads, ${counts[1]} sources, ${counts[2]} events`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
