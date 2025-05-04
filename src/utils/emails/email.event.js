import { EventEmitter } from "events";
import jwt from "jsonwebtoken";
import { signup } from "./generateHTML.js";
import { subjects } from "./sendEmail.js";
import sendEmail from "./sendEmail.js";
export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async (email, otp) => {
  const token = jwt.sign({ email }, process.env.SECRET_TOKEN);
  // const link = `http://localhost:3000/auth/activate_account/${token}`;
  const isSent = await sendEmail({
    to: email,
    subjects: subjects.register,
    html: signup(otp),
  });
});
