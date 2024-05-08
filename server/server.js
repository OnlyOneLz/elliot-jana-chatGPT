const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.listen(4005, () => console.log("Server listening on port 4005"));
