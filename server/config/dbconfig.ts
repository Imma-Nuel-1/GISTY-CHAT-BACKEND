import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL as string;

if (!mongoUrl) {
  throw new Error("MongoDB connection URL is not set in environment variables");
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

export default mongoose.connection;
