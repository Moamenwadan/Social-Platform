import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.midddleware.js";
import { roles } from "../../DB/models/user.model.js";
export const changeRole = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    role: joi.string().valid(...Object.values(roles)),
  })
  .required();
