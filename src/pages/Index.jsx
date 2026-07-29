import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { bootstrapAuth } from "../utils/bootstrapAuth";
import Colors from "../constants/colors";

export default function Index() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await bootstrapAuth();

        if (loggedIn) {
          const storedUser = localStorage.getItem("user");
          const user = storedUser ? JSON.parse(storedUser) : null;
          console.log("Session found");

          // Safely check role using the parsed 'user' object
          const role = user?.role;

          if (role === "property_manager") {
            navigate("/property-manager-dashboard");
          } else if (role === "company admin") {
            navigate("/company-dashboard");
          } else if (role === "landlord") {
            navigate("/landlord-dashboard");
          } else {
            navigate("/dashboard");
          }
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
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: Colors.background }}
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
            <Activity size={45} color={Colors.primary} />
          </div>

          <div className="mt-6">
            <div
              className="
                h-8
                w-8
                border-4
                border-t-transparent
                rounded-full
                animate-spin
                mx-auto
              "
              style={{ borderColor: Colors.primary, borderTopColor: "transparent" }}
            ></div>

            <p 
              className="mt-4 text-base font-medium tracking-wide"
              style={{ color: Colors.primary }}
            >
              Checking UNIT session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}