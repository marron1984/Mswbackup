"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FixedCTA } from "@/components/fixed-cta";
import { useTrackEvent, TrackPageView } from "@/components/tracking-client";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  CONSULTANT_TYPES,
  CARE_LEVELS,
  MEDICAL_FLAGS,
  MOVE_IN_TIMINGS,
  PREFERRED_CONTACTS,
} from "@/lib/constants";

const TOTAL_STEPS = 4;

interface FormData {
  consultantType: string;
  careLevel: string;
  medicalFlags: string[];
  desiredArea: string;
  moveInTiming: string;
  budgetMax: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  preferredContact: string;
  memo: string;
  privacyAgreed: boolean;
}

const initialFormData: FormData = {
  consultantType: "",
  careLevel: "",
  medicalFlags: [],
  desiredArea: "",
  moveInTiming: "",
  budgetMax: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  preferredContact: "",
  memo: "",
  privacyAgreed: false,
};

export default function ConsultPage() {
  const router = useRouter();
  const track = useTrackEvent();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [tracked, setTracked] = useState(false);

  if (!tracked) {
    setTracked(true);
    track("start_form");
  }

  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const toggleMedicalFlag = useCallback((flag: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalFlags: prev.medicalFlags.includes(flag)
        ? prev.medicalFlags.filter((f) => f !== flag)
        : [...prev.medicalFlags, flag],
    }));
  }, []);

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};

    if (s === 1) {
      if (!formData.consultantType) errs.consultantType = "相談者区分を選択してください";
    }
    if (s === 2) {
      if (!formData.careLevel) errs.careLevel = "要介護度を選択してください";
    }
    if (s === 3) {
      if (!formData.desiredArea) errs.desiredArea = "希望エリアを入力してください";
      if (!formData.moveInTiming) errs.moveInTiming = "入居時期を選択してください";
    }
    if (s === 4) {
      if (!formData.contactName) errs.contactName = "お名前を入力してください";
      if (!formData.contactPhone) errs.contactPhone = "電話番号を入力してください";
      else if (!/^[0-9\-]+$/.test(formData.contactPhone))
        errs.contactPhone = "正しい電話番号を入力してください";
      if (!formData.preferredContact) errs.preferredContact = "希望連絡方法を選択してください";
      if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail))
        errs.contactEmail = "正しいメールアドレスを入力してください";
      if (!formData.privacyAgreed) errs.privacyAgreed = "個人情報の取り扱いに同意してください";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(Math.min(step + 1, TOTAL_STEPS));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(Math.max(step - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budgetMax: formData.budgetMax ? parseInt(formData.budgetMax, 10) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          setErrors(data.errors);
          return;
        }
        throw new Error("送信に失敗しました");
      }

      track("submit_form");
      router.push("/thanks");
    } catch {
      setErrors({ form: "送信に失敗しました。お手数ですがお電話でご連絡ください。" });
    } finally {
      setSubmitting(false);
    }
  };

  const FieldError = ({ name }: { name: string }) => {
    const error = errors[name];
    if (!error) return null;
    return <p className="text-red-500 text-sm mt-1">{error}</p>;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <TrackPageView name="start_form" />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="font-bold text-gray-900">無料相談フォーム</div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>ステップ {step} / {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {errors.form}
          </div>
        )}

        {/* Step 1: 相談者区分 */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">あなたの立場を教えてください</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CONSULTANT_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    formData.consultantType === type.value
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="consultantType"
                    value={type.value}
                    checked={formData.consultantType === type.value}
                    onChange={(e) => updateField("consultantType", e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.consultantType === type.value
                        ? "border-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.consultantType === type.value && (
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                    )}
                  </div>
                  <span className="font-medium">{type.label}</span>
                </label>
              ))}
              <FieldError name="consultantType" />
            </CardContent>
          </Card>
        )}

        {/* Step 2: 対象者の状態 */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">対象者の状態を教えてください</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-2 block">要介護度</Label>
                <Select
                  value={formData.careLevel}
                  onChange={(e) => updateField("careLevel", e.target.value)}
                >
                  <option value="">選択してください</option>
                  {CARE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </Select>
                <FieldError name="careLevel" />
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">
                  医療処置・症状（該当するもの全て）
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {MEDICAL_FLAGS.map((flag) => (
                    <label
                      key={flag.value}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors text-sm ${
                        formData.medicalFlags.includes(flag.value)
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.medicalFlags.includes(flag.value)}
                        onChange={() => toggleMedicalFlag(flag.value)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span>{flag.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: 希望条件 */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">ご希望の条件を教えてください</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="desiredArea" className="text-base font-semibold mb-2 block">
                  希望エリア（市区町村・駅名など）
                </Label>
                <Input
                  id="desiredArea"
                  placeholder="例: 横浜市港北区、新横浜駅周辺"
                  value={formData.desiredArea}
                  onChange={(e) => updateField("desiredArea", e.target.value)}
                />
                <FieldError name="desiredArea" />
              </div>

              <div>
                <Label className="text-base font-semibold mb-2 block">希望入居時期</Label>
                <Select
                  value={formData.moveInTiming}
                  onChange={(e) => updateField("moveInTiming", e.target.value)}
                >
                  <option value="">選択してください</option>
                  {MOVE_IN_TIMINGS.map((timing) => (
                    <option key={timing.value} value={timing.value}>
                      {timing.label}
                    </option>
                  ))}
                </Select>
                <FieldError name="moveInTiming" />
              </div>

              <div>
                <Label htmlFor="budgetMax" className="text-base font-semibold mb-2 block">
                  月額予算上限（万円・任意）
                </Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="例: 20"
                  value={formData.budgetMax}
                  onChange={(e) => updateField("budgetMax", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: 連絡先 */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">ご連絡先を教えてください</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="contactName" className="text-base font-semibold mb-2 block">
                  お名前 <span className="text-red-500 text-sm">*必須</span>
                </Label>
                <Input
                  id="contactName"
                  placeholder="山田 太郎"
                  value={formData.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                />
                <FieldError name="contactName" />
              </div>

              <div>
                <Label htmlFor="contactPhone" className="text-base font-semibold mb-2 block">
                  電話番号 <span className="text-red-500 text-sm">*必須</span>
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="090-1234-5678"
                  value={formData.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                />
                <FieldError name="contactPhone" />
              </div>

              <div>
                <Label htmlFor="contactEmail" className="text-base font-semibold mb-2 block">
                  メールアドレス（任意）
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                />
                <FieldError name="contactEmail" />
              </div>

              <div>
                <Label className="text-base font-semibold mb-2 block">
                  希望連絡方法 <span className="text-red-500 text-sm">*必須</span>
                </Label>
                <Select
                  value={formData.preferredContact}
                  onChange={(e) => updateField("preferredContact", e.target.value)}
                >
                  <option value="">選択してください</option>
                  {PREFERRED_CONTACTS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
                <FieldError name="preferredContact" />
              </div>

              <div>
                <Label htmlFor="memo" className="text-base font-semibold mb-2 block">
                  その他ご要望（任意）
                </Label>
                <Textarea
                  id="memo"
                  placeholder="その他のご要望やご質問があればご記入ください"
                  value={formData.memo}
                  onChange={(e) => updateField("memo", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="border-t pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacyAgreed}
                    onChange={(e) => updateField("privacyAgreed", e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-600">
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-green-600 underline"
                    >
                      プライバシーポリシー
                    </Link>
                    に同意の上、送信します
                  </span>
                </label>
                <FieldError name="privacyAgreed" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 gap-3">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              戻る
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700 gap-1">
              次へ
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "送信中..." : "相談を送信する"}
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          60秒で完了・相談無料
        </p>
      </div>

      <FixedCTA />
      <div className="h-16 md:hidden" />
    </main>
  );
}
