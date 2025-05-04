import { Router } from "express";
import * as userService from "./user.service.js";
import isAuthuenticated from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { roles } from "../../DB/models/user.model.js";
import validation from "../../middleware/validation.midddleware.js";
import * as userSchemaValidation from "./user.validation.js";
import { upload } from "../../utils/fileUploading/multerUploading.js";
import { fileValidation } from "../../utils/fileUploading/multerUploading.js";
import uploadCloud from "../../utils/fileUploading/multerCloud.js";
const router = Router();
// add user
// router.post("/", userService.addUser);
router.get(
  "/profile",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  userService.profile
);
router.patch(
  "/updateProfile",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  validation(userSchemaValidation.updateProfile),
  userService.updateUser
);
router.patch(
  "/updatePassword",
  validation(userSchemaValidation.updatePassword),
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  userService.updatePassword
);
router.delete(
  "/freezeAccount",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  userService.freezeAccount
);
router.get(
  "/:userId",
  validation(userSchemaValidation.shareProfile),
  userService.shareProfile
);
// upload picture in single
router.post(
  "/profilePicture",
  isAuthuenticated,
  upload(fileValidation.images, "uploads/users").single("image"),
  userService.profilePicture
);
// upload multiple picture in array
router.post(
  "/uploadPictures",
  isAuthuenticated,
  upload().array("images", 3),
  userService.uploadPictures
);
router.post(
  "/uploadPicturesInFields",
  isAuthuenticated,
  upload().fields([
    { name: "images", maxCount: 3 },
    { name: "tours", maxCount: 5 },
  ]),
  userService.uploadPicturesInFields
);
// delete picture
router.delete(
  "/deletePicture",
  isAuthuenticated,
  upload(fileValidation.images, "uploads/users").single("image"),
  userService.deleteProfilePicture
);
// upload picture in cloudinary
router.post(
  "/uploadProfilePictureInCloudinary",
  isAuthuenticated,
  uploadCloud().single("image"),
  userService.uploadProfilePictureInCloudinary
);
router.delete(
  "/deletePictureInCloudinary",
  isAuthuenticated,
  userService.deletePictureInCloudinary
);
export default router;
