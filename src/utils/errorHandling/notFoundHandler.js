const notFoundHandler = (req, res, next) => {
  // console.log("NOT FOUND API ");
  return next(new Error(" NOT FOUND API "));
};
export default notFoundHandler;
