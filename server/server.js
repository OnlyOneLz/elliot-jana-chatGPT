const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();
require("dotenv").config();

const app = express();

app.use("/app/", router);
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

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

app.listen(4005, () => console.log("Server listening on port 4005"));
