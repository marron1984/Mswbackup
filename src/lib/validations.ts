import { z } from "zod";

export const consultFormSchema = z.object({
  // Step 1: 相談者区分
  consultantType: z.string().min(1, "相談者区分を選択してください"),

  // Step 2: 対象者の状態
  careLevel: z.string().min(1, "要介護度を選択してください"),
  medicalFlags: z.array(z.string()).default([]),

  // Step 3: 希望条件
  desiredArea: z.string().min(1, "希望エリアを入力してください"),
  moveInTiming: z.string().min(1, "入居時期を選択してください"),
  budgetMax: z.number().nullable().optional(),

  // Step 4: 連絡先
  contactName: z.string().min(1, "お名前を入力してください"),
  contactPhone: z
    .string()
    .min(1, "電話番号を入力してください")
    .regex(/^[0-9\-]+$/, "正しい電話番号を入力してください"),
  contactEmail: z.string().email("正しいメールアドレスを入力してください").or(z.literal("")).optional(),
  preferredContact: z.string().min(1, "希望連絡方法を選択してください"),
  memo: z.string().optional(),

  // 同意
  privacyAgreed: z.literal(true, {
    error: "個人情報の取り扱いに同意してください",
  }),
});

export type ConsultFormData = z.infer<typeof consultFormSchema>;

export const adminLoginSchema = z.object({
  password: z.string().min(1, "パスワードを入力してください"),
});

export const leadUpdateSchema = z.object({
  status: z.string().optional(),
  severity: z.string().optional(),
  memo: z.string().optional(),
  sourceId: z.string().nullable().optional(),
});
