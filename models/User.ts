import mongoose, { Model, Schema } from "mongoose";

export type UserDocument = {
  name?: string;
  email: string;
  passwordHash: string;
  role: "admin" | "customer";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<UserDocument> =
  mongoose.models.User ||
  mongoose.model<UserDocument>("User", UserSchema);

export default User;