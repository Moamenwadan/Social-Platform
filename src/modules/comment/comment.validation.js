import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.midddleware.js";

export const createComment = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: joi.object({
      fieldname: joi.string().valid("images").required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      size: joi.number().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
    }),
  })
  .required();
// .or("text", "file");

export const updateComment = joi
  .object({
    commentId: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: joi.object({
      fieldname: joi.string().valid("images").required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      size: joi.number().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
    }),
  })
  .or("text", "file");
export const deleteComment = joi.object({
  commentId: joi.custom(isValidObjectId).required(),
});

export const getAllComments = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
  })
  .required();
export const likesAndUnlikes = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
  })
  .required();
export const addReply = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
    commentParentId: joi.custom(isValidObjectId).required(),
    file: joi.object({
      fieldname: joi.string().valid("images").required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      size: joi.number().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
    }),
  })
  .required();

export const deleteAllComments = joi.object({
  commentId: joi.custom(isValidObjectId).required(),
});
