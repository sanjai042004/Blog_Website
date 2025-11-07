import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/home";

  const handleSuccess = async (response) => {
    try {
      const { credential } = response;
      const res = await googleLogin(credential);

      if (res.success) {
        console.log("Google Login Success ✅");
        setTimeout(() => {
          navigate(from, { replace: true }); 
        }, 500);
      } else {
        alert(res.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google Login Error:", error.response?.data || error);
      alert("Google Login Failed");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full rounded-2xl border overflow-hidden shadow-lg">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert("Google Login Failed")}
        />
      </div>
    </div>
  );
};
