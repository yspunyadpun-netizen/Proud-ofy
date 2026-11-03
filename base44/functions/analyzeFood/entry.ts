import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { geminiJson, imagePart } from '../../shared/gemini.ts';

const SCHEMA = {
  type: "OBJECT",
  properties: {
    meal_name: { type: "STRING", description: "اسم قصير للوجبة من 3 إلى 6 كلمات" },
    items: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          quantity: { type: "STRING" },
          grams: { type: "NUMBER", description: "وزن العنصر بالجرام" },
          calories: { type: "NUMBER" },
          protein: { type: "NUMBER" },
          carbs: { type: "NUMBER" },
          fat: { type: "NUMBER" },
        },
        required: ["name", "quantity", "grams", "calories", "protein", "carbs", "fat"],
      },
    },
    note: { type: "STRING", description: "ملاحظة قصيرة عن التقدير" },
  },
  required: ["meal_name", "items"],
};

const RULES = `حدد كل طبق أو عنصر غذائي، وقدّر الكمية بالجرام أو بالحصة (مثل: "طبق متوسط ~250 جم"، "كوب واحد")، واكتب وزن كل عنصر بالجرام في الحقل grams (مثال: 40 لشريحة خبز، 250 لطبق متوسط).
احسب السعرات والبروتين والكربوهيدرات والدهون لكل عنصر على حدة بشكل تقديري واقعي (الخبز الأبيض: شريحة واحدة ~40 جم، ملعقة جبن كريمي ~15 جم، إلخ).
اكتب أسماء الأطباق بالعربية الفصحى المبسطة.
اجعل اسم الوجبة وصفاً قصيراً (3-6 كلمات).`;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const imageUrl = typeof body?.image_url === "string" ? body.image_url : "";
    const description = typeof body?.text === "string" ? body.text.trim().slice(0, 500) : "";
    const note = typeof body?.note === "string" ? body.note.slice(0, 300) : "";

    if (!imageUrl && !description) {
      return Response.json({ error: "image_url or text is required" }, { status: 400 });
    }
    if (imageUrl && !imageUrl.startsWith("http")) {
      return Response.json({ error: "image_url is required" }, { status: 400 });
    }

    let parts;
    if (imageUrl) {
      parts = [
        {
          text: `أنت خبير تغذية. حلّل صورة الطعام المرفقة بدقة.
${RULES}
${note ? `ملاحظة من المستخدم عن الوجبة: ${note}` : ""}
إذا لم تكن الصورة طعاماً، أعد عنصراً واحداً باسم "غير محدد" مع قيم صفرية وضّح في note أن الصورة غير واضحة.`,
        },
        await imagePart(imageUrl),
      ];
    } else {
      parts = [
        {
          text: `أنت خبير تغذية. المستخدم وصف وجبته بالكلمات التالية: "${description}".
${RULES}
إذا لم يذكر المستخدم الكمية، افترض حصة معتادة متوسطة لشخص بالغ.
${note ? `ملاحظة إضافية: ${note}` : ""}
إذا كان الوصف لا يذكر أي طعام، أعد عنصراً واحداً باسم "غير محدد" مع قيم صفرية واشرح ذلك في note.`,
        },
      ];
    }

    const result = await geminiJson({ parts, jsonSchema: SCHEMA, temperature: 0.35 });

    const items = Array.isArray(result?.items) ? result.items : [];
    const totals = items.reduce(
      (acc, item) => {
        acc.calories += Number(item.calories) || 0;
        acc.protein += Number(item.protein) || 0;
        acc.carbs += Number(item.carbs) || 0;
        acc.fat += Number(item.fat) || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return Response.json({
      meal_name: result?.meal_name || (imageUrl ? "وجبة من صورة" : "وجبة بوصف نصي"),
      note: result?.note || "",
      items: items.map((item) => ({
        name: String(item.name || "عنصر"),
        quantity: String(item.quantity || ""),
        grams: Math.round(Number(item.grams) || 0),
        calories: Math.round(Number(item.calories) || 0),
        protein: Math.round(Number(item.protein) || 0),
        carbs: Math.round(Number(item.carbs) || 0),
        fat: Math.round(Number(item.fat) || 0),
      })),
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fat: Math.round(totals.fat),
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}