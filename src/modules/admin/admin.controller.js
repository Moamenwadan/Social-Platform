import { Router } from "express";
import * as adminService from "./admin.service.js";
import validation from "../../middleware/validation.midddleware.js";
import * as adminSchema from "./admin.validation.js";
import isAuthuenticated from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { roles } from "../../DB/models/user.model.js";
import canChangeRole from "../../middleware/admin.middleware.js";

const router = Router();

router.get(
  "/",
  isAuthuenticated,
  isAuthorized(roles.superAdmin, roles.admin),
  adminService.getAll
);
router.patch(
  "/",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin, roles.superAdmin),
  validation(adminSchema.changeRole),
  canChangeRole,
  adminService.changeRole
);

export default router;
