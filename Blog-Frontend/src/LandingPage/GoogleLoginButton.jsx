import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const GoogleLoginButton = ({
  onSuccessRedirect,
  onError,
  disabled = false,
}) => {
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (response) => {
    if (!response?.credential) {
      onError?.("Google authentication failed.");
      return;
    }

    setLoading(true);

    try {
      const res = await googleLogin(response.credential);

      if (res && res.success === true) {
        onSuccessRedirect?.();
      } else {
        onError?.(res?.message || "Google login failed.");
      }
    } catch (err) {
      onError?.(
        err?.response?.data?.message ||
          "Google login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full mt-3">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() =>
          onError?.("Google authentication failed.")
        }
        useOneTap={false}
        size="large"
        theme="outline"
        text="signin_with"
        disabled={disabled || loading}
      />
    </div>
  );
};
