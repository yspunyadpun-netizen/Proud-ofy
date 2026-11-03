import { Flame, Plus, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import ProgressRing from "@/components/ProgressRing";
import MacroBar from "@/components/dashboard/MacroBar";

export default function CalorieCard({ totals, profile }) {
  const target = Number(profile?.daily_calories) || 0;
  const consumed = totals.calories || 0;
  const remaining = Math.max(0, target - consumed);
  const over = consumed > target && target > 0;

  return (
    <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0B7A45] via-[#0F9D58] to-[#12B268] p-5 text-white shadow-[0_25px_55px_-30px_rgba(11,122,69,0.85)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-white/60">رصيد السعرات اليوم</p>
          <h2 className="mt-1 font-heading text-[17px] font-bold">سعراتك المستهلكة</h2>
        </div>
        <Link
          to="/meals"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-[11px] font-bold backdrop-blur-sm transition hover:bg-white/25"
        >
          <Plus className="h-3.5 w-3.5" />
          أضف وجبة
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <ProgressRing
          value={consumed}
          target={target}
          size={132}
          stroke={11}
          color="#FFFFFF"
          track="rgba(255,255,255,0.22)"
        >
          <span className="font-heading text-[26px] font-black leading-none">{Math.round(consumed)}</span>
          <span className="mt-1 text-[10px] font-semibold text-white/60">من {target} سعرة</span>
        </ProgressRing>

        <div className="flex-1 space-y-2.5">
          <div className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/60">
              <Flame className="h-3 w-3" />
              {over ? "تجاوزت هدفك بـ" : "المتبقي لك اليوم"}
            </div>
            <p className="mt-0.5 font-heading text-[20px] font-black leading-none">
              {over ? Math.round(consumed - target) : Math.round(remaining)}
              <span className="mr-1 text-[11px] font-semibold text-white/60">سعرة</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl bg-white/12 px-4 py-2.5 text-[11px] text-white/70 backdrop-blur-sm">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            {totals.mealCount} وجبة مسجلة اليوم
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3 rounded-2xl bg-white/95 p-4 text-[#0C2A1D]">
        <MacroBar label="بروتين" value={totals.protein} target={profile?.protein_target || 0} barClass="bg-[#0F9D58]" />
        <MacroBar label="كربوهيدرات" value={totals.carbs} target={profile?.carbs_target || 0} barClass="bg-[#E4A11B]" />
        <MacroBar label="دهون" value={totals.fat} target={profile?.fat_target || 0} barClass="bg-[#3B82F6]" />
      </div>
    </section>
  );
}