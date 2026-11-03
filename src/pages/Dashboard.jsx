import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, ArrowLeft, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useProfile from "@/hooks/useProfile";
import CalorieCard from "@/components/dashboard/CalorieCard";
import WaterCard from "@/components/dashboard/WaterCard";
import QuickMealAnalyzer from "@/components/dashboard/QuickMealAnalyzer";
import { sumMacros } from "@/lib/nutrition";
import { toISODate, longDate } from "@/lib/dates";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "صباح الخير";
  if (hour < 17) return "نهارك سعيد";
  return "مساء الخير";
}

export default function Dashboard() {
  const { profile } = useProfile();
  const today = toISODate();
  const [meals, setMeals] = useState([]);
  const [liters, setLiters] = useState(0);
  const [waterId, setWaterId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [mealsPage, waterPage] = await Promise.all([
      base44.entities.Meal.filter({ date: today }, { limit: 50 }),
      base44.entities.WaterLog.filter({ date: today }, { limit: 1 }),
    ]);
    setMeals(mealsPage?.items || []);
    const water = waterPage?.items?.[0];
    setWaterId(water?.id || null);
    setLiters(Number(water?.liters) || 0);
    setLoading(false);
  }, [today]);

  useEffect(() => {
    load();
  }, [load]);

  const changeWater = async (next) => {
    const value = Math.max(0, Math.round(next * 100) / 100);
    setLiters(value);
    if (waterId) {
      await base44.entities.WaterLog.update(waterId, { liters: value });
    } else {
      const record = await base44.entities.WaterLog.create({ date: today, liters: value });
      setWaterId(record.id);
    }
  };

  const macros = sumMacros(meals);
  const totals = { ...macros, mealCount: meals.length };
  const name = profile?.full_name?.trim();

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-[#0C2A1D]/40">{longDate(today)}</p>
          <h1 className="mt-1 font-heading text-[22px] font-black tracking-tight text-[#0C2A1D]">
            {greeting()}
            {name ? `، ${name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-[12px] text-[#0C2A1D]/45">
            {profile?.goal === "lose"
              ? "خطوة صغيرة اليوم أفضل من خطة مثالية غداً."
              : profile?.goal === "gain"
              ? "كل جرام بروتين يقرّبك من هدفك."
              : "استمر في التوازن، جسمك يشكرك."}
          </p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#0F9D58] shadow-sm">
          <Sparkles className="h-5 w-5" />
        </span>
      </header>

      {loading ? (
        <div className="grid h-56 place-items-center rounded-[28px] bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0F9D58]/20 border-t-[#0F9D58]" />
        </div>
      ) : (
        <>
          <CalorieCard totals={totals} profile={profile} />

          <WaterCard liters={liters} target={profile?.water_target} onChange={changeWater} />

          <Link
            to="/report"
            className="flex items-center justify-between rounded-[26px] bg-[#0C2A1D] px-5 py-4 text-white transition hover:bg-[#0C2A1D]/92"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
                <ClipboardList className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-heading text-[14px] font-bold">تقريرك الأسبوعي</span>
                <span className="block text-[11px] text-white/50">سعراتك، التزامك، وماءك في صفحة واحدة</span>
              </span>
            </span>
            <ArrowLeft className="h-4 w-4 text-white/60" />
          </Link>

          <QuickMealAnalyzer onSaved={load} />
        </>
      )}
    </div>
  );
}