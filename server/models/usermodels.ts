import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// Interface for User document in MongoDB
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  createdAt?: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "", // Optional: set a default value or keep it empty
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Pre-save hook to hash the password before saving the user
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error as Error);
  }
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
