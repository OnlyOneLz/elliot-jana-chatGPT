const Conversation = require("../schemas/conversationSchema");
const MessageHistory = require("../schemas/messageHistorySchema")
const express = require("express")
const router = express.Router()
const verifyToken = require("../verifyToken")

router.get("/", async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      userId: req.params.id,
    }).sort({ createdAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/one/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    const messages = await MessageHistory.find({
      conversationId: req.params.id,
    });
    res.json({ conversation: conversation, messages: messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { conversationName, userId } = req.body;
  const newConversation = new Conversation({
    conversationName,
    userId,
  });

  try {
    const savedConversation = await newConversation.save();
    console.log(savedConversation)
    res.status(201).json(savedConversation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedConversation = await Conversation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json({ message: "Conversation deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/all/:id", async (req, res) => {
  try {
    const deletedConversation = await Conversation.find({
      userId: req.params.id,
    });
    if (!deletedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json({ message: "Conversation deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router
