import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputField, Modal, OTPInput } from "../../../components/ui";
import { otpService } from "../../../service/otpService";

export const ForgotPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setMessage("Please enter your email");

    try {
      setLoading(true);
      const res = await otpService.forgotPassword(email);
      setMessage(res.message || "OTP sent successfully!");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return setMessage("Please enter the full 6-digit OTP");

    try {
      setLoading(true);
      const res = await otpService.verifyOtp(email, code);
      setMessage(res.message || "OTP verified successfully!");

      // Redirect to reset password page
      setTimeout(() => {
        onClose();
        navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${code}`);
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Resend OTP
  const handleResendOtp = async () => {
    if (!email.trim()) return setMessage("Email missing");

    try {
      setLoading(true);
      const res = await otpService.resendOtp(email);
      setMessage(res.message || "New OTP sent successfully!");
      setOtp(Array(6).fill(""));
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Forgot Password">
      <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-4">
        {step === 1 && (
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Enter the 6-digit OTP sent to <b>{email}</b>
            </p>

            <OTPInput otp={otp} setOtp={setOtp} />

            <div className="text-center mt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-600 text-sm hover:underline"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {step === 1 ? "Send OTP" : "Verify OTP"}
        </Button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </Modal>
  );
};
