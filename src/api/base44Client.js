
import { appParams } from "@/lib/app-params";

const apiBaseUrl = appParams.apiBaseUrl;

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}/api/gemini`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options.body || {}),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Gemini API error");
  }

  return data;
}

export const api = { request };
