const ACCESS_TOKEN_KEY = "unit_access_token";
const REFRESH_TOKEN_KEY = "unit_refresh_token";
const USER_KEY = "unit_user";

const storage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token) {
    if (!token) return;

    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      token
    );
  },

  getRefreshToken() {
    return localStorage.getItem(
      REFRESH_TOKEN_KEY
    );
  },

  setRefreshToken(token) {
    if (!token) return;

    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      token
    );
  },

  setTokens({ access, refresh }) {
    if (access) {
      this.setAccessToken(access);
    }

    if (refresh) {
      this.setRefreshToken(refresh);
    }
  },

  clearTokens() {
    localStorage.removeItem(
      ACCESS_TOKEN_KEY
    );

    localStorage.removeItem(
      REFRESH_TOKEN_KEY
    );
  },

  getUser() {
    const value =
      localStorage.getItem(USER_KEY);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setUser(user) {
    if (!user) return;

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  },

  clearUser() {
    localStorage.removeItem(USER_KEY);
  },

  clearAuth() {
    this.clearTokens();
    this.clearUser();
  },
};

export default storage;