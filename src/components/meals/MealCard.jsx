import { UtensilsCrossed, Trash2 } from "lucide-react";
import { MEAL_TYPE_LABELS } from "@/lib/nutrition";

export default function MealCard({ meal, onDelete }) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl bg-[#F9FBFA] px-3.5 py-3 transition hover:bg-[#F4F7F5]">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#0F9D58] shadow-sm">
        {meal.source === "photo" ? <span className="text-[13px]">📷</span> : <UtensilsCrossed className="h-4 w-4" />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-[13px] font-bold text-[#0C2A1D]">{meal.name}</p>
        <p className="mt-0.5 text-[10.5px] text-[#0C2A1D]/40">
          {MEAL_TYPE_LABELS[meal.meal_type] || "وجبة"} • بروتين {Math.round(meal.protein || 0)}ج • كارب{" "}
          {Math.round(meal.carbs || 0)}ج • دهون {Math.round(meal.fat || 0)}ج
        </p>
      </div>

      <div className="flex items-center gap-1">
        <span className="whitespace-nowrap font-heading text-[13px] font-black text-[#0C2A1D]">
          {Math.round(meal.calories || 0)}
          <span className="text-[9px] font-semibold text-[#0C2A1D]/35"> سعرة</span>
        </span>
        {onDelete && (
          <button
            onClick={() => onDelete(meal)}
            aria-label="حذف الوجبة"
            className="grid h-8 w-8 place-items-center rounded-lg text-[#0C2A1D]/25 transition hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}