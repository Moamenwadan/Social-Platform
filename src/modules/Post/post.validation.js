import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.midddleware.js";

export const createPost = joi
  .object({
    text: joi.string(),
    file: joi.array().items(
      joi.object({
        fieldname: joi.string().valid("images").required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
      })
    ),
  })
  .required()
  .or("text", "images");
export const updatePost = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
    text: joi.string().min(2),
    file: joi.array().items(
      joi.object({
        fieldname: joi.string().valid("images").required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
      })
    ),
  })
  .required()
  .or("text", "images");
export const freezePost = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
  })
  .required();
export const unfreezePost = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
  })
  .required();
export const deletePost = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
  })
  .required();
export const getPost = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
  })
  .required();
export const likePost = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
  })
  .required();
