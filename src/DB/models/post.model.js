import mongoose, { Types } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: function () {
        return this.images.length ? false : true;
      },
    },
    images: [
      {
        secure_url: { type: String },
        public_id: { type: String },
      },
    ],
    user: { type: Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: Types.ObjectId, ref: "User" },
    cloudFolder: {
      type: String,
      unique: true,
      required: function () {
        return this.images.length ? true : false;
      },
    },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    // comments: [{ type: Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

const Post = mongoose.model("Post", postSchema);
export default Post;
