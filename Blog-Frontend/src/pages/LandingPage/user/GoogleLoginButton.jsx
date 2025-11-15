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
    <div className="flex flex-col items-center w-full px-4 mt-3">
      {/* Responsive box for mobile */}
      <div className="
        w-full 
        max-w-xs   
        md:max-w-sm 
        overflow-hidden 
      ">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert("Google Login Failed")}
          width="100%"
        />
      </div>
    </div>
  );
};
