import { useMemo, useState } from "react";
import { Check, RotateCcw, Sparkles } from "lucide-react";
import AnalyzedItemRow from "@/components/meals/AnalyzedItemRow";

function scaleItem(item) {
  const base = Number(item.base_grams) || 0;
  const grams = Number(item.grams) || 0;
  const ratio = base > 0 ? grams / base : 1;
  return {
    calories: Math.round((Number(item.calories) || 0) * ratio),
    protein: Math.round((Number(item.protein) || 0) * ratio),
    carbs: Math.round((Number(item.carbs) || 0) * ratio),
    fat: Math.round((Number(item.fat) || 0) * ratio),
  };
}

export default function MealAnalysisResult({ result, onAdd, onReset }) {
  const [items, setItems] = useState(() =>
    (result.items || []).map((item) => ({ ...item, base_grams: Number(item.grams) || 0 }))
  );

  const scaled = useMemo(() => items.map(scaleItem), [items]);
  const totals = useMemo(
    () =>
      scaled.reduce(
        (acc, item) => {
          acc.calories += item.calories;
          acc.protein += item.protein;
          acc.carbs += item.carbs;
          acc.fat += item.fat;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [scaled]
  );

  const changeGrams = (index, value) => {
    const grams = Math.max(0, Math.round(Number(value) || 0));
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, grams, quantity: `${grams} جم` } : item))
    );
  };

  const add = () =>
    onAdd({
      name: result.meal_name,
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
      items: items.map((item, index) => ({
        name: item.name,
        quantity: item.quantity,
        grams: Number(item.grams) || 0,
        ...scaled[index],
      })),
      image_uri: result.file_uri,
    });

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-[#0F9D58]/[0.06] p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#0F9D58]">
          <Sparkles className="h-3.5 w-3.5" />
          تم التحليل — عدّل وزن أي مكوّن
        </div>
        <p className="mt-2 font-heading text-[15px] font-bold text-[#0C2A1D]">{result.meal_name}</p>
        <div className="mt-3 space-y-1.5">
          {items.map((item, index) => (
            <AnalyzedItemRow
              key={`${item.name}-${index}`}
              item={item}
              calories={scaled[index].calories}
              onChangeGrams={(value) => changeGrams(index, value)}
            />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {[
            { label: "سعرة", value: totals.calories },
            { label: "بروتين", value: `${totals.protein}ج` },
            { label: "كارب", value: `${totals.carbs}ج` },
            { label: "دهون", value: `${totals.fat}ج` },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white py-2">
              <p className="font-heading text-[13px] font-black text-[#0C2A1D]">{item.value}</p>
              <p className="text-[9.5px] text-[#0C2A1D]/40">{item.label}</p>
            </div>
          ))}
        </div>
        {result.note && <p className="mt-2.5 text-[10.5px] leading-relaxed text-[#0C2A1D]/45">{result.note}</p>}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={add}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F9D58] py-3 text-[13px] font-bold text-white transition hover:bg-[#0C8650]"
        >
          <Check className="h-4 w-4" />
          أضف الوجبة
        </button>
        <button
          type="button"
          onClick={onReset}
          className="grid h-11 w-11 place-items-center rounded-xl bg-[#F4F7F5] text-[#0C2A1D]/50 transition hover:bg-[#E9EFEB]"
          aria-label="تحليل جديد"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}