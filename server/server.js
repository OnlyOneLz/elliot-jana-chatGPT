const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/fetchRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", apiRoutes);

app.listen(4005, () => console.log("Server listening on port 4005"));
