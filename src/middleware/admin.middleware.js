import User, { roles } from "../DB/models/user.model.js";
const canChangeRole = async function (req, res, next) {
  const allRoles = Object.values(roles);
  //   console.log(allRoles);
  const user = req.user;
  const target = await User.findById(req.body.id);
  const userRole = req.user.role; //messi super admin  0
  const targetRole = target.role; // moamen admin 1
  if (allRoles.indexOf(userRole) < allRoles.indexOf(targetRole)) {
    next();
  } else {
    return next(new Error("not authorized to change role", { cause: 404 }));
  }
};

export default canChangeRole;
