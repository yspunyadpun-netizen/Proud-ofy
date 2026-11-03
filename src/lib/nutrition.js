export const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "قليل الحركة (عمل مكتبي)", factor: 1.2 },
  { value: "light", label: "نشاط خفيف (1-2 يوم أسبوعياً)", factor: 1.375 },
  { value: "moderate", label: "نشاط متوسط (3-4 أيام)", factor: 1.55 },
  { value: "active", label: "نشاط عالٍ (5-6 أيام)", factor: 1.725 },
  { value: "very_active", label: "نشاط شديد (تدريب يومي)", factor: 1.9 },
];

export const GOALS = [
  { value: "lose", label: "خسارة الدهون" },
  { value: "maintain", label: "الحفاظ على الوزن" },
  { value: "gain", label: "بناء العضلات" },
];

export const MEAL_TYPES = [
  { value: "breakfast", label: "فطور" },
  { value: "lunch", label: "غداء" },
  { value: "dinner", label: "عشاء" },
  { value: "snack", label: "سناك" },
];

export const GOAL_LABELS = {
  lose: "خسارة الدهون",
  maintain: "الحفاظ على الوزن",
  gain: "بناء العضلات",
};

export const ACTIVITY_LABELS = ACTIVITY_LEVELS.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

export const MEAL_TYPE_LABELS = MEAL_TYPES.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

export function calculateTargets({ gender, weight, height, age, activity_level, goal }) {
  const w = Number(weight) || 0;
  const h = Number(height) || 0;
  const a = Number(age) || 0;
  if (!w || !h || !a) return { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 };

  const bmr = gender === "female"
    ? 10 * w + 6.25 * h - 5 * a - 161
    : 10 * w + 6.25 * h - 5 * a + 5;

  const level = ACTIVITY_LEVELS.find((l) => l.value === activity_level);
  const tdee = bmr * (level ? level.factor : 1.55);
  const adjust = goal === "lose" ? -450 : goal === "gain" ? 300 : 0;
  const calories = Math.max(1200, Math.round((tdee + adjust) / 10) * 10);

  const protein = Math.round(w * (goal === "lose" ? 2.2 : goal === "lose" ? 2.2 : 1.9));
  const fat = Math.round((calories * 0.27) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  const water = Math.max(2, Math.round(w * 0.035 * 10) / 10);

  return { calories, protein, carbs, fat, water };
}

export const clampNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export function sumMacros(meals = []) {
  return meals.reduce(
    (acc, m) => {
      acc.calories += clampNumber(m.calories);
      acc.protein += clampNumber(m.protein);
      acc.carbs += clampNumber(m.carbs);
      acc.fat += clampNumber(m.fat);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function macroPercent(value, target) {
  if (!target) return 0;
  return Math.min(100, Math.round((value / target) * 100));
}