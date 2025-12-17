const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/todoApp")
  .then(() => console.log("MongoDB connected"));

app.use("/todos", require("./routes/todoRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
