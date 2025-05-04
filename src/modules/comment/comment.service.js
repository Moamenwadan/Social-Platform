import Post from "../../DB/models/post.model.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHanler.js";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
import Comment from "../../DB/models/comment.model.js";
import { roles } from "../../DB/models/user.model.js";
export const createComment = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post)
    return next(
      new Error("the post that you want to add commit to it is doesn't exist")
    );
  //   console.log(post);

  let image;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        file: `Social/users/${req.user._id}/posts/${post.cloudFolder}`,
      }
    );
    image = { secure_url, public_id };
  }
  //   console.log(image);

  const newComment = await Comment.create({
    user: req.user._id,
    post: postId,
    text: text,
    image: image,
  });
  // console.log(newComment._id);
  post.comments.push(newComment._id);
  await post.save();

  return res.status(200).json({ success: true, newComment });
});
export const updateComment = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment)
    return next(new Error("the comment doesn't exist", { cause: 404 }));
  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post)
    return next(
      new Error("the post that you want to add commit to it is doesn't exist", {
        cause: 403,
      })
    );
  if (req.user._id.toString() != comment.user.toString())
    return next(new Error("not authorized to update comment"));

  let image;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        file: `Social/users/${req.user._id}/posts/${post.cloudFolder}`,
      }
    );
    image = { secure_url, public_id };
    if (comment.image) {
      await cloudinary.uploader.destroy(comment.image.public_id);
    }
  }
  comment.text = text ? text : comment.text;
  await comment.save();
  //   console.log(image);
  const updatedComment = await Comment.findById(commentId);

  //   console.log(newComment);
  return res.status(200).json({ success: true, updatedComment });
});

export const deleteComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  // console.log(commentId);
  const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  // console.log(comment);
  if (!comment)
    return next(new Error("the comment doesn't exist", { cause: 404 }));
  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post)
    return next(
      new Error("the post that you want to add commit to it is doesn't exist", {
        cause: 403,
      })
    );

  // who owner the post
  const postOwner = post.user.toString() == req.user._id;
  // who owner the comment

  const commentOwner = comment.user.toString() == req.user._id;
  // admin
  // console.log(req.user.role, roles.admin);
  const admin = req.user.role == roles.admin;
  if (!postOwner && !commentOwner && !admin)
    return next(
      new Error("not authorized to delete comment", {
        cause: 403,
      })
    );
  comment.isDeleted = true;
  comment.deletedBy = req.user.id;
  await comment.save();

  return res.status(200).json({ comment });
});
export const getAllComments = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post)
    return next(
      new Error("the post that you want to add commit to it is doesn't exist", {
        cause: 403,
      })
    );
  const comments = await Comment.find({
    // post: post._id,
    isDeleted: false,
    commentParent: { $exists: false },
  }).populate("replies");

  if (!comments)
    return next(new Error("the comment doesn't exist", { cause: 404 }));
  return res.json({ success: true, comments });
});
export const likesAndUnlikes = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post)
    return next(
      new Error("the post that you want to add commit to it is doesn't exist", {
        cause: 403,
      })
    );
  const comment = await Comment.findOne({ post: postId, isDeleted: false });
  const isUserExist = comment.likes.find(
    (user) => user.toString() == req.user._id.toString()
  );
  if (!isUserExist) {
    comment.likes.push(req.user._id);
  } else {
    comment.likes = comment.likes.find(
      (user) => user.toString() != req.user._id.toString()
    );
  }
  await comment.save();
  return res.json({ success: true, comment });
});
export const addReply = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  // console.log(text);
  const { postId, commentParentId } = req.params;
  // console.log(postId, commentParentId);
  const post = await Post.findById(postId);
  if (!post)
    return next(
      new Error("the post that you want to add commit to it is doesn't exist")
    );
  //   console.log(post);
  const comment = await Comment.findOne({
    post: post._id,
    isDeleted: false,
  });

  let image;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        file: `Social/users/${req.user._id}/posts/${post.cloudFolder}/comments/${comment._id}`,
      }
    );
    image = { secure_url, public_id };
  }

  const reply = await Comment.create({
    user: req.user._id,
    post: postId,
    text: text,
    image: image,
    commentParent: commentParentId,
  });

  return res.status(200).json({ success: true, reply });
});
export const deleteComments = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  // console.log(commentId);
  const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  // console.log(comment);
  if (!comment)
    return next(new Error("the comment doesn't exist", { cause: 404 }));
  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post)
    return next(
      new Error("the post that you want to add commit to it is doesn't exist", {
        cause: 403,
      })
    );

  // who owner the post
  const postOwner = post.user.toString() == req.user._id;
  // who owner the comment

  const commentOwner = comment.user.toString() == req.user._id;
  // admin
  // console.log(req.user.role, roles.admin);
  const admin = req.user.role == roles.admin;
  if (!postOwner && !commentOwner && !admin)
    return next(
      new Error("not authorized to delete comment", {
        cause: 403,
      })
    );
  await comment.deleteOne();
  return res.json({
    success: true,
    message: "herical replies deleted successfully",
  });
});
