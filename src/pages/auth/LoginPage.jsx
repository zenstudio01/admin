import {
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Colors from "../../constants/colors";
import useAuth from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
  } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(
        "/select-company",
        {
          replace: true,
        }
      );
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email:
          formData.email
            .trim()
            .toLowerCase(),
        password:
          formData.password,
      });

      toast.success(
        response.message ||
          "Welcome back."
      );

      const redirectPath =
        location.state?.from ||
        "/select-company";

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error.message ||
          "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p
          className="mb-2 text-sm font-semibold"
          style={{
            color: Colors.primary,
          }}
        >
          Welcome back
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Access your company workspace,
          properties, tenants, and reports.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          autoComplete="email"
        />

        <div>
          <Input
            label="Password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                className="text-gray-400 transition hover:text-gray-700"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            }
          />

          <div className="mt-3 flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold hover:underline"
              style={{
                color: Colors.primary,
              }}
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          loading={loading}
        >
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Do not have an account?{" "}
        <Link
          to="/register"
          className="font-semibold hover:underline"
          style={{
            color: Colors.primary,
          }}
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}