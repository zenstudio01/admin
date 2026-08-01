// src/services/auth.service.js

import api from "./api";

function extractError(error) {
  const data = error.response?.data;

  if (!data) {
    return (
      error.message ||
      "Unable to connect to the server."
    );
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.message) {
    return data.message;
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.error) {
    return data.error;
  }

  if (
    Array.isArray(data.errors) &&
    data.errors.length > 0
  ) {
    return data.errors.join(" ");
  }

  if (
    Array.isArray(data.fields) &&
    data.fields.length > 0
  ) {
    return `Missing fields: ${data.fields.join(", ")}`;
  }

  const firstKey = Object.keys(data)[0];

  if (firstKey) {
    const firstError = data[firstKey];

    if (Array.isArray(firstError)) {
      return firstError.join(" ");
    }

    if (typeof firstError === "string") {
      return firstError;
    }
  }

  return "Something went wrong.";
}

const authService = {
  async login(credentials) {
    try {
      const response = await api.post(
        "/signin/",
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(extractError(error));
    }
  },

  async register(data) {
    try {
      const response = await api.post(
        "/signup/",
        data
      );

      return response.data;
    } catch (error) {
      throw new Error(extractError(error));
    }
  },

  async checkAuthentication() {
    try {
      const response = await api.get(
        "/auth_check/"
      );

      return response.data;
    } catch (error) {
      throw new Error(extractError(error));
    }
  },

  async requestPasswordReset(email) {
    try {
      const response = await api.post(
        "/request_reset/",
        {
          email,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(extractError(error));
    }
  },

  async resetPassword({
    token,
    password,
    confirmPassword,
  }) {
    try {
      const response = await api.post(
        "/reset_password/",
        {
          token,
          password,
          confirm_password:
            confirmPassword,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(extractError(error));
    }
  },

  async resendVerificationEmail(email) {
    try {
      const response = await api.post(
        "/resend_verification_email/",
        {
          email,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(extractError(error));
    }
  },

  async deleteAccount() {
    try {
      const response = await api.delete(
        "/delete_account/"
      );

      return response.data;
    } catch (error) {
      throw new Error(extractError(error));
    }
  },
};

export default authService;