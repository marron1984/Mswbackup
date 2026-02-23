"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import {
  Clock,
  AlertTriangle,
  Stethoscope,
  Wallet,
  Users,
  HelpCircle,
  Phone,
  Headphones,
  Building2,
  CalendarCheck,
  ArrowDown,
} from "lucide-react";
import { staggerContainer, staggerItem, FadeUp } from "./motion";

// ── Hero animation wrapper ──
export function HeroAnimation({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Stats counter ──
export function StatsCounter() {
  const stats = [
    { value: "24", unit: "時間", label: "最短候補提示" },
    { value: "500", unit: "件+", label: "年間相談実績" },
    { value: "98", unit: "%", label: "ご紹介満足度" },
    { value: "0", unit: "円", label: "ご相談料金" },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
    >
      {stats.map((stat, i) => (
        <motion.div key={i} variants={staggerItem} className="text-center">
          <div className="flex items-baseline justify-center gap-0.5">
            <motion.span
              className="text-4xl md:text-5xl font-extrabold gradient-text"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            >
              {stat.value}
            </motion.span>
            <span className="text-lg font-bold text-navy-600">{stat.unit}</span>
          </div>
          <p className="text-sm text-navy-500 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Stagger grid for concerns ──
const iconMap: Record<string, typeof Clock> = {
  clock: Clock,
  alert: AlertTriangle,
  medical: Stethoscope,
  wallet: Wallet,
  users: Users,
  help: HelpCircle,
};

export function StaggerGrid({
  items,
}: {
  items: { icon: string; text: string }[];
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="grid md:grid-cols-2 gap-4"
    >
      {items.map((item, i) => {
        const Icon = iconMap[item.icon] || HelpCircle;
        return (
          <motion.div
            key={i}
            variants={staggerItem}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-navy-100/50 shadow-sm hover:shadow-md hover:border-navy-200/50 transition-all duration-300 cursor-default"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-navy-50 to-teal-50 flex items-center justify-center">
              <Icon className="h-5 w-5 text-navy-600" />
            </div>
            <span className="text-navy-800 font-medium text-[15px]">{item.text}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ── Flow timeline ──
export function FlowTimeline() {
  const steps = [
    {
      icon: Phone,
      title: "お問い合わせ",
      desc: "電話・LINE・フォームからご相談",
      color: "from-navy-500 to-navy-700",
    },
    {
      icon: Headphones,
      title: "ヒアリング",
      desc: "ご要望・ご状況を詳しく伺います",
      color: "from-teal-500 to-teal-700",
    },
    {
      icon: Building2,
      title: "施設ご提案",
      desc: "条件に合う施設を複数ご紹介",
      color: "from-navy-600 to-teal-600",
    },
    {
      icon: CalendarCheck,
      title: "見学・入居",
      desc: "見学手配から入居までサポート",
      color: "from-teal-600 to-navy-600",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {steps.map((step, i) => (
        <FadeUp key={i} delay={i * 0.12}>
          <div className="flex items-start gap-6 mb-2 last:mb-0">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shrink-0`}
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <step.icon className="h-6 w-6 text-white" />
              </motion.div>
              {i < steps.length - 1 && (
                <div className="w-px h-10 bg-gradient-to-b from-navy-200 to-transparent my-1 flex items-center justify-center">
                  <ArrowDown className="h-3 w-3 text-navy-300 absolute" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="pt-2 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-navy-400 tracking-wider">
                  STEP {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-lg text-navy-900 mb-1">{step.title}</h3>
              <p className="text-navy-500 text-sm">{step.desc}</p>
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
