import { Router } from "express";
import * as commentService from "./comment.service.js";
import multerCloud from "../../utils/fileUploading/multerCloud.js";
import isAuthentication from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { roles } from "../../DB/models/user.model.js";
import validation from "../../middleware/validation.midddleware.js";
import * as commentSchema from "./comment.validation.js";
const router = Router({ mergeParams: true });
// create comment
router.post(
  "/",
  isAuthentication,
  isAuthorized(roles.user, roles.admin),
  multerCloud().single("images"),
  validation(commentSchema.createComment),
  commentService.createComment
);
router.patch(
  "/:commentId",
  isAuthentication,
  isAuthorized(roles.user),
  multerCloud().single("images"),
  validation(commentSchema.updateComment),
  commentService.updateComment
);
// soft delete
router.delete(
  "/:commentId/delete",
  isAuthentication,
  isAuthorized(roles.user, roles.admin),
  // validation(commentSchema.deleteComment),
  commentService.deleteComment
);
// get all comments for post
router.get(
  "/",
  isAuthentication,
  isAuthorized(roles.user, roles.admin),
  validation(commentSchema.getAllComments),
  commentService.getAllComments
);
// likesAndUnlikes
router.post(
  "/likesAndUnlikes",
  isAuthentication,
  isAuthorized(roles.user, roles.admin),
  validation(commentSchema.likesAndUnlikes),
  commentService.likesAndUnlikes
);
router.post(
  "/:commentParentId/replies",
  isAuthentication,
  isAuthorized(roles.user, roles.admin),
  validation(commentSchema.addReply),
  multerCloud().single("images"),
  commentService.addReply
);
// delete comment
router.delete(
  "/delete/:commentId",
  isAuthentication,
  isAuthorized(roles.user, roles.admin),
  validation(commentSchema.deleteAllComments),
  multerCloud().single("images"),
  commentService.deleteComments
);
export default router;
