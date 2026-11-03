import { secrets } from "base44:runtime";

const MODEL = "gemini-3.5-flash";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

function apiKey() {
  const key = secrets.get("GEMINI_API_KEY");
  if (!key) throw new Error("مفتاح Gemini غير مُعد. أضف GEMINI_API_KEY من صفحة الأسرار.");
  return key;
}

function toBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function imagePart(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error("تعذر تحميل الصورة، حاول رفعها مرة أخرى.");
  const mimeType = (res.headers.get("content-type") || "image/jpeg").split(";")[0];
  const bytes = new Uint8Array(await res.arrayBuffer());
  return { inline_data: { mime_type: mimeType, data: toBase64(bytes) } };
}

export async function geminiGenerate({
  parts,
  jsonSchema,
  temperature = 0.5,
  maxOutputTokens = 2048,
  thinkingLevel = "low",
}) {
  const payload = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      thinkingConfig: { thinkingLevel },
      ...(jsonSchema ? { responseMimeType: "application/json", responseSchema: jsonSchema } : {}),
    },
  };

  const res = await fetch(`${ENDPOINT}/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey() },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(110000),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.error?.message || `Gemini API error (${res.status})`;
    throw new Error(`تعذر الاتصال بالذكاء الاصطناعي: ${message}`);
  }

  const candidate = data?.candidates?.[0];
  const text = (candidate?.content?.parts || [])
    .filter((part) => part && part.thought !== true)
    .map((part) => part?.text || "")
    .join("")
    .trim();
  if (!text) throw new Error("لم يصل رد من الذكاء الاصطناعي، حاول مرة أخرى.");
  return text;
}

export async function geminiJson({ parts, jsonSchema, temperature = 0.35 }) {
  const text = await geminiGenerate({ parts, jsonSchema, temperature });
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("تعذر قراءة نتيجة التحليل، حاول مرة أخرى.");
  }
}