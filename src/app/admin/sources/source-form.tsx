"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SOURCE_TYPES } from "@/lib/constants";
import { Loader2, Plus, ChevronDown, ChevronUp } from "lucide-react";

export function SourceForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "hospital",
    name: "",
    department: "",
    personName: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ type: "hospital", name: "", department: "", personName: "", phone: "", email: "" });
        setOpen(false);
        router.refresh();
      }
    } catch {
      // Silently fail
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">紹介元を追加</CardTitle>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </CardHeader>
      {open && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">種別</Label>
                <Select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {SOURCE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label className="mb-1 block">名称 *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例: 〇〇病院"
                  required
                />
              </div>
              <div>
                <Label className="mb-1 block">部署</Label>
                <Input
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="例: 地域連携室"
                />
              </div>
              <div>
                <Label className="mb-1 block">担当者名</Label>
                <Input
                  value={form.personName}
                  onChange={(e) => setForm({ ...form, personName: e.target.value })}
                  placeholder="例: 佐藤 花子"
                />
              </div>
              <div>
                <Label className="mb-1 block">電話</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="例: 03-1234-5678"
                />
              </div>
              <div>
                <Label className="mb-1 block">メール</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="例: contact@hospital.jp"
                  type="email"
                />
              </div>
            </div>
            <Button type="submit" disabled={saving || !form.name.trim()}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              追加
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
