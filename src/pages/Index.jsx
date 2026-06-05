import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { bootstrapAuth } from "../utils/bootstrapAuth";

export default function Index() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await bootstrapAuth();

        if (loggedIn) {
          console.log("Session found");
          navigate("/dashboard", {
            replace: true,
          });
        } else {
          console.log("No session found");
          navigate("/signin", {
            replace: true,
          });
        }
      } catch (error) {
        console.log("Auth check error:", error);
        navigate("/signin", { replace: true });
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div 
        className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0A4429] to-[#052214]"
      >
        <div className="text-center">
          <div
            className="
            w-24
            h-24
            bg-white/95
            rounded-3xl
            flex
            items-center
            justify-center
            shadow-xl
            shadow-black/20
            mx-auto
            "
          >
            {/* Updated icon color to Primary Logo Green */}
            <Activity size={45} className="text-[#2E9D47]" />
          </div>

          <div className="mt-6">
            {/* Updated loading spinner border to Primary Logo Green */}
            <div
              className="
              h-8
              w-8
              border-4
              border-[#2E9D47]
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
              "
            ></div>

            <p className="text-[#F4F1E6] mt-4 text-base font-medium tracking-wide">
              Checking UNIT session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}