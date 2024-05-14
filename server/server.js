const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./schemas/userSchema");
const Conversation = require("./schemas/conversationSchema");
const MessageHistory = require("./schemas/messageHistorySchema");
const googleAuth = require("./google-auth/google-auth");
const path = require("node:path")
require("dotenv").config();
require("./db") // initialise db connection

const app = express();

app.use(express.static(path.join(process.cwd(),"../client/src")))
// Index route needs to be ABOVE the router middleware
app.get("/", ( _, res ) => {
  res.sendFile(path.join(__dirname, '../client/src/html', 'index.html'))
})

app.use("/app/", router);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

// GOOGLE API

googleAuth(app);

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
    if (response.ok) {
      res.json(data);
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error, "Failed to fetch");
  }
});

// Token Verification

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token." });
      }
      req.userId = decoded.userId;
      next();
    }
  );
}

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This route is protected.", userId: req.userId });
});

// Users

app.post("/user/get", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res
        .status(401)
        .json({ cause: "email", message: "No user with this email." });
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({ user, token });
      } else {
        res
          .status(401)
          .json({ cause: "password", message: "Incorrect password" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/users", async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ token: token });
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

app.get("/conversations/user/:id", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      userId: req.params.id,
    }).sort({ createdAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/conversations/one/:id", async (req, res) => {
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

app.delete("/conversations/all/:id", async (req, res) => {
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
