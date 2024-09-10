import mongoose, { Schema } from "mongoose";

let messageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  isCreatedAt: {
    type: Date,
    required: true,
  },
});

let userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  verifyCode: {
    type: String,
    required: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isAcceptingMessages: {
    type: Boolean,
    required: true,
  },
  messages: [messageSchema],
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
