import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: {
      type: String,
      unique: true,
    },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
    followedChannels: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
