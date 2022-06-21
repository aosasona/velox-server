import { Schema, model } from "mongoose";

interface User {
  username: string;
  password: string;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<User>("User", userSchema);
