import { Router } from "express";
import * as authService from "./auth.service.js";
import validation from "../../middleware/validation.midddleware.js";
import * as authSchema from "./auth.validation.js";
import isAuthuenticated from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { roles } from "../../DB/models/user.model.js";
const router = Router();

router.post(
  "/register",
  validation(authSchema.registerSchema),
  authService.register
);
router.post("/login", validation(authSchema.loginSchema), authService.login);
router.post("/verify", validation(authSchema.sendOTP), authService.sendOTP);
router.post(
  "/forget_password",
  validation(authSchema.forgetPassword),
  authService.forgetPassword
);
router.post(
  "/reset_password",
  validation(authSchema.resetPassword),
  authService.resetPassword
);
router.post(
  "/new_access",
  // validation(authSchema.resetPassword),
  authService.newAccess
);
router.post(
  "/loginWithGmail",
  // validation(authSchema.loginWithGmail),
  authService.loginWithGmail
);
router.post("/update_email", isAuthuenticated, authService.updateEmail);
router.get(`/verify_email/:token`, authService.verifyEmail);

export default router;
