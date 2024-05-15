const express = require("express")
const router = express.Router()
const MessageHistory = require("../schemas/messageHistorySchema");

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await MessageHistory.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const messages = await MessageHistory.find({
      conversationId: req.params.id,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new message
router.post("/", async (req, res) => {
  const { role, userId, conversationId, message } = req.body;
  const newMessage = new MessageHistory({
    role,
    userId,
    conversationId,
    message,
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a message
router.delete("/:id", async (req, res) => {
  try {
    const deletedMessages = await MessageHistory.deleteMany({
      conversationId: req.params.id,
    });
    if (deletedMessages.deletedCount === 0) {
      return res.status(404).json({ message: "Messages not found" });
    }
    res.json({
      message: "Messages deleted",
      count: deletedMessages.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router
