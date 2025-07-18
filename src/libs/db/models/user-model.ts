'use server';
import mongoose, { Schema } from "mongoose";
import { userType } from "src/types/user";

const UserSchema = new Schema<userType>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model<userType>("User", UserSchema);

export default User;