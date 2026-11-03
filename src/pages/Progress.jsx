import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Scale, Plus, TrendingDown, TrendingUp, Target, Settings2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useProfile from "@/hooks/useProfile";
import WeightChart from "@/components/progress/WeightChart";
import { Input } from "@/components/ui/input";
import { GOAL_LABELS } from "@/lib/nutrition";
import { toISODate } from "@/lib/dates";

export default function Progress() {
  const { profile } = useProfile();
  const today = toISODate();
  const [logs, setLogs] = useState([]);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const page = await base44.entities.WeightLog.filter({}, { sort: "-date", limit: 60 });
    setLogs(page?.items || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e) => {
    e.preventDefault();
    const weight = Number(value);
    if (!weight || weight <= 0) return;
    setSaving(true);
    try {
      const existing = logs.find((log) => log.date === today);
      if (existing) {
        await base44.entities.WeightLog.update(existing.id, { weight });
      } else {
        await base44.entities.WeightLog.create({ date: today, weight });
      }
      setValue("");
      await load();
    } finally {
      setSaving(false);
    }
  };

  const sorted = [...logs].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const current = sorted.length ? Number(sorted[sorted.length - 1].weight) : Number(profile?.weight) || 0;
  const first = sorted.length ? Number(sorted[0].weight) : current;
  const target = Number(profile?.target_weight) || 0;
  const change = current - first;
  const toGoal = target ? current - target : 0;
  const bmi =
    profile?.height && current ? (current / Math.pow(Number(profile.height) / 100, 2)).toFixed(1) : null;

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-[22px] font-black tracking-tight text-[#0C2A1D]">تقدمي</h1>
          <p className="mt-0.5 text-[12px] text-[#0C2A1D]/45">
            {profile?.goal ? GOAL_LABELS[profile.goal] : "تابع وزنك أسبوعياً"}
          </p>
        </div>
        <Link
          to="/onboarding"
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#0C2A1D]/50 shadow-sm transition hover:text-[#0F9D58]"
          aria-label="تعديل بياناتي"
        >
          <Settings2 className="h-4 w-4" />
        </Link>
      </header>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/[0.03]">
          <p className="text-[10px] font-semibold text-[#0C2A1D]/40">وزنك الحالي</p>
          <p className="mt-1.5 font-heading text-[22px] font-black leading-none text-[#0C2A1D]">
            {current || "—"}
            <span className="mr-0.5 text-[10px] font-semibold text-[#0C2A1D]/35">كجم</span>
          </p>
        </div>
        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/[0.03]">
          <p className="text-[10px] font-semibold text-[#0C2A1D]/40">التغير</p>
          <p
            className={`mt-1.5 flex items-center gap-1 font-heading text-[22px] font-black leading-none ${
              change === 0 ? "text-[#0C2A1D]" : change < 0 ? "text-[#0F9D58]" : "text-[#E4A11B]"
            }`}
          >
            {change === 0 ? "0" : change < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            {Math.abs(change) ? Math.abs(change).toFixed(1) : "0"}
            <span className="text-[10px] font-semibold text-[#0C2A1D]/35">كجم</span>
          </p>
        </div>
        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/[0.03]">
          <p className="text-[10px] font-semibold text-[#0C2A1D]/40">{bmi ? "مؤشر الكتلة" : "الهدف"}</p>
          <p className="mt-1.5 font-heading text-[22px] font-black leading-none text-[#0C2A1D]">
            {bmi || target || "—"}
            <span className="mr-0.5 text-[10px] font-semibold text-[#0C2A1D]/35">{bmi ? "" : "كجم"}</span>
          </p>
        </div>
      </div>

      <section className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-[14px] font-bold text-[#0C2A1D]">منحنى الوزن</h2>
          {target ? (
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#0F9D58]">
              <Target className="h-3 w-3" />
              الهدف {target} كجم
            </span>
          ) : null}
        </div>

        {loading ? (
          <div className="grid h-56 place-items-center">
            <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#0F9D58]/20 border-t-[#0F9D58]" />
          </div>
        ) : logs.length < 2 ? (
          <div className="mt-4 grid h-40 place-items-center rounded-2xl bg-[#F7FAF8] px-6 text-center">
            <p className="text-[12px] leading-relaxed text-[#0C2A1D]/45">
              سجّل وزنك مرتين على الأقل ليظهر المنحنى — القياس الأسبوعي يكفي.
            </p>
          </div>
        ) : (
          <div className="mt-3">
            <WeightChart logs={logs} target={target} />
          </div>
        )}
      </section>

      <section className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#0F9D58]/10 text-[#0F9D58]">
            <Scale className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-[14px] font-bold text-[#0C2A1D]">سجّل وزن اليوم</h2>
        </div>
        <form onSubmit={save} className="mt-3 flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
            step="0.1"
            inputMode="decimal"
            placeholder={current ? `${current}` : "مثال: 78.5"}
            className="h-12 rounded-xl bg-[#F7FAF8]"
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0F9D58] px-5 text-[13px] font-bold text-white transition hover:bg-[#0C8650] disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            حفظ
          </button>
        </form>
        {target > 0 && (
          <p className="mt-3 text-[11.5px] text-[#0C2A1D]/45">
            {Math.abs(toGoal) < 0.3
              ? "وصلت لهدفك — حافظ على استقرارك."
              : `باقي ${Math.abs(toGoal).toFixed(1)} كجم للوصول إلى هدفك.`}
          </p>
        )}
      </section>

      {sorted.length > 0 && (
        <section className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]">
          <h2 className="font-heading text-[14px] font-bold text-[#0C2A1D]">سجل القياسات</h2>
          <div className="mt-3 space-y-1.5">
            {[...sorted]
              .reverse()
              .slice(0, 8)
              .map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-xl bg-[#F9FBFA] px-3.5 py-2.5">
                  <span className="text-[11.5px] text-[#0C2A1D]/50">{log.date}</span>
                  <span className="font-heading text-[13px] font-bold text-[#0C2A1D]">
                    {log.weight} <span className="text-[10px] font-semibold text-[#0C2A1D]/35">كجم</span>
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}