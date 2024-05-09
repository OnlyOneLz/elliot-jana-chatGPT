const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./schemas/userSchema");
const Conversation = require("./schemas/conversationSchema");
const MessageHistory = require("./schemas/messageHistorySchema");
require("dotenv").config();

const app = express();

app.use("/app/", router);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect(process.env.DATABASE_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Connected to the database");
});

mongoose.connection.on("error", (err) => {
  console.error(`Error connecting to the database: ${err}`);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

// Api Fetch

app.post("/Api-fetch", async (req, res) => {
  const messageHistory = req.body.messageHistory;
  console.log(messageHistory);
  try {
    const response = await fetch(process.env.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messageHistory,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      res.json(data);
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error, "Failed to fetch");
  }
});

// Database Fetch
// Users

app.get("/users", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (user.password === password) {
      res.json(user).status(200);
    } else {
      res.json("Incorrect password").status(401);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/users", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      _id: savedUser._id,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Conversations

app.get("/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/conversations/one/:id", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      userId: req.params.id,
    });
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/conversations", async (req, res) => {
  const { conversationName, userId } = req.body;
  const newConversation = new Conversation({
    conversationName,
    userId,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/conversations/:id", async (req, res) => {
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

// Message History

// GET all messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await MessageHistory.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/messages/:id", async (req, res) => {
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
app.post("/messages", async (req, res) => {
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
app.delete("/messages/:id", async (req, res) => {
  try {
    const deletedMessage = await MessageHistory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
