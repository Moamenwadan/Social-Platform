import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.CONNECTION_URI}`);
    console.log("the mongoose is connceted with your application");
  } catch (error) {
    console.log("failed to connect with database");
  }
};
export default connectDB;
