const mongoose = require("mongoose");

const messageHistorySchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: false,
    },
    conversationId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MessageHistory = mongoose.model("Message History", messageHistorySchema);

module.exports = MessageHistory;
