// export const asyncHandler = function (fn) {
//   return (req, res, next) => {
//     fn(req, res, next).catch((error) => {
//       if (Object.keys(error) == 0) {
//         return next(new Error(error.message));
//       }
//       return next(error);
//     });
//   };
// };
export const asyncHandler = (fc) => {
  return (req, res, next) => {
    fc(req, res, next).catch((error) => {
      return next(new Error(error, { cause: 500 }));
    });
  };
};
