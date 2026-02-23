"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FixedCTA } from "@/components/fixed-cta";
import { useTrackEvent, TrackPageView } from "@/components/tracking-client";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Heart,
  User,
  Stethoscope,
  MapPin,
  Send,
  Check,
} from "lucide-react";
import {
  CONSULTANT_TYPES,
  CARE_LEVELS,
  MEDICAL_FLAGS,
  MOVE_IN_TIMINGS,
  PREFERRED_CONTACTS,
} from "@/lib/constants";

const TOTAL_STEPS = 4;

const stepMeta = [
  { icon: User, label: "あなたについて", color: "from-navy-500 to-navy-700" },
  { icon: Stethoscope, label: "対象者の状態", color: "from-teal-500 to-teal-700" },
  { icon: MapPin, label: "希望条件", color: "from-navy-600 to-teal-600" },
  { icon: Send, label: "連絡先", color: "from-teal-600 to-navy-600" },
];

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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

export default function ConsultPage() {
  const router = useRouter();
  const track = useTrackEvent();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
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
      setDirection(1);
      setStep(Math.min(step + 1, TOTAL_STEPS));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(Math.max(step - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    return (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-coral-500 text-sm mt-1.5 font-medium"
      >
        {error}
      </motion.p>
    );
  };

  const currentStepMeta = stepMeta[step - 1];

  return (
    <main className="min-h-screen bg-[#fafbff]">
      <TrackPageView name="start_form" />

      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-white/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-navy-400 hover:text-navy-600 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-cta flex items-center justify-center">
              <Heart className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-navy-900">無料相談フォーム</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepMeta.map((meta, i) => {
              const Icon = meta.icon;
              const isActive = i + 1 === step;
              const isDone = i + 1 < step;
              return (
                <div key={i} className="flex items-center flex-1 last:flex-0">
                  <motion.div
                    className={`relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-br ${meta.color} text-white shadow-lg`
                        : isDone
                        ? "bg-teal-100 text-teal-700"
                        : "bg-navy-100/50 text-navy-400"
                    }`}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </motion.div>
                  {i < stepMeta.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: isDone ? 1 : 0,
                          backgroundColor: isDone ? "#12b886" : "#e5e7f0",
                        }}
                        style={{ originX: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="h-full bg-navy-100/50 rounded-full -mt-0.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-navy-700">
              {currentStepMeta.label}
            </p>
            <p className="text-sm text-navy-400">
              {step} / {TOTAL_STEPS}
            </p>
          </div>
        </div>

        {errors.form && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-coral-500/10 border border-coral-500/20 text-coral-600 rounded-2xl p-4 mb-6 text-sm font-medium"
          >
            {errors.form}
          </motion.div>
        )}

        {/* Animated step content */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-white rounded-2xl border border-navy-100/50 shadow-sm overflow-hidden">
                {/* Step 1 */}
                {step === 1 && (
                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-bold text-navy-900 mb-1">
                      あなたの立場を教えてください
                    </h2>
                    <p className="text-sm text-navy-500 mb-6">
                      ご状況に合わせてご案内いたします
                    </p>
                    <div className="space-y-3">
                      {CONSULTANT_TYPES.map((type, i) => (
                        <motion.label
                          key={type.value}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.consultantType === type.value
                              ? "border-navy-600 bg-navy-50 shadow-sm"
                              : "border-navy-100 hover:border-navy-200 hover:bg-navy-50/50"
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
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.consultantType === type.value
                                ? "border-navy-600"
                                : "border-navy-300"
                            }`}
                          >
                            {formData.consultantType === type.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 rounded-full bg-navy-600"
                              />
                            )}
                          </div>
                          <span className="font-medium text-navy-800">{type.label}</span>
                        </motion.label>
                      ))}
                      <FieldError name="consultantType" />
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-bold text-navy-900 mb-1">
                      対象者の状態を教えてください
                    </h2>
                    <p className="text-sm text-navy-500 mb-6">
                      受入可能な施設の絞り込みに使用します
                    </p>
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-2 block text-navy-800">
                          要介護度
                        </Label>
                        <Select
                          value={formData.careLevel}
                          onChange={(e) => updateField("careLevel", e.target.value)}
                          className="rounded-xl border-navy-200 focus-visible:ring-navy-400"
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
                        <Label className="text-base font-semibold mb-3 block text-navy-800">
                          医療処置・症状
                          <span className="text-sm font-normal text-navy-400 ml-2">
                            該当するもの全て
                          </span>
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {MEDICAL_FLAGS.map((flag, i) => (
                            <motion.label
                              key={flag.value}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.03 }}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all duration-200 text-sm ${
                                formData.medicalFlags.includes(flag.value)
                                  ? "border-teal-500 bg-teal-50 text-teal-800"
                                  : "border-navy-100 hover:border-navy-200 text-navy-700"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.medicalFlags.includes(flag.value)}
                                onChange={() => toggleMedicalFlag(flag.value)}
                                className="rounded border-navy-300 text-teal-600 focus:ring-teal-500"
                              />
                              <span>{flag.label}</span>
                            </motion.label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-bold text-navy-900 mb-1">
                      ご希望の条件を教えてください
                    </h2>
                    <p className="text-sm text-navy-500 mb-6">
                      エリアと時期を教えていただければ素早くご提案できます
                    </p>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="desiredArea" className="text-base font-semibold mb-2 block text-navy-800">
                          希望エリア
                          <span className="text-sm font-normal text-navy-400 ml-2">
                            市区町村・駅名など
                          </span>
                        </Label>
                        <Input
                          id="desiredArea"
                          placeholder="例: 横浜市港北区、新横浜駅周辺"
                          value={formData.desiredArea}
                          onChange={(e) => updateField("desiredArea", e.target.value)}
                          className="rounded-xl border-navy-200 focus-visible:ring-navy-400"
                        />
                        <FieldError name="desiredArea" />
                      </div>

                      <div>
                        <Label className="text-base font-semibold mb-2 block text-navy-800">
                          希望入居時期
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {MOVE_IN_TIMINGS.map((timing, i) => (
                            <motion.label
                              key={timing.value}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer text-sm font-medium text-center transition-all duration-200 ${
                                formData.moveInTiming === timing.value
                                  ? "border-navy-600 bg-navy-50 text-navy-800 shadow-sm"
                                  : "border-navy-100 text-navy-600 hover:border-navy-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="moveInTiming"
                                value={timing.value}
                                checked={formData.moveInTiming === timing.value}
                                onChange={(e) => updateField("moveInTiming", e.target.value)}
                                className="sr-only"
                              />
                              {timing.label}
                            </motion.label>
                          ))}
                        </div>
                        <FieldError name="moveInTiming" />
                      </div>

                      <div>
                        <Label htmlFor="budgetMax" className="text-base font-semibold mb-2 block text-navy-800">
                          月額予算上限
                          <span className="text-sm font-normal text-navy-400 ml-2">
                            万円・任意
                          </span>
                        </Label>
                        <Input
                          id="budgetMax"
                          type="number"
                          placeholder="例: 20"
                          value={formData.budgetMax}
                          onChange={(e) => updateField("budgetMax", e.target.value)}
                          className="rounded-xl border-navy-200 focus-visible:ring-navy-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {step === 4 && (
                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-bold text-navy-900 mb-1">
                      ご連絡先を教えてください
                    </h2>
                    <p className="text-sm text-navy-500 mb-6">
                      担当者より速やかにご連絡いたします
                    </p>
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="contactName" className="text-base font-semibold mb-2 block text-navy-800">
                          お名前 <span className="text-coral-500 text-sm">*</span>
                        </Label>
                        <Input
                          id="contactName"
                          placeholder="山田 太郎"
                          value={formData.contactName}
                          onChange={(e) => updateField("contactName", e.target.value)}
                          className="rounded-xl border-navy-200 focus-visible:ring-navy-400"
                        />
                        <FieldError name="contactName" />
                      </div>

                      <div>
                        <Label htmlFor="contactPhone" className="text-base font-semibold mb-2 block text-navy-800">
                          電話番号 <span className="text-coral-500 text-sm">*</span>
                        </Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder="090-1234-5678"
                          value={formData.contactPhone}
                          onChange={(e) => updateField("contactPhone", e.target.value)}
                          className="rounded-xl border-navy-200 focus-visible:ring-navy-400"
                        />
                        <FieldError name="contactPhone" />
                      </div>

                      <div>
                        <Label htmlFor="contactEmail" className="text-base font-semibold mb-2 block text-navy-800">
                          メールアドレス
                          <span className="text-sm font-normal text-navy-400 ml-2">任意</span>
                        </Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.contactEmail}
                          onChange={(e) => updateField("contactEmail", e.target.value)}
                          className="rounded-xl border-navy-200 focus-visible:ring-navy-400"
                        />
                        <FieldError name="contactEmail" />
                      </div>

                      <div>
                        <Label className="text-base font-semibold mb-2 block text-navy-800">
                          希望連絡方法 <span className="text-coral-500 text-sm">*</span>
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {PREFERRED_CONTACTS.map((c) => (
                            <label
                              key={c.value}
                              className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all duration-200 ${
                                formData.preferredContact === c.value
                                  ? "border-navy-600 bg-navy-50 text-navy-800"
                                  : "border-navy-100 text-navy-600 hover:border-navy-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="preferredContact"
                                value={c.value}
                                checked={formData.preferredContact === c.value}
                                onChange={(e) => updateField("preferredContact", e.target.value)}
                                className="sr-only"
                              />
                              {c.label}
                            </label>
                          ))}
                        </div>
                        <FieldError name="preferredContact" />
                      </div>

                      <div>
                        <Label htmlFor="memo" className="text-base font-semibold mb-2 block text-navy-800">
                          その他ご要望
                          <span className="text-sm font-normal text-navy-400 ml-2">任意</span>
                        </Label>
                        <Textarea
                          id="memo"
                          placeholder="その他のご要望やご質問があればご記入ください"
                          value={formData.memo}
                          onChange={(e) => updateField("memo", e.target.value)}
                          rows={3}
                          className="rounded-xl border-navy-200 focus-visible:ring-navy-400"
                        />
                      </div>

                      <div className="border-t border-navy-100 pt-5">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.privacyAgreed}
                            onChange={(e) => updateField("privacyAgreed", e.target.checked)}
                            className="mt-1 rounded border-navy-300 text-navy-600 focus:ring-navy-500"
                          />
                          <span className="text-sm text-navy-600">
                            <Link
                              href="/privacy"
                              target="_blank"
                              className="text-navy-700 underline underline-offset-2 decoration-navy-300 hover:decoration-navy-600 transition-colors"
                            >
                              プライバシーポリシー
                            </Link>
                            に同意の上、送信します
                          </span>
                        </label>
                        <FieldError name="privacyAgreed" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 gap-3">
          {step > 1 ? (
            <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={prevStep}
                className="gap-1.5 rounded-xl border-navy-200 text-navy-600 hover:bg-navy-50"
              >
                <ChevronLeft className="h-4 w-4" />
                戻る
              </Button>
            </motion.div>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={nextStep}
                className="gap-1.5 gradient-cta text-white rounded-xl shadow-md shadow-navy-600/20 hover:shadow-lg transition-shadow"
              >
                次へ
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="gap-2 gradient-cta text-white rounded-xl shadow-md shadow-navy-600/20 hover:shadow-lg transition-shadow px-8"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "送信中..." : "相談を送信する"}
              </Button>
            </motion.div>
          )}
        </div>

        <p className="text-center text-sm text-navy-400 mt-4">
          60秒で完了・相談無料
        </p>
      </div>

      <FixedCTA />
      <div className="h-16 md:hidden" />
    </main>
  );
}
