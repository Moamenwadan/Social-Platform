import User from "../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/token/token.js";
const isAuthuenticated = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer"))
      return next(new Error("token required"), { cause: 404 });

    const token = authorization.split(" ")[1];

    // const decoded = jwt.verify(token, "gjhghjgjfhgfhgfhgfhg");
    const decoded = verifyToken({ token });
    // console.log(decoded);

    const user = await User.findById(decoded.id).lean();
    if (!user) return next(new Error("user doesn't exist"), { cause: 404 });
    // console.log(parseInt(user.changePasswordTime?.getTime() || 0 / 1000));
    // console.log(decoded.iat);
    if (
      parseInt((user.changePasswordTime?.getTime() || 0) / 1000) >= decoded.iat
    ) {
      next(new Error("Expired token", { cause: 404 }));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
export default isAuthuenticated;
