import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";

import AuthLayout from "../layouts/AuthLayout";

import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import NotFoundPage from "../pages/NotFoundPage";
import SelectCompanyPage from "../pages/SelectCompanyPage";

export const router =
  createBrowserRouter([
    {
      path: "/",
      element: (
        <Navigate
          to="/login"
          replace
        />
      ),
    },

    {
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/forgot-password",
          element: (
            <ForgotPasswordPage />
          ),
        },
        {
          path: "/reset-password",
          element: (
            <ResetPasswordPage />
          ),
        },
      ],
    },

    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/select-company",
          element: (
            <SelectCompanyPage />
          ),
        },
      ],
    },

    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);