import { model, Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
  },
  { timestamps: true }
);
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });
const OTP = model("OTP", otpSchema);
export default OTP;
