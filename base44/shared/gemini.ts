
const MODEL = "gemini-2.5-flash";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

function apiKey() {
  const key = (globalThis as any).GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY غير مُعد في Cloudflare.");
  return key;
}

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export async function imagePart(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("تعذر تحميل الصورة.");
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
}: {
  parts: any[];
  jsonSchema?: any;
  temperature?: number;
  maxOutputTokens?: number;
  thinkingLevel?: string;
}) {
  const payload = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      ...(jsonSchema ? {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      } : {}),
    },
  };

  const res = await fetch(`${ENDPOINT}/${MODEL}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json() as any;
  if (!res.ok) {
    throw new Error(data?.error?.message || `Gemini API error (${res.status})`);
  }

  const text = (data?.candidates?.[0]?.content?.parts || [])
    .filter((p: any) => p && p.thought !== true)
    .map((p: any) => p?.text || "")
    .join("").trim();

  if (!text) throw new Error("لم يصل رد من Gemini.");
  return text;
}

export async function geminiJson({ parts, jsonSchema, temperature = 0.35 }: {
  parts: any[];
  jsonSchema: any;
  temperature?: number;
}) {
  const text = await geminiGenerate({ parts, jsonSchema, temperature });
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned);
}
