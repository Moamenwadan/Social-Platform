const isAuthorized = (...roles) => {
  return (req, res, next) => {
    // if (req.user.role !== roles)
    if (!roles.includes(req.user.role))
      return next(new Error("not authorized"), { cause: 403 });
    return next();
  };
};
export default isAuthorized;
