import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import BrandLogo from "@/components/BrandLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACTIVITY_LEVELS, GOALS, calculateTargets } from "@/lib/nutrition";
import useProfile from "@/hooks/useProfile";

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "male",
    weight: "",
    height: "",
    target_weight: "",
    activity_level: "moderate",
    goal: "lose",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const preview = calculateTargets({
    gender: form.gender,
    weight: form.weight,
    height: form.height,
    age: form.age,
    activity_level: form.activity_level,
    goal: form.goal,
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.age || !form.weight || !form.height) {
      setError("يرجى إدخال العمر والوزن والطول.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const targets = calculateTargets({
        gender: form.gender,
        weight: form.weight,
        height: form.height,
        age: form.age,
        activity_level: form.activity_level,
        goal: form.goal,
      });
      const payload = {
        full_name: form.full_name.trim(),
        age: Number(form.age),
        gender: form.gender,
        weight: Number(form.weight),
        height: Number(form.height),
        target_weight: Number(form.target_weight) || null,
        activity_level: form.activity_level,
        goal: form.goal,
        daily_calories: targets.calories,
        protein_target: targets.protein,
        carbs_target: targets.carbs,
        fat_target: targets.fat,
        water_target: targets.water,
        onboarding_complete: true,
      };

      if (profile?.id) {
        await base44.entities.Profile.update(profile.id, payload);
      } else {
        await base44.entities.Profile.create(payload);
      }

      if (Number(form.weight) > 0) {
        const existing = await base44.entities.WeightLog.filter(
          { date: new Date().toISOString().slice(0, 10) },
          { limit: 1 }
        );
        if (!existing?.items?.length) {
          await base44.entities.WeightLog.create({
            date: new Date().toISOString().slice(0, 10),
            weight: Number(form.weight),
          });
        }
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F4F7F5]">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#0F9D58]/20 border-t-[#0F9D58]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] px-4 py-8 text-[#0C2A1D]" dir="rtl">
      <div className="mx-auto w-full max-w-xl">
        <div className="flex justify-center">
          <BrandLogo />
        </div>

        <div className="mt-7 rounded-[28px] bg-white p-6 shadow-[0_25px_60px_-40px_rgba(12,42,29,0.6)] ring-1 ring-black/[0.03]">
          <h1 className="font-heading text-[24px] font-black tracking-tight">لنعرّفك ببعضنا</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[#0C2A1D]/55">
            بياناتك تُستخدم فقط لحساب احتياجك اليومي من السعرات والماكروز.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full_name">الاسم</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                placeholder="ما اسمك؟"
                className="h-12 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="age">العمر</Label>
                <Input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                  placeholder="24"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>الجنس</Label>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F4F7F5] p-1">
                  {[
                    { value: "male", label: "ذكر" },
                    { value: "female", label: "أنثى" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => set("gender", option.value)}
                      className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                        form.gender === option.value
                          ? "bg-white text-[#0F9D58] shadow-sm"
                          : "text-[#0C2A1D]/45"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="weight">الوزن (كجم)</Label>
                <Input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  value={form.weight}
                  onChange={(e) => set("weight", e.target.value)}
                  placeholder="78"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">الطول (سم)</Label>
                <Input
                  id="height"
                  type="number"
                  inputMode="numeric"
                  value={form.height}
                  onChange={(e) => set("height", e.target.value)}
                  placeholder="176"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">الهدف (كجم)</Label>
                <Input
                  id="target"
                  type="number"
                  inputMode="decimal"
                  value={form.target_weight}
                  onChange={(e) => set("target_weight", e.target.value)}
                  placeholder="72"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>هدفك الأساسي</Label>
              <div className="grid grid-cols-3 gap-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => set("goal", goal.value)}
                    className={`rounded-xl border-2 px-2 py-3 text-[12px] font-bold transition ${
                      form.goal === goal.value
                        ? "border-[#0F9D58] bg-[#0F9D58]/8 text-[#0F9D58]"
                        : "border-[#EDF1EE] text-[#0C2A1D]/50 hover:border-[#0F9D58]/30"
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>مستوى النشاط اليومي</Label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => set("activity_level", level.value)}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-right text-[13px] font-semibold transition ${
                      form.activity_level === level.value
                        ? "border-[#0F9D58] bg-[#0F9D58]/8 text-[#0F9D58]"
                        : "border-[#EDF1EE] text-[#0C2A1D]/55 hover:border-[#0F9D58]/30"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        form.activity_level === level.value ? "bg-[#0F9D58]" : "bg-[#0C2A1D]/15"
                      }`}
                    />
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {preview.calories > 0 && (
              <div className="rounded-2xl bg-[#0F9D58]/[0.07] p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#0F9D58]">
                  <Sparkles className="h-3.5 w-3.5" />
                  احتياجك اليومي المتوقع
                </div>
                <div className="mt-3 flex items-end gap-2">
                  <span className="font-heading text-[30px] font-black leading-none text-[#0C2A1D]">
                    {preview.calories}
                  </span>
                  <span className="pb-1 text-[11px] font-semibold text-[#0C2A1D]/45">سعرة / يوم</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "بروتين", value: preview.protein },
                    { label: "كارب", value: preview.carbs },
                    { label: "دهون", value: preview.fat },
                  ].map((macro) => (
                    <div key={macro.label} className="rounded-xl bg-white py-2">
                      <p className="font-heading text-[15px] font-bold">{macro.value}ج</p>
                      <p className="text-[10px] text-[#0C2A1D]/40">{macro.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-[13px] font-semibold text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F9D58] py-4 text-[15px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(15,157,88,0.9)] transition hover:bg-[#0C8650] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
              ابدأ رحلتي
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[11px] text-[#0C2A1D]/35">
          يمكنك تعديل هذه البيانات لاحقاً من صفحة تقدمي
        </p>
      </div>
    </div>
  );
}