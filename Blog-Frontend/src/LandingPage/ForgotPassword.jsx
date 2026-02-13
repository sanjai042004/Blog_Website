import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputField, Modal, OTPInput } from "../components/ui";
import { otpService } from "../service/otpService";

export const ForgotPassword = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState(1); // 1 = email, 2 = otp
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  // reset everything when modal closes
  const resetState = () => {
    setEmail("");
    setOtp(Array(6).fill(""));
    setStep(1);
    setFeedback({ type: "", text: "" });
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // =========================
  // STEP 1 — SEND OTP
  // =========================
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return setFeedback({
        type: "error",
        text: "Email is required.",
      });
    }

    if (!isValidEmail(email)) {
      return setFeedback({
        type: "error",
        text: "Enter a valid email address.",
      });
    }

    setLoading(true);

    try {
      const res = await otpService.forgotPassword(email);

      // 🔴 THIS CHECK IS CRITICAL
      if (res && res.success === true) {
        setFeedback({
          type: "success",
          text: res.message || "OTP sent successfully.",
        });
        setStep(2); // ✅ THIS OPENS OTP INPUT
      } else {
        setFeedback({
          type: "error",
          text: res?.message || "Failed to send OTP.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Failed to send OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STEP 2 — VERIFY OTP
  // =========================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (!/^\d{6}$/.test(code)) {
      return setFeedback({
        type: "error",
        text: "Enter a valid 6-digit OTP.",
      });
    }

    setLoading(true);

    try {
      const res = await otpService.verifyOtp(email, code);

      if (res && res.success === true) {
        handleClose();
        navigate(
          `/reset-password?email=${encodeURIComponent(
            email
          )}&otp=${code}`,
          { replace: true }
        );
      } else {
        setFeedback({
          type: "error",
          text: res?.message || "Invalid or expired OTP.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Invalid or expired OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const res = await otpService.resendOtp(email);
      setFeedback({
        type: "success",
        text: res.message || "New OTP sent.",
      });
      setOtp(Array(6).fill(""));
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Failed to resend OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Forgot Password">
      <form
        onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}
        className="space-y-4"
      >
        {/* STEP 1 — EMAIL */}
        {step === 1 && (
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (feedback.text)
                setFeedback({ type: "", text: "" });
            }}
          />
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Enter the 6-digit OTP sent to <b>{email}</b>
            </p>

            <OTPInput otp={otp} setOtp={setOtp} />

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-blue-600 text-sm hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          {step === 1 ? "Send OTP" : "Verify OTP"}
        </Button>

        {feedback.text && (
          <p
            className={`text-center text-sm ${
              feedback.type === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {feedback.text}
          </p>
        )}
      </form>
    </Modal>
  );
};
