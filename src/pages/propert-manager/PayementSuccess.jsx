import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";

export default function PaymentSuccess() {
  const [params] = useSearchParams();

  useEffect(() => {
    const reference = params.get("reference");

    if (reference) {
      api.get(`/verify_subscription_payment/${reference}/`);
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>

        <p className="mt-4">
          Your subscription has been activated.
        </p>
      </div>
    </div>
  );
}