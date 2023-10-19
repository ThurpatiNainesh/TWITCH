import mongoose from "mongoose";
import { v4 as unique } from "uuid";

const channelSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: false },
    title: { type: String, default: "New Channel" },
    description: { type: String, default: "This is new channel description" },
    avatarUrl: { type: String, default: "none" },
    streamkey: { type: String, default: unique },
    messages: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
      default: [],
    },
  },
  { timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
