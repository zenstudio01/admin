import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Colors from "../../constants/colors";
import useAuth from "../../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] =
    useState({
      full_name: "",
      email: "",
      phone_number: "",
      password: "",
      confirm_password: "",
      agreed: false,
    });

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
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

    if (!formData.full_name.trim()) {
      newErrors.full_name =
        "Full name is required.";
    }

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

    if (
      !formData.phone_number.trim()
    ) {
      newErrors.phone_number =
        "Phone number is required.";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    } else if (
      formData.password.length < 8
    ) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    if (
      !formData.confirm_password
    ) {
      newErrors.confirm_password =
        "Confirm your password.";
    } else if (
      formData.password !==
      formData.confirm_password
    ) {
      newErrors.confirm_password =
        "Passwords do not match.";
    }

    if (!formData.agreed) {
      newErrors.agreed =
        "You must accept the terms.";
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
      const response =
        await register({
          full_name:
            formData.full_name.trim(),
          email:
            formData.email
              .trim()
              .toLowerCase(),
          phone_number:
            formData.phone_number.trim(),
          password:
            formData.password,
          confirm_password:
            formData.confirm_password,
        });

      toast.success(
        response.message ||
          "Account created successfully."
      );

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
        },
      });
    } catch (error) {
      toast.error(
        error.message ||
          "Unable to create account."
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
          Get started
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Create an account to start
          managing your property company.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          label="Full name"
          name="full_name"
          placeholder="Enter your full name"
          value={formData.full_name}
          onChange={handleChange}
          error={errors.full_name}
          icon={User}
          autoComplete="name"
        />

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

        <Input
          label="Phone number"
          name="phone_number"
          type="tel"
          placeholder="+254 700 000 000"
          value={
            formData.phone_number
          }
          onChange={handleChange}
          error={
            errors.phone_number
          }
          icon={Phone}
          autoComplete="tel"
        />

        <Input
          label="Password"
          name="password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          autoComplete="new-password"
          rightElement={
            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previous) =>
                    !previous
                )
              }
              className="text-gray-400 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          }
        />

        <Input
          label="Confirm password"
          name="confirm_password"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          placeholder="Repeat your password"
          value={
            formData.confirm_password
          }
          onChange={handleChange}
          error={
            errors.confirm_password
          }
          icon={Lock}
          autoComplete="new-password"
          rightElement={
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) =>
                    !previous
                )
              }
              className="text-gray-400 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          }
        />

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-gray-300"
              style={{
                accentColor:
                  Colors.primary,
              }}
            />

            <span className="text-sm leading-6 text-gray-600">
              I agree to the{" "}
              <a
                href="/terms"
                className="font-semibold hover:underline"
                style={{
                  color:
                    Colors.primary,
                }}
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="font-semibold hover:underline"
                style={{
                  color:
                    Colors.primary,
                }}
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>

          {errors.agreed && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.agreed}
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={loading}
        >
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold hover:underline"
          style={{
            color: Colors.primary,
          }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}