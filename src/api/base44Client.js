
import { appParams } from '@/lib/app-params';

const apiBaseUrl = appParams.apiBaseUrl;

async function request(path, options = {}) {
  if (!apiBaseUrl) {
    throw new Error('عنوان API غير مُعد.');
  }

  const response = await fetch(
    `${apiBaseUrl.replace(/\/$/, '')}${path}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'حدث خطأ في الاتصال بالخادم.');
  }

  return data;
}

export const api = {
  request,
};
