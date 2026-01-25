import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/home";

  const handleSuccess = async (response) => {
    if (!response?.credential) {
      alert("Google authentication failed");
      return;
    }

    setLoading(true);

    try {
      const res = await googleLogin(response.credential);

      if (res?.success) {
        navigate(from, { replace: true });
      } else {
        alert(res?.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full mt-3">
      <div className="w-full max-w-xs sm:max-w-sm flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert("Google Login Failed")}
          useOneTap={false}
          size="large"
          width="300"
          shape="circle"
          theme="outline"
          text="signin_with"
          disabled={loading}
        />
      </div>
    </div>
  );
};
