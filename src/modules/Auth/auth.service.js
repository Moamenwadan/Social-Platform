import User, { providers } from "../.././DB/models/user.model.js";
import OTP from "../../DB/models/otp.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/errorHandling/asyncHanler.js";
import { emailEmitter } from "../../utils/emails/email.event.js";
import { hash, compareHash } from "../../utils/hashing/hash.js";
import { encrypt } from "../../utils/encryption/encryption.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import Randomstring from "randomstring";
import { OAuth2Client } from "google-auth-library";
import sendEmail from "../../utils/emails/sendEmail.js";
import { verifyUpdateEmail } from "../../utils/emails/generateHTML.js";
export const sendOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) return next(new Error("the user already exist", { cause: 400 }));
  const otp = Randomstring.generate({
    length: 5,
    charset: "alphanumeric",
  });
  const savdotp = await OTP.create({ email, otp });
  emailEmitter.emit("sendEmail", email, otp);
  return res.json({
    status: "success",
    message: "the otp send successfully",
    result: savdotp,
  });
});

export const register = asyncHandler(async (req, res, next) => {
  const { email, password, confirmPassword, phone, userName, otp } = req.body;
  const otpExist = await OTP.findOne({ otp, email });
  if (!otpExist) return next(new Error("invalid otp", { cause: 404 }));
  if (password !== confirmPassword)
    return next(
      new Error("password must match confirmed password", { cause: 404 })
    );

  const encryptPhone = encrypt({ plainText: phone });
  // const hashPassword = hash({ plainText: password });

  // return res.json({ result });
  const user = await User.create({
    email,
    password,
    phone: encryptPhone,
    userName,
  });

  // emailEmitter.emit("sendEmail", email);
  return res.status(200).json({
    success: true,
    message: "the user created successfully  ",
    user,
  });
});
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // check if user exist
  if (!user)
    return res.status(403).json({ success: false, message: "Invalid Email" });

  // check if user existence
  if (!user.isActivated)
    return next(new Error("you must activate acount"), { cause: 400 });
  // if (!bycrypt.compareSync(password, user.password))
  //   return next(new Error("Invalid password"), { cause: 403 });
  if (!compareHash({ plainText: password, hashValue: user.password }))
    return next(new Error("Invalid password"), { cause: 403 });
  user.deleted = false;
  await user.save();

  user.phone = encrypt({ plainText: user.phone });

  const token = generateToken({
    payload: { id: user._id, email: user.email, isloggedIn: true },
  });
  return res.status(200).json({
    success: true,
    message: "successfully login ",
    access_token: generateToken({
      payload: {
        id: user._id,
        email: user.email,
      },
      options: { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES) },
    }),
    refresh_token: generateToken({
      payload: {
        id: user._id,
        email: user.email,
      },
      options: { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES}` },
    }),
  });
});
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email, isActivated: true, deleted: false });
  if (!user) return next(new Error("the user doesn't exist", { cause: 400 }));
  const otp = Randomstring.generate({ length: 6, charset: "alphabetic" });
  await OTP.create({
    email,
    otp,
  });
  emailEmitter.emit("sendEmail", email, otp);
  return res.json({ success: true, message: "otp send successfully" });
});
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email, isActivated: true, deleted: false });
  if (!user) return next(new Error("the user doesn't exist", { cause: 400 }));
  const otpExist = await OTP.findOne({ email, otp });
  if (!otpExist) return next(new Error("Invalid OTP", { cause: 400 }));
  // user.password = hash({ plainText: password });
  user.password = password;
  await user.save();
  return res.json({ success: true, message: "try to login now" });
});

export const newAccess = asyncHandler(async (req, res, next) => {
  const { refresh_token } = req.body;
  console.log(process.env.ACCESS_TOKEN_EXPIRES);
  const payload = verifyToken({
    token: refresh_token,
    signature: `${process.env.SECRET_TOKEN}`,
  });
  console.log(payload);
  const user = await User.findById(payload.id);
  const access_token = generateToken({
    payload: {
      id: user._id,
      email: user.email,
    },
    options: { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES) },
  });
  res.status(201).json({
    status: "success",
    results: access_token,
  });
});
export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  // console.log(idToken);
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience:
        "302700166150-dvsig4st6ah4n1qle1r6avqmo4hs9eki.apps.googleusercontent.com",
    });
    console.log(ticket);
    const payload = ticket.getPayload();
    return payload;
  }
  const userData = await verify();
  console.log(userData);
  const { email_verified, email, name, picture } = userData;
  if (!email_verified) return next(new Error("Email is valid"));
  const user = await User.create({
    userName: name,
    email,
    isActivated: true,
    provider: providers.google,
  });
  const access_token = generateToken({
    payload: idToken,
    options: { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES}` },
  });
  const refresh_token = generateToken({
    payload: idToken,
    options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES) },
  });
  return res.json({
    status: "success",
    results: {
      access_token,
      refresh_token,
    },
  });
});

export const updateEmail = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findById(req.user._id);

  if (!compareHash({ plainText: password, hashValue: user.password }))
    return next(new Error("Invalid password", { cause: 404 }));
  user.tempEmail = email;
  await user.save();
  const token = generateToken({ payload: { id: user._id, email } });
  const link = `http://localhost:3000/auth/verify_email/${token}`;
  const html = verifyUpdateEmail(link);
  await sendEmail({ to: email, subject: "update Email", html });
  return res.json({ success: true, messae: "try to update email " });
});
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email, id } = verifyToken({ token });
  const user = await User.findById(id);
  if (!user) return next(new Error("Invalid password", { cause: 404 }));

  user.email = user.tempEmail;
  user.tempEmail = null;
  await user.save();
  return res.json({ success: true, message: "email updating successfully" });
});
export const changeRole = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(req.body._id, {
    role: req.body.role,
  });
  const userAfterChangeRole = await User.findById(id);
  return res.json({ success: true, userAfterChangeRole });
});
