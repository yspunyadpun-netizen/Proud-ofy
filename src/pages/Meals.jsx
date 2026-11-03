import { useCallback, useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Plus, Flame, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useProfile from "@/hooks/useProfile";
import AddMealDialog from "@/components/meals/AddMealDialog";
import MealCard from "@/components/meals/MealCard";
import { MEAL_TYPES, sumMacros } from "@/lib/nutrition";
import { addDays, dayLabel, longDate, toISODate } from "@/lib/dates";

export default function Meals() {
  const { profile } = useProfile();
  const [date, setDate] = useState(toISODate());
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const page = await base44.entities.Meal.filter({ date }, { sort: "-created_date", limit: 50 });
    setMeals(page?.items || []);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (meal) => {
    setMeals((prev) => prev.filter((item) => item.id !== meal.id));
    await base44.entities.Meal.delete(meal.id);
  };

  const totals = sumMacros(meals);
  const target = Number(profile?.daily_calories) || 0;
  const pct = target ? Math.min(100, Math.round((totals.calories / target) * 100)) : 0;
  const remaining = Math.max(0, target - totals.calories);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[22px] font-black tracking-tight text-[#0C2A1D]">وجباتي</h1>
          <p className="mt-0.5 text-[12px] text-[#0C2A1D]/45">{longDate(date)}</p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-[#0F9D58] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_14px_28px_-16px_rgba(15,157,88,0.9)] transition hover:bg-[#0C8650]"
        >
          <Plus className="h-4 w-4" />
          وجبة
        </button>
      </header>

      <div className="flex items-center justify-between rounded-2xl bg-white px-2 py-2 shadow-sm ring-1 ring-black/[0.03]">
        <button
          onClick={() => setDate(addDays(date, 1))}
          disabled={date >= toISODate()}
          className="grid h-9 w-9 place-items-center rounded-xl text-[#0C2A1D]/50 transition hover:bg-[#F4F7F5] disabled:opacity-30"
          aria-label="اليوم التالي"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button onClick={() => setDate(toISODate())} className="px-3 font-heading text-[13px] font-bold text-[#0C2A1D]">
          {dayLabel(date)}
        </button>
        <button
          onClick={() => setDate(addDays(date, -1))}
          className="grid h-9 w-9 place-items-center rounded-xl text-[#0C2A1D]/50 transition hover:bg-[#F4F7F5]"
          aria-label="اليوم السابق"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <section className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#0C2A1D]/40">المستهلك</p>
            <p className="mt-1 font-heading text-[26px] font-black leading-none text-[#0C2A1D]">
              {Math.round(totals.calories)}
              <span className="mr-1 text-[11px] font-semibold text-[#0C2A1D]/35">/ {target} سعرة</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0F9D58]/10 px-3 py-1.5 text-[11px] font-bold text-[#0F9D58]">
            <Flame className="h-3 w-3" />
            متبقي {Math.round(remaining)}
          </span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#EEF3EF]">
          <div
            className="h-full rounded-full bg-gradient-to-l from-[#12B268] to-[#0F9D58] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "بروتين", value: totals.protein, target: profile?.protein_target },
            { label: "كربوهيدرات", value: totals.carbs, target: profile?.carbs_target },
            { label: "دهون", value: totals.fat, target: profile?.fat_target },
          ].map((macro) => (
            <div key={macro.label} className="rounded-xl bg-[#F7FAF8] py-2">
              <p className="font-heading text-[13px] font-black text-[#0C2A1D]">
                {Math.round(macro.value)}
                <span className="text-[9px] font-semibold text-[#0C2A1D]/35"> / {macro.target || 0}ج</span>
              </p>
              <p className="text-[9.5px] text-[#0C2A1D]/40">{macro.label}</p>
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="grid h-32 place-items-center">
          <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#0F9D58]/20 border-t-[#0F9D58]" />
        </div>
      ) : meals.length === 0 ? (
        <div className="rounded-[26px] bg-white p-8 text-center shadow-sm ring-1 ring-black/[0.03]">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#0F9D58]/8 text-[#0F9D58]">
            <Target className="h-6 w-6" />
          </span>
          <p className="mt-4 font-heading text-[14px] font-bold text-[#0C2A1D]">لا توجد وجبات مسجلة</p>
          <p className="mt-1 text-[12px] text-[#0C2A1D]/45">
            ابدأ بإضافة وجبة من قاعدة الأطعمة أو التقط صورة لطعامك.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {MEAL_TYPES.map((type) => {
            const group = meals.filter((meal) => meal.meal_type === type.value);
            if (group.length === 0) return null;
            const groupCalories = group.reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);
            return (
              <section
                key={type.value}
                className="rounded-[26px] bg-white p-4 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]"
              >
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <h2 className="font-heading text-[13px] font-bold text-[#0C2A1D]">{type.label}</h2>
                  <span className="text-[11px] font-semibold text-[#0C2A1D]/35">{Math.round(groupCalories)} سعرة</span>
                </div>
                <div className="space-y-1.5">
                  {group.map((meal) => (
                    <MealCard key={meal.id} meal={meal} onDelete={remove} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <AddMealDialog open={dialogOpen} onOpenChange={setDialogOpen} date={date} onSaved={load} />
    </div>
  );
}