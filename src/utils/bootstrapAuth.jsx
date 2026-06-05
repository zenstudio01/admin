import api from "../api/api";

export const bootstrapAuth = async () => {
  const token = await localStorage.getItem("access_token");
  const refresh = await localStorage.getItem("refresh_token");

  // No tokens → user not logged in
  if (!token || !refresh) return false;

  try {
    // This triggers interceptor automatically if token expired
    await api.get("/auth_check/");
    return true;

  } catch (error) {
    return false;
  }
};