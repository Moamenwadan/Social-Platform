// import { text } from "express";
// import { string } from "joi"
// import { ref } from "joi";
import mongoose, { model, Schema, Types } from "mongoose";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
const commentSchema = new mongoose.Schema(
  {
    post: { type: Types.ObjectId, ref: "Post" },
    user: { type: Types.ObjectId, ref: "User" },
    text: {
      type: String,
      required: function () {
        return this.image ? false : true;
      },
    },
    image: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    deletedBy: { type: Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    commentParent: { type: Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
commentSchema.virtual("replies", {
  ref: "Comment",
  foreignField: "commentParent",
  localField: "_id",
});

commentSchema.post(
  "deleteOne",
  { query: false, document: true },
  async function (doc, next) {
    if (doc.image.secure_url) {
      await cloudinary.uploader.destroy(doc.image.public_id);
    }
    const replies = await this.constructor.find({ commentParent: doc._id });
    // console.log(replies);
    if (replies.length) {
      for (const reply of replies) {
        // console.log(reply);
        await reply.deleteOne();
      }
    }
    return next();
  }
);
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
