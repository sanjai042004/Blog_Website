import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, InputField } from "../components/ui";
import { otpService } from "../service/otpService";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const email = queryParams.get("email");
  const otp = queryParams.get("otp");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email || !otp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Invalid or expired reset link.</p>
      </div>
    );
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword)
      return setMessage("⚠️ Please fill all fields");
    if (newPassword.length < 8)
      return setMessage("⚠️ Password must be at least 8 characters");
    if (newPassword !== confirmPassword)
      return setMessage("⚠️ Passwords do not match");

    setLoading(true);
    try {
      const res = await otpService.resetPassword(email, otp, newPassword);
      setMessage(`✅ ${res.message}`);
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setMessage(error.message || "❌ Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <InputField
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showToggle
          />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showToggle
          />

          <Button type="submit" loading={loading} className="w-full">
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          {message && (
            <p
              className={`text-center text-sm mt-2 ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
