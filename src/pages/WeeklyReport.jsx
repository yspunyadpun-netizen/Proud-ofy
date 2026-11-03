import { useEffect, useState } from "react";
import { Flame, Droplets, Scale, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useProfile from "@/hooks/useProfile";
import CaloriesChart from "@/components/progress/CaloriesChart";
import { lastNDates, shortDate, longDate } from "@/lib/dates";

export default function WeeklyReport() {
  const { profile } = useProfile();
  const [state, setState] = useState({ meals: [], water: [], weights: [] });
  const [loading, setLoading] = useState(true);

  const days = lastNDates(7);
  const start = days[0];
  const end = days[days.length - 1];

  useEffect(() => {
    let active = true;
    async function load() {
      const [mealsPage, waterPage, weightsPage] = await Promise.all([
        base44.entities.Meal.filter({ date: { $gte: start } }, { limit: 200 }),
        base44.entities.WaterLog.filter({ date: { $gte: start } }, { limit: 30 }),
        base44.entities.WeightLog.filter({ date: { $gte: start } }, { sort: "date", limit: 30 }),
      ]);
      if (!active) return;
      setState({
        meals: mealsPage?.items || [],
        water: waterPage?.items || [],
        weights: weightsPage?.items || [],
      });
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [start]);

  const target = Number(profile?.daily_calories) || 0;

  const perDay = days.map((date) => {
    const calories = state.meals
      .filter((meal) => meal.date === date)
      .reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);
    return { date, label: shortDate(date), calories: Math.round(calories) };
  });

  const loggedDays = perDay.filter((day) => day.calories > 0);
  const avgCalories = loggedDays.length
    ? Math.round(loggedDays.reduce((sum, day) => sum + day.calories, 0) / loggedDays.length)
    : 0;

  const totalLiters = state.water.reduce((sum, log) => sum + (Number(log.liters) || 0), 0);
  const avgWater = Math.round((totalLiters / 7) * 10) / 10;

  const sortedWeights = [...state.weights].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const weightChange =
    sortedWeights.length >= 2
      ? Number(sortedWeights[sortedWeights.length - 1].weight) - Number(sortedWeights[0].weight)
      : null;

  const caloriesDiff = target ? avgCalories - target : 0;
  const waterTarget = Number(profile?.water_target) || 2.5;

  const insights = [];
  if (!loggedDays.length) {
    insights.push("لم تسجّل أي وجبة هذا الأسبوع — ابدأ بتسجيل وجبة واحدة يومياً لتحصل على تقرير دقيق.");
  } else if (target) {
    if (Math.abs(caloriesDiff) <= 150) {
      insights.push("سعراتك قريبة جداً من هدفك — استمر على هذا الانتظام.");
    } else if (caloriesDiff > 150) {
      insights.push(`متوسطك أعلى من هدفك بـ ${Math.round(caloriesDiff)} سعرة يومياً، حاول تقليل حجم الحصص قليلاً.`);
    } else {
      insights.push(`متوسطك أقل من هدفك بـ ${Math.round(Math.abs(caloriesDiff))} سعرة يومياً، تأكد أنك تأكل كفايتك.`);
    }
  }
  if (avgWater < waterTarget) {
    insights.push(`متوسط الماء ${avgWater} لتر يومياً مقابل هدف ${waterTarget} لتر.`);
  } else {
    insights.push(`ترطيبك ممتاز بمتوسط ${avgWater} لتر يومياً.`);
  }
  if (weightChange !== null) {
    insights.push(
      weightChange === 0
        ? "وزنك ثابت هذا الأسبوع."
        : weightChange < 0
        ? `انخفض وزنك ${Math.abs(weightChange).toFixed(1)} كجم هذا الأسبوع.`
        : `ارتفع وزنك ${weightChange.toFixed(1)} كجم هذا الأسبوع.`
    );
  }

  const stats = [
    {
      icon: Flame,
      label: "متوسط السعرات",
      value: avgCalories ? Math.round(avgCalories) : "—",
      unit: target ? `من ${target}` : "سعرة",
      tone: "text-[#0F9D58] bg-[#0F9D58]/10",
    },
    {
      icon: Droplets,
      label: "متوسط الماء",
      value: avgWater,
      unit: `من ${waterTarget} لتر`,
      tone: "text-[#0EA5E9] bg-[#0EA5E9]/10",
    },
    {
      icon: Scale,
      label: "تغير الوزن",
      value: weightChange === null ? "—" : `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)}`,
      unit: "كجم",
      tone: "text-[#E4A11B] bg-[#E4A11B]/10",
    },
  ];

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[11px] font-semibold text-[#0C2A1D]/40">التقرير الأسبوعي</p>
        <h1 className="mt-1 font-heading text-[22px] font-black tracking-tight text-[#0C2A1D]">
          حصيلة أسبوعك
        </h1>
        <p className="mt-0.5 text-[12px] text-[#0C2A1D]/45">
          {longDate(start)} — {longDate(end)}
        </p>
      </header>

      {loading ? (
        <div className="grid h-64 place-items-center rounded-[26px] bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0F9D58]/20 border-t-[#0F9D58]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            {stats.map(({ icon: Icon, label, value, unit, tone }) => (
              <div
                key={label}
                className="rounded-[24px] bg-white p-4 shadow-[0_18px_45px_-34px_rgba(12,42,29,0.5)] ring-1 ring-black/[0.03]"
              >
                <span className={`grid h-8 w-8 place-items-center rounded-xl ${tone}`}>
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <p className="mt-2.5 text-[10px] font-semibold text-[#0C2A1D]/40">{label}</p>
                <p className="mt-1 font-heading text-[22px] font-black leading-none text-[#0C2A1D]">
                  {value}
                  <span className="mr-1 text-[9.5px] font-semibold text-[#0C2A1D]/35">{unit}</span>
                </p>
              </div>
            ))}
          </div>

          <section className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-[14px] font-bold text-[#0C2A1D]">السعرات اليومية</h2>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#0C2A1D]/40">
                {caloriesDiff === 0 ? null : caloriesDiff > 0 ? (
                  <TrendingUp className="h-3 w-3 text-[#E4A11B]" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-[#0F9D58]" />
                )}
                {loggedDays.length} أيام مسجلة
              </span>
            </div>
            <CaloriesChart data={perDay} target={target} />
          </section>

          <section className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#0F9D58]/10 text-[#0F9D58]">
                <Lightbulb className="h-4 w-4" />
              </span>
              <h2 className="font-heading text-[14px] font-bold text-[#0C2A1D]">ملاحظات المدرب</h2>
            </div>
            <ul className="mt-3 space-y-2">
              {insights.map((insight) => (
                <li key={insight} className="flex gap-2 rounded-xl bg-[#F7FAF8] px-3.5 py-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F9D58]" />
                  <span className="text-[12px] leading-relaxed text-[#0C2A1D]/65">{insight}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}