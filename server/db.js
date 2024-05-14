const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Connected to the database");
});

mongoose.connection.on("error", (err) => {
  console.error(`Error connecting to the database: ${err}`);
});

module.exports = mongoose.connection
