import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute() {
  const location = useLocation();

  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-r-orange-500" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}