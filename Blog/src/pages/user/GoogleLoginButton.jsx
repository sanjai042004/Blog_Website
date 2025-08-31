import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context";

export const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth(); 

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;

    const token = credentialResponse.credential; // Google ID Token

    const result = await googleLogin(token); // Call backend

    if (result.success) {
      navigate("/home"); // Redirect after success
    } else {
      console.error("Google Login Error:", result.message);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
      useOneTap
    />
  );
};
