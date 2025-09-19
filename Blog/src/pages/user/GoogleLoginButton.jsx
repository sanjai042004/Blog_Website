import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const GoogleLoginButton = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setLoading(true);

    try {
      const token = credentialResponse.credential;
      const result = await googleLogin(token);

      if (result.success) {
        navigate("/home");
      } else {
        alert(result.message || "Google login failed. Try again.");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {loading ? (
        <p className="text-gray-600">
          {mode === "register"
            ? "Signing up with Google..."
            : "Logging in with Google..."}
        </p>
      ) : (
        <div className="w-[380px] rounded-full border overflow-hidden shadow-lg">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Google Login Failed")}
            text={mode === "register" ? "signup_with" : "signin_with"}
            shape="pill"
            width="100%" 
          />
        </div>
      )}
    </div>
  );
};
