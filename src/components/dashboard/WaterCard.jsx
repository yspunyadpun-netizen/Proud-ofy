import { Droplets, Minus, Plus } from "lucide-react";

const STEP = 0.25;
const fmt = (value) => Number(Number(value).toFixed(2));

export default function WaterCard({ liters, target, onChange }) {
  const goal = Number(target) || 2.5;
  const current = Number(liters) || 0;
  const pct = Math.min(100, Math.round((current / goal) * 100));
  const remaining = Math.max(0, Math.round((goal - current) * 100) / 100);

  return (
    <section className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
            <Droplets className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <h2 className="font-heading text-[15px] font-bold text-[#0C2A1D]">الماء</h2>
        </div>
        <p className="font-heading text-[13px] font-bold text-[#0C2A1D]">
          {fmt(current)}
          <span className="text-[#0C2A1D]/35"> / {fmt(goal)} لتر</span>
        </p>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#EFF3F2]">
        <div
          className="h-full rounded-full bg-gradient-to-l from-[#3B82F6] to-[#60A5FA] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-2 text-[11px] font-semibold text-[#0C2A1D]/40">
        {remaining > 0 ? `متبقٍ ${fmt(remaining)} لتر للوصول إلى هدفك` : "أكملت هدف الماء اليوم 🎉"}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, current - STEP))}
          disabled={current === 0}
          className="grid h-10 w-10 place-items-center rounded-xl bg-[#F4F7F5] text-[#0C2A1D]/60 transition hover:bg-[#E9EFEB] disabled:opacity-40"
          aria-label="إنقاص 250 مل"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={() => onChange(current + STEP)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#3B82F6]/10 py-2.5 text-[13px] font-bold text-[#2563EB] transition hover:bg-[#3B82F6]/15"
        >
          <Plus className="h-4 w-4" />
          كوب (0.25 لتر)
        </button>
      </div>
    </section>
  );
}