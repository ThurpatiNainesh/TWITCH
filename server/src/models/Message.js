import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  author: String,
  content: String,
  date: Date,
});

const Message= mongoose.model("Message", messageSchema);

export default Message;
