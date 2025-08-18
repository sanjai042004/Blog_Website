import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/google", {
        token: credentialResponse.credential,
      });

      console.log("Backend Response:", res.data);
      
      localStorage.setItem("token", res.data.token);

      // alert(`Welcome ${res.data.user.name}`);
      navigate("/home");
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log("Google Login Failed");
      }}
    />
  );
};
