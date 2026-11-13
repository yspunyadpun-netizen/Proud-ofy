
import { getAccessToken } from "@base44/sdk";

const isNode = typeof window === "undefined";

export const appParams = {
  appId: import.meta.env.VITE_BASE44_APP_ID,
  token: isNode ? undefined : getAccessToken(),
  functionsVersion: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION,
  appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL,
};
