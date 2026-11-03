import { useState } from "react";
import { Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { MEAL_TYPES } from "@/lib/nutrition";
import { toISODate } from "@/lib/dates";
import TextMealAnalyzer from "@/components/meals/TextMealAnalyzer";

function defaultMealType() {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 16) return "lunch";
  if (hour < 21) return "dinner";
  return "snack";
}

export default function QuickMealAnalyzer({ onSaved }) {
  const [mealType, setMealType] = useState(defaultMealType());
  const [error, setError] = useState("");

  const save = async (meal) => {
    setError("");
    try {
      await base44.entities.Meal.create({
        date: toISODate(),
        meal_type: mealType,
        source: "manual",
        ...meal,
      });
      onSaved?.();
    } catch (err) {
      setError(err.message || "تعذر حفظ الوجبة، حاول مرة أخرى.");
    }
  };

  return (
    <section className="rounded-[26px] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(12,42,29,0.45)] ring-1 ring-black/[0.03]">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#0F9D58]/10 text-[#0F9D58]">
          <Sparkles className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <div>
          <h2 className="font-heading text-[15px] font-bold text-[#0C2A1D]">افهم وجبتي</h2>
          <p className="text-[10.5px] text-[#0C2A1D]/40">اكتب ما أكلته، عدّل الأوزان، ثم أضفها لسجل اليوم</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5 rounded-xl bg-[#F4F7F5] p-1">
        {MEAL_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setMealType(type.value)}
            className={`rounded-lg py-2 text-[11.5px] font-bold transition ${
              mealType === type.value ? "bg-white text-[#0F9D58] shadow-sm" : "text-[#0C2A1D]/45"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <TextMealAnalyzer onAdd={save} />
      </div>

      {error && <p className="mt-2 text-[12px] font-semibold text-rose-500">{error}</p>}
    </section>
  );
}