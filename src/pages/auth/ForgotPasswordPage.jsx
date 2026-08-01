import {
  ArrowLeft,
  Mail,
} from "lucide-react";

import { useState } from "react";

import {
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Colors from "../../constants/colors";
import authService from "../../services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(
        "Email address is required."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      setError(
        "Enter a valid email address."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await authService.forgotPassword(
          normalizedEmail
        );

      setSubmitted(true);

      toast.success(
        response.message ||
          "Password reset instructions sent."
      );
    } catch (requestError) {
      toast.error(
        requestError.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <div
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            color: Colors.primary,
            backgroundColor:
              `${Colors.primary}15`,
          }}
        >
          <Mail size={27} />
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          Check your email
        </h2>

        <p className="mt-4 text-sm leading-6 text-gray-500">
          We sent password reset
          instructions to{" "}
          <span className="font-semibold text-gray-800">
            {email}
          </span>
          .
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Check your inbox and spam
          folder. The reset link may
          expire after a limited time.
        </p>

        <div className="mt-8">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-semibold hover:underline"
            style={{
              color: Colors.primary,
            }}
          >
            <ArrowLeft size={17} />
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p
          className="mb-2 text-sm font-semibold"
          style={{
            color: Colors.primary,
          }}
        >
          Password recovery
        </p>

        <h2 className="text-3xl font-bold text-gray-900">
          Forgot your password?
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Enter the email address
          associated with your account.
          We will send you password reset
          instructions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(
              event.target.value
            );

            if (error) {
              setError("");
            }
          }}
          error={error}
          icon={Mail}
          autoComplete="email"
        />

        <Button
          type="submit"
          loading={loading}
        >
          Send reset instructions
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
          style={{
            color: Colors.primary,
          }}
        >
          <ArrowLeft size={17} />
          Return to sign in
        </Link>
      </div>
    </div>
  );
}