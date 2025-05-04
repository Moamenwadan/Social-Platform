import { nanoid } from "nanoid";
import Post from "../../DB/models/post.model.js";
import User, { roles } from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHanler.js";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
import Comment from "../../DB/models/comment.model.js";
export const createPost = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  console.log(req.files);
  //   const { secure_url, public_id } = await cloudinary.uploader.upload(req,fileValidation.path);
  const user = await User.findById(req.user._id);

  let images = [];
  let cloudFolder;
  if (req.files.length) {
    cloudFolder = nanoid();
    for (let element of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        element.path,
        { folder: `Social/users/${user._id}/posts/${cloudFolder}` }
      );
      images.push({ secure_url, public_id });
    }
  }

  const post = await Post.create({
    text,
    images,
    user: req.user._id,
    cloudFolder,
  });
  return res.status(200).json({ success: true, post });
});
export const updatePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;
  const post = await Post.findOne({ _id: postId, user: userId });
  // console.log(post);
  if (!post) next(new Error("the post doesn't exist"));
  let images = [];
  let cloudFolder;
  if (req.files.length) {
    if (post.images.length) {
      // destroy the previous images
      for (const image of post.images) {
        const result = await cloudinary.uploader.destroy(image.public_id);
        console.log(result);
      }
    }

    cloudFolder = nanoid();
    // upload images
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `Social/users/${req.user._id}/posts/${post.cloudFolder}`,
        }
      );

      images.push({ secure_url, public_id });
      console.log(images);
    }
    post.images = images;
  }
  post.text = text;
  await post.save();

  return res.status(200).json({ success: true, post });
});
export const freezePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) return next(new Error("the post doesn't exist", { cause: 404 }));
  const user = await User.findById(req.user._id);

  // if user delete post or admin delete post
  if (user.role == "admin" || post.user.toString() == user._id.toString()) {
    post.deletedBy = user._id;
    post.isDeleted = true;
  } else {
    return next(new Error("unAothorized the post", { cause: 403 }));
  }
  await post.save();
  return res.json({ success: true, post });
});
export const unfreezePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) return next(new Error("the post doesn't exist", { cause: 404 }));
  // const user = await User.findById(req.user._id);

  // if user delete post or admin delete post
  const unfreezed = await Post.findOneAndUpdate(
    {
      _id: postId,
      isDeleted: true,
      deletedBy: req.user._id,
    },
    {
      $unset: { deletedBy: 0 },
      isDeleted: false,
    },
    { new: true }
  );

  if (!unfreezed)
    return next(new Error("unAothorized the post", { cause: 401 }));

  return res.json({ success: true, post });
});
export const deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) return next(new Error("the post doesn't exist", { cause: 404 }));
  const user = await User.findById(req.user._id);

  // if user delete post or admin delete post
  if (user.role == "admin" || post.user.toString() == user._id.toString()) {
    await Post.findByIdAndDelete(postId);
  } else {
    return next(new Error("unAothorized the post", { cause: 403 }));
  }
  return res.json({ success: true, message: "the post deleted successfully" });
});
// solution one
// export const getPost = asyncHandler(async (req, res, next) => {
//   const { postId } = req.params;
//   const post = await Post.findOne({ _id: postId, isDeleted: false }).populate({
//     path: "user",
//     select: "userName profilePicture",
//   });
//   if (!post) return next(new Error("the post doesn't exist", { cause: 404 }));
//   // to show comments to specefic each post
//   const comments = await Comment.find({
//     isDeleted: false,
//     post: post._id,
//   });
//   if (!comments)
//     return next(new Error("the comments doesn't exist", { cause: 404 }));

//   return res.status(200).json({
//     success: true,
//     results: {
//       post,
//       comments,
//     },
//   });
// });
// solution two,three
export const getPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId, isDeleted: false })
    .populate({
      path: "user",
      select: "userName profilePicture",
    })
    .populate({
      path: "comments",
      select: "text image ",
      match: { commentParent: { $exists: false } },
      populate: [{ path: "user", select: "userName" }, { path: "replies" }],
    });
  if (!post) return next(new Error("the post doesn't exist", { cause: 404 }));

  return res.status(200).json({
    success: true,
    post,
  });
});
// original
// export const getAllActivePosts = asyncHandler(async (req, res, next) => {
//   let posts;
//   if (req.user.role == roles.admin) {
//     posts = await Post.find({
//       isDeleted: false,
//     }).populate({
//       path: "user",
//       select: "userName profilePicture",
//     });
//   } else if (req.user.role == roles.user) {
//     posts = await Post.find({ isDeleted: false, user: req.user._id }).populate({
//       path: "user",
//       select: "userName profilePicture",
//     });
//   }
//   // if (!post) return next(new Error("the post doesn't exist", { cause: 404 }));
//   return res.status(200).json({ success: true, posts });
// });

// to get comment for each post
export const getAllActivePosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ isDeleted: false });
  if (!posts) return next(new Error("the post doesn't exist", { cause: 404 }));
  let results = [];
  // for (let post of posts) {
  //   let comment = await Comment.find({ post: post._id });
  //   results.push({ post, comment });
  // }
  const cursor = Post.find({ isDeleted: false }).cursor();
  for (
    let post = await cursor.next();
    post != null;
    post = await cursor.next()
  ) {
    let comment = await Comment.find({ post: post._id });
    results.push({ post, comment });
  }
  return res.status(200).json({ success: true, results });
});

export const getAllFreezedPosts = asyncHandler(async (req, res, next) => {
  let posts;
  if (req.user.role == roles.admin) {
    posts = await Post.find({
      isDeleted: true,
    }).populate({
      path: "user",
      select: "userName profilePicture",
    });
  } else if (req.user.role == roles.user) {
    posts = await Post.find({ isDeleted: true, user: req.user._id }).populate({
      path: "user",
      select: "userName profilePicture",
    });
  }
  // if (!post) return next(new Error("the post doesn't exist", { cause: 404 }));
  return res.status(200).json({ success: true, posts });
});
export const likeAndUnlikePosts = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findOne({ _id: postId, isDeleted: false });
  console.log(post);
  if (!post) return next(new Error("the user doesn't exist"));

  const isUserExist = post.likes.find(
    (user) => user.toString() == userId.toString()
  );
  // console.log(isUserExist);
  if (!isUserExist) {
    post.likes.push(userId);
  } else {
    post.likes = post.likes.filter(
      (user) => user.toString() != userId.toString()
    );
  }
  await post.save();
  const populatedPost = await Post.findOne({
    _id: postId,
    isDeleted: false,
  }).populate({
    path: "likes",
    select: "userName profilePicture.secure_url",
  });

  return res.status(200).json({ success: true, populatedPost });
});
