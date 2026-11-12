import { toISODate, addDays } from '../../shared/dates.ts';
import { geminiGenerate } from '../../shared/gemini.ts';

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) return Response.json({ error: "message is required" }, { status: 400 });
    if (message.length > 1000) return Response.json({ error: "message too long" }, { status: 400 });

    const today = toISODate();
    const weekAgo = addDays(today, -6);

    const [profiles, mealsPage, weightsPage] = await Promise.all([
      base44.entities.Profile.filter({}, { sort: "-created_date", limit: 1 }),
      base44.entities.Meal.filter({ date: { $gte: weekAgo } }, { sort: "-date", limit: 60 }),
      base44.entities.WeightLog.filter({}, { sort: "-date", limit: 8 }),
    ]);

    const profile = profiles?.items?.[0] || null;
    const meals = mealsPage?.items || [];
    const weights = weightsPage?.items || [];

    const todayMeals = meals.filter((m) => m.date === today);
    const todayTotals = todayMeals.reduce(
      (acc, m) => {
        acc.calories += Number(m.calories) || 0;
        acc.protein += Number(m.protein) || 0;
        acc.carbs += Number(m.carbs) || 0;
        acc.fat += Number(m.fat) || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const context = [
      profile
        ? `بيانات المستخدم: العمر ${profile.age || "غير محدد"}، الجنس ${profile.gender === "female" ? "أنثى" : "ذكر"}، الطول ${profile.height || "؟"} سم، الوزن الحالي ${profile.weight || "؟"} كجم، وزن الهدف ${profile.target_weight || "غير محدد"} كجم، الهدف ${profile.goal === "lose" ? "خسارة الدهون" : profile.goal === "gain" ? "بناء العضلات" : "الحفاظ على الوزن"}.`
        : "المستخدم لم يكمل ملفه الشخصي بعد.",
      profile
        ? `هدفه اليومي: ${profile.daily_calories || 0} سعرة، بروتين ${profile.protein_target || 0} جم، كربوهيدرات ${profile.carbs_target || 0} جم، دهون ${profile.fat_target || 0} جم، ماء ${profile.water_target || 0} لتر.`
        : "",
      `سعرات اليوم: ${Math.round(todayTotals.calories)} سعرة (بروتين ${Math.round(todayTotals.protein)}، كربوهيدرات ${Math.round(todayTotals.carbs)}، دهون ${Math.round(todayTotals.fat)}).`,
      todayMeals.length
        ? `وجبات اليوم: ${todayMeals.map((m) => `${m.name} (${Math.round(m.calories)} سعرة)`).join("، ")}.`
        : "لم يسجل المستخدم أي وجبة اليوم.",
      weights.length
        ? `آخر قياسات الوزن: ${weights.map((w) => `${w.date}: ${w.weight} كجم`).join("، ")}.`
        : "لا توجد قياسات وزن مسجلة.",
    ]
      .filter(Boolean)
      .join("\n");

    const reply = await geminiGenerate({
      temperature: 0.7,
      parts: [
        {
          text: `أنت "آيبي" المدرب الذكي في تطبيق I PROUD OF YOU لتغذية ولياقة وبناء العضلات.
تحدث بالعربية الفصحى المبسطة، بأسلوب مدرب محترف ودود ومحفّز ومباشر.
استخدم بيانات المستخدم الحقيقية أدناه حصراً عند الحديث عن أرقامه، ولا تختلق أرقاماً غير موجودة.
أجب بإيجاز (من 2 إلى 6 أسطر أو نقاط قصيرة)، واقترح خطوة عملية واحدة قابلة للتنفيذ الآن.
لا تقدم تشخيصاً طبياً؛ إن ذُكر مرض أو دواء فانصح بمراجعة طبيب. لا تطلب بيانات شخصية حساسة.

--- بيانات المستخدم ---
${context}
--- نهاية البيانات ---

سؤال المستخدم: ${message}`,
        },
      ],
    });

    return Response.json({ reply: reply || "لم أتمكن من الإجابة الآن، حاول مرة أخرى." });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
