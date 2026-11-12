
const getAppParams = () => ({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
});

export const appParams = {
  ...getAppParams(),
};
