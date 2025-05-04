// import express from "express";
import connectDB from "./DB/connection.js";
import userController from "./modules/User/user.controller.js";
import postController from "./modules/Post/post.controller.js";
import CommentController from "./modules/comment/comment.controller.js";
import adminController from "./modules/admin/admin.controller.js";
import authController from "./modules/Auth/auth.controller.js";
import globalErrorHandler from "./utils/errorHandling/globalErrorHandler.js";
import notFoundHandler from "./utils/errorHandling/notFoundHandler.js";

import cors from "cors";
const boot = async (app, express) => {
  app.use(cors());
  await connectDB();
  const whitList = ["http://localhost:3000", "http://localhost:5000"];

  // app.use((req, res, next) => {
  //   const origin = req.header("Origin");
  //   console.log(origin);
  //   if (!whitList.includes(origin)) {
  //     return next(new Error("Blocked by cors"));
  //   }
  //   res.setHeader("Access-Control-Allow-Origin", origin);
  //   res.setHeader("Access-Control-Allow-Headers", "*");
  //   res.setHeader("Access-Control-Allow-Methods", "*");
  //   res.setHeader("Access-Control-Private-Network", true);
  //   return next();
  // });
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));
  app.get("/", (req, res, next) => {
    return res
      .status(200)
      .json({ message: "welcome the node js file from express" });
  });

  app.use("/auth", authController);
  app.use("/users", userController);
  app.use("/posts", postController);
  app.use("/comments", CommentController);
  app.use("/admin", adminController);

  app.all("*", notFoundHandler);
  app.use(globalErrorHandler);
};
export default boot;
