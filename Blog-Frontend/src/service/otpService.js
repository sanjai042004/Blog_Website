// src/service/otpService.js
import { api } from "./api";

export const otpService = {
  forgotPassword: async (email) => {
    const { data } = await api.post("/otp/forgot-password", { email });
    return data; 
  },

  verifyOtp: async (email, otp) => {
    const { data } = await api.post("/otp/verify-otp", { email, otp });
    return data; 
  },

  resendOtp: async (email) => {
    const { data } = await api.post("/otp/resend-otp", { email });
    return data; 
  },

  resetPassword: async (email, otp, newPassword) => {
    const { data } = await api.post("/otp/reset-password", { email, otp, newPassword });
    return data; 
  },
};
