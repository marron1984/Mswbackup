"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LEAD_STATUSES, SEVERITY_LEVELS } from "@/lib/constants";
import { Loader2, Save } from "lucide-react";

interface LeadActionsProps {
  leadId: string;
  currentStatus: string;
  currentSeverity: string;
  currentMemo: string;
  currentSourceId: string;
  sources: { id: string; name: string }[];
}

export function LeadActions({
  leadId,
  currentStatus,
  currentSeverity,
  currentMemo,
  currentSourceId,
  sources,
}: LeadActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [severity, setSeverity] = useState(currentSeverity);
  const [memo, setMemo] = useState(currentMemo);
  const [sourceId, setSourceId] = useState(currentSourceId);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, severity, memo, sourceId: sourceId || null }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage("保存しました");
      router.refresh();
    } catch {
      setMessage("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>ステータス更新</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-1 block">ステータス</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label className="mb-1 block">重要度</Label>
          <Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            {SEVERITY_LEVELS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label className="mb-1 block">紹介元</Label>
          <Select value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
            <option value="">未設定</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label className="mb-1 block">内部メモ</Label>
          <Textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={4}
            placeholder="内部メモを入力"
          />
        </div>

        {message && (
          <p
            className={`text-sm font-medium ${
              message.includes("失敗") ? "text-coral-500" : "text-teal-600"
            }`}
          >
            {message}
          </p>
        )}

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full gradient-cta text-white rounded-xl shadow-md shadow-navy-600/20 hover:shadow-lg transition-shadow"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          保存
        </Button>
      </CardContent>
    </Card>
  );
}
