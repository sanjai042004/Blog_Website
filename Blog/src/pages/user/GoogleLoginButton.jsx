import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context";

export const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth(); 

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;

    const token = credentialResponse.credential;

    const result = await googleLogin(token);

    if (result.success) {
      navigate("/home");
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
