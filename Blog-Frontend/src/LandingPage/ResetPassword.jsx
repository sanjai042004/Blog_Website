import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, InputField } from "../components/ui";
import { otpService } from "../service/otpService";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const email = params.get("email");
  const otp = params.get("otp");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  if (!email || !otp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">
          Invalid or expired reset link.
        </p>
      </div>
    );
  }

  const isStrongPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (feedback.text) setFeedback({ type: "", text: "" });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = form;

    if (!newPassword || !confirmPassword) {
      return setFeedback({
        type: "error",
        text: "All fields are required.",
      });
    }

    if (!isStrongPassword(newPassword)) {
      return setFeedback({
        type: "error",
        text:
          "Password must be at least 8 characters, include 1 uppercase letter and 1 number.",
      });
    }

    if (newPassword !== confirmPassword) {
      return setFeedback({
        type: "error",
        text: "Passwords do not match.",
      });
    }

    setLoading(true);

    try {
      const res = await otpService.resetPassword(
        email,
        otp,
        newPassword
      );

      if (res && res.success === true) {
        setFeedback({
          type: "success",
          text: res.message || "Password reset successful.",
        });
        navigate("/", { replace: true });
      } else {
        setFeedback({
          type: "error",
          text: res?.message || "Failed to reset password.",
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Try again.",
      });
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
            value={form.newPassword}
            onChange={handleChange}
            showToggle
          />

          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter new password"
            value={form.confirmPassword}
            onChange={handleChange}
            showToggle
          />

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          {feedback.text && (
            <p
              className={`text-center text-sm mt-2 ${
                feedback.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {feedback.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
