import { Router } from "express";
import * as postService from "./post.service.js";
import isAuthuenticated from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import multerCloud from "../../utils/fileUploading/multerCloud.js";
import { roles } from "../../DB/models/user.model.js";
import validtion from "../../middleware/validation.midddleware.js";
import * as postSchema from "./post.validation.js";
import commentController from "../comment/comment.controller.js";
const router = Router();
router.use("/:postId/comments", commentController);
// create post
router.post(
  "/createPost",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  multerCloud().array("images"),
  validtion(postSchema.createPost),
  postService.createPost
);
// update post
router.post(
  "/updatePost/:postId",
  isAuthuenticated,
  isAuthorized(roles.user),
  multerCloud().array("images"),
  validtion(postSchema.updatePost),
  postService.updatePost
);
// freeze post
router.post(
  "/:postId",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  validtion(postSchema.freezePost),
  postService.freezePost
);
// unfreezed post
router.post(
  "/unfreezePost/:postId",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  validtion(postSchema.unfreezePost),
  postService.unfreezePost
);
// delete post
router.delete(
  "/delete/:postId",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  validtion(postSchema.deletePost),
  postService.deletePost
);
// get  post
router.get(
  "/:postId",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  validtion(postSchema.getPost),
  postService.getPost
);
// get all ctive posts
router.get(
  "/all/active",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  postService.getAllActivePosts
);
// get all freezed posts
router.get(
  "/all/freezed",
  isAuthuenticated,
  isAuthorized(roles.user, roles.admin),
  postService.getAllFreezedPosts
);
router.post(
  "/like-unlike/:postId",
  isAuthuenticated,
  isAuthorized(roles.user),
  validtion(postSchema.likePost),
  postService.likeAndUnlikePosts
);
export default router;
