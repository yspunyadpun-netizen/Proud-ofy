import { useMemo, useState } from "react";
import { Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchFoods, scaleFood } from "@/lib/foods";

export default function FoodPicker({ onAdd }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [grams, setGrams] = useState("100");

  const results = useMemo(() => searchFoods(query), [query]);

  const preview = selected ? scaleFood(selected, grams) : null;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0C2A1D]/30" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن طعام... مثال: دجاج"
          className="h-12 rounded-xl bg-[#F7FAF8] pr-10"
        />
      </div>

      <div className="max-h-56 space-y-1.5 overflow-y-auto pl-1">
        {results.map((food) => (
          <button
            key={food.name}
            type="button"
            onClick={() => setSelected(food)}
            className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-right transition ${
              selected?.name === food.name
                ? "border-[#0F9D58] bg-[#0F9D58]/[0.06]"
                : "border-transparent bg-[#F7FAF8] hover:bg-[#F1F5F2]"
            }`}
          >
            <span className="text-[13px] font-semibold text-[#0C2A1D]">{food.name}</span>
            <span className="text-[11px] text-[#0C2A1D]/40">{food.cal} سعرة / 100جم</span>
          </button>
        ))}
        {results.length === 0 && (
          <p className="py-6 text-center text-[12px] text-[#0C2A1D]/40">لا يوجد طعام بهذا الاسم — جرّب الإضافة اليدوية.</p>
        )}
      </div>

      {selected && (
        <div className="rounded-2xl bg-[#0F9D58]/[0.06] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-[#0C2A1D]">{selected.name}</p>
            <div className="flex items-center gap-2">
              <Input
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                type="number"
                inputMode="numeric"
                className="h-9 w-20 rounded-lg bg-white text-center"
              />
              <span className="text-[11px] font-semibold text-[#0C2A1D]/45">جرام</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[
              { label: "سعرة", value: preview.calories },
              { label: "بروتين", value: `${preview.protein}ج` },
              { label: "كارب", value: `${preview.carbs}ج` },
              { label: "دهون", value: `${preview.fat}ج` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white py-2">
                <p className="font-heading text-[13px] font-black text-[#0C2A1D]">{item.value}</p>
                <p className="text-[9.5px] text-[#0C2A1D]/40">{item.label}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              onAdd({
                name: `${selected.name} (${grams || 0}جم)`,
                calories: preview.calories,
                protein: preview.protein,
                carbs: preview.carbs,
                fat: preview.fat,
                items: [{ name: selected.name, quantity: `${grams}جم`, ...preview }],
              });
              setSelected(null);
              setQuery("");
              setGrams("100");
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F9D58] py-3 text-[13px] font-bold text-white transition hover:bg-[#0C8650]"
          >
            <Check className="h-4 w-4" />
            أضف هذه الوجبة
          </button>
        </div>
      )}
    </div>
  );
}