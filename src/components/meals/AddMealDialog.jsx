import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Camera, PenLine, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { MEAL_TYPES } from "@/lib/nutrition";
import FoodPicker from "@/components/meals/FoodPicker";
import PhotoAnalyzer from "@/components/meals/PhotoAnalyzer";
import TextMealAnalyzer from "@/components/meals/TextMealAnalyzer";

const MODES = [
  { value: "search", label: "قاعدة الأطعمة", icon: Search },
  { value: "text", label: "افهم وجبتي", icon: Sparkles },
  { value: "photo", label: "صورة", icon: Camera },
  { value: "manual", label: "يدوي", icon: PenLine },
];

function defaultMealType() {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 16) return "lunch";
  if (hour < 21) return "dinner";
  return "snack";
}

export default function AddMealDialog({ open, onOpenChange, date, onSaved }) {
  const [mode, setMode] = useState("search");
  const [mealType, setMealType] = useState(defaultMealType());
  const [manual, setManual] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  const [saving, setSaving] = useState(false);

  const createMeal = async (data) => {
    setSaving(true);
    try {
      await base44.entities.Meal.create({
        date,
        meal_type: mealType,
        source: mode === "photo" ? "photo" : "manual",
        ...data,
      });
      onSaved();
      onOpenChange(false);
      setManual({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    } finally {
      setSaving(false);
    }
  };

  const submitManual = (e) => {
    e.preventDefault();
    if (!manual.name.trim() || !manual.calories) return;
    createMeal({
      name: manual.name.trim(),
      calories: Number(manual.calories) || 0,
      protein: Number(manual.protein) || 0,
      carbs: Number(manual.carbs) || 0,
      fat: Number(manual.fat) || 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto rounded-[26px] p-5" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right font-heading text-[18px] font-black text-[#0C2A1D]">
            إضافة وجبة
          </DialogTitle>
        </DialogHeader>

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

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {MODES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[11px] font-bold transition ${
                mode === value
                  ? "border-[#0F9D58] bg-[#0F9D58]/[0.07] text-[#0F9D58]"
                  : "border-[#EDF1EE] text-[#0C2A1D]/45 hover:border-[#0F9D58]/30"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {mode === "search" && <FoodPicker onAdd={createMeal} />}

          {mode === "text" && <TextMealAnalyzer onAdd={createMeal} />}

          {mode === "photo" && <PhotoAnalyzer onAdd={createMeal} />}

          {mode === "manual" && (
            <form onSubmit={submitManual} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="meal-name">اسم الوجبة</Label>
                <Input
                  id="meal-name"
                  value={manual.name}
                  onChange={(e) => setManual({ ...manual, name: e.target.value })}
                  placeholder="مثال: صدر دجاج مع أرز"
                  className="h-11 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cal">السعرات</Label>
                  <Input
                    id="cal"
                    type="number"
                    inputMode="numeric"
                    value={manual.calories}
                    onChange={(e) => setManual({ ...manual, calories: e.target.value })}
                    className="h-11 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="prot">بروتين (جم)</Label>
                  <Input
                    id="prot"
                    type="number"
                    inputMode="numeric"
                    value={manual.protein}
                    onChange={(e) => setManual({ ...manual, protein: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="carb">كربوهيدرات (جم)</Label>
                  <Input
                    id="carb"
                    type="number"
                    inputMode="numeric"
                    value={manual.carbs}
                    onChange={(e) => setManual({ ...manual, carbs: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fat">دهون (جم)</Label>
                  <Input
                    id="fat"
                    type="number"
                    inputMode="numeric"
                    value={manual.fat}
                    onChange={(e) => setManual({ ...manual, fat: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-[#0F9D58] py-3 text-[13px] font-bold text-white transition hover:bg-[#0C8650] disabled:opacity-60"
              >
                {saving ? "جارٍ الحفظ..." : "أضف الوجبة"}
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}