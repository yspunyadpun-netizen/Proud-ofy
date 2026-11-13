import { getAccessToken } from "@base44/sdk";

export const appParams = {
  appId: import.meta.env.VITE_BASE44_APP_ID,
  token: getAccessToken(),
  functionsVersion: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION,
  appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL,
};
