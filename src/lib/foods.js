// قاعدة أطعمة مبسطة — القيم لكل 100 جرام
export const FOODS = [
  { name: "خبز بلدي", cal: 265, p: 8, c: 53, f: 1.5 },
  { name: "خبز أسمر", cal: 247, p: 9, c: 41, f: 3.4 },
  { name: "أرز أبيض مطبوخ", cal: 130, p: 2.7, c: 28, f: 0.3 },
  { name: "أرز بني مطبوخ", cal: 123, p: 2.6, c: 26, f: 1 },
  { name: "معكرونة مطبوخة", cal: 158, p: 5.8, c: 31, f: 0.9 },
  { name: "بطاطس مسلوقة", cal: 87, p: 2, c: 20, f: 0.1 },
  { name: "بطاطا حلوة", cal: 86, p: 1.6, c: 20, f: 0.1 },
  { name: "شوفان", cal: 389, p: 17, c: 66, f: 7 },
  { name: "كورن فليكس", cal: 357, p: 7, c: 84, f: 0.4 },
  { name: "بيض", cal: 143, p: 13, c: 1.1, f: 9.5 },
  { name: "بياض بيض", cal: 52, p: 11, c: 0.7, f: 0.2 },
  { name: "صدر دجاج", cal: 165, p: 31, c: 0, f: 3.6 },
  { name: "فخذ دجاج", cal: 209, p: 26, c: 0, f: 11 },
  { name: "لحم بقري مفروم", cal: 250, p: 26, c: 0, f: 15 },
  { name: "ستيك لحم", cal: 271, p: 25, c: 0, f: 19 },
  { name: "كبدة", cal: 135, p: 20, c: 4, f: 4 },
  { name: "سمك سلمون", cal: 208, p: 20, c: 0, f: 13 },
  { name: "تونة معلبة بالماء", cal: 116, p: 26, c: 0, f: 1 },
  { name: "سردين", cal: 208, p: 25, c: 0, f: 11 },
  { name: "جمبري", cal: 99, p: 24, c: 0, f: 0.3 },
  { name: "جبن قريش", cal: 98, p: 11, c: 3.4, f: 4.3 },
  { name: "جبن أبيض", cal: 264, p: 14, c: 4, f: 21 },
  { name: "حليب كامل", cal: 61, p: 3.2, c: 4.8, f: 3.3 },
  { name: "زبادي طبيعي", cal: 59, p: 10, c: 3.6, f: 0.4 },
  { name: "لبن رائب", cal: 40, p: 3.3, c: 4.7, f: 0.9 },
  { name: "بروتين واي", cal: 380, p: 76, c: 8, f: 4 },
  { name: "عدس مطبوخ", cal: 116, p: 9, c: 20, f: 0.4 },
  { name: "فول مدمس", cal: 110, p: 7.6, c: 19, f: 0.4 },
  { name: "حمص مسلوق", cal: 164, p: 8.9, c: 27, f: 2.6 },
  { name: "فاصوليا بيضاء", cal: 127, p: 8.7, c: 22, f: 0.5 },
  { name: "طماطم", cal: 18, p: 0.9, c: 3.9, f: 0.2 },
  { name: "خيار", cal: 15, p: 0.7, c: 3.6, f: 0.1 },
  { name: "جرجير / خضار ورقية", cal: 25, p: 2.6, c: 3.7, f: 0.3 },
  { name: "أفوكادو", cal: 160, p: 2, c: 8.5, f: 15 },
  { name: "موز", cal: 89, p: 1.1, c: 23, f: 0.3 },
  { name: "تفاح", cal: 52, p: 0.3, c: 14, f: 0.2 },
  { name: "برتقال", cal: 47, p: 0.9, c: 12, f: 0.1 },
  { name: "تمر", cal: 282, p: 2.5, c: 75, f: 0.4 },
  { name: "لوز", cal: 579, p: 21, c: 22, f: 50 },
  { name: "جوز", cal: 654, p: 15, c: 14, f: 65 },
  { name: "زيت زيتون", cal: 884, p: 0, c: 0, f: 100 },
  { name: "زبدة فول سوداني", cal: 588, p: 25, c: 20, f: 50 },
  { name: "عسل", cal: 304, p: 0.3, c: 82, f: 0 },
  { name: "شوكولاتة داكنة", cal: 546, p: 4.9, c: 61, f: 31 },
  { name: "مقليات", cal: 320, p: 12, c: 30, f: 17 },
  { name: "شاورما دجاج", cal: 210, p: 16, c: 18, f: 8 },
  { name: "بيتزا", cal: 266, p: 11, c: 33, f: 10 },
  { name: "رقائق شيبس", cal: 536, p: 7, c: 53, f: 34 },
  { name: "مشروب غازي", cal: 42, p: 0, c: 10.6, f: 0 },
  { name: "قهوة بالحليب", cal: 55, p: 3, c: 5, f: 2.5 },
];

export function searchFoods(query) {
  const q = (query || "").trim();
  if (!q) return FOODS.slice(0, 20);
  return FOODS.filter((f) => f.name.includes(q)).slice(0, 20);
}

export function scaleFood(food, grams) {
  const g = Number(grams) || 0;
  const ratio = g / 100;
  return {
    calories: Math.round(food.cal * ratio),
    protein: Math.round(food.p * ratio),
    carbs: Math.round(food.c * ratio),
    fat: Math.round(food.f * ratio),
  };
}