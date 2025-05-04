// import { object, string } from "joi";
import { hash } from "../../utils/hashing/hash.js";
import { Schema, model } from "mongoose";
export const genders = {
  male: "male",
  female: "female",
};
export const roles = {
  superAdmin: "superAdmin",
  admin: "admin",
  user: "user",
};

export const providers = {
  system: "system",
  google: "google",
};
export const defaultProfilePicture = "uploads/default_picture.png";

export const defaultSecure_url =
  "https://res.cloudinary.com/dr4po5j8x/image/upload/v1737901081/default_picture_brqlu4.png";
export const defaultpublic_id = "1737901081/default_picture_brqlu4";
const userSchema = new Schema(
  {
    userName: { type: String, minLength: 4, maxLength: 20, required: true },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: [true, "email must be unique"],
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === providers.system ? true : false;
      },
    },
    gender: { type: String, enum: Object.values(genders) },
    isActivated: { type: Boolean, default: false },
    phone: { type: String, required: true },
    role: { type: String, enum: Object.values(roles), default: roles.user },
    changePasswordTime: { type: Date },
    deleted: { type: Boolean, default: false },
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.system,
    },
    tempEmail: { type: String, default: null },
    // profilePicture: { type: String, default: defaultProfilePicture },
    profilePicture: {
      secure_url: { type: String, default: defaultSecure_url },
      public_id: { type: String, default: defaultpublic_id },
    },
    coverPictures: { type: [String] },
    tours: { type: [String] },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hash({ plainText: this.password });
  }
  next();
});
const User = model("User", userSchema);

export default User;
