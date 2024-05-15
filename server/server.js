const path = require("node:path")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();
const conversationRoutes = require("./routes/conversationRoutes")
const messageRoutes = require("./routes/messageRoutes")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./schemas/userSchema");
const googleAuth = require("./google-auth/google-auth");
const verifyToken = require("./verifyToken")
require("dotenv").config();
require("./db") // initialise db connection

const app = express();

app.use(express.static(path.join(process.cwd(),"../client/src")))
// Index route needs to be ABOVE the router middleware
app.get("/", ( _, res ) => {
  res.sendFile(path.join(__dirname, '../client/src/html', 'index.html'))
})

app.get("/login", ( _, res ) => {
  res.sendFile(path.join(__dirname, '../client/src/html', 'login.html'))
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

app.use("/conversations", conversationRoutes)

// Message History

app.use("/messages", messageRoutes)
