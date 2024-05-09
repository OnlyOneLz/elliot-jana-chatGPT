const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    conversationName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("conversation", conversationSchema);

module.exports = Conversation;
