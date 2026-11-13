import { appParams } from "@/lib/app-params";

const apiBaseUrl = appParams.apiBaseUrl || "";

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "حدث خطأ في الاتصال بالخادم.");
  }

  return data;
}

export const api = { request };
