const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const app = express();

const { PORT, MONGO_URI } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("./public"));

const reminderRoute = require("./routes/reminder.route");

app.get("/", (req, res) => {
  res.status(200).json({
    message: "This is the version one of Reminder API",
  });
});

app.use("/api/v1", reminderRoute);

app.listen(PORT, async () => {
  require("./mongoDB");

  console.log(`The app is listening on PORT ${PORT}`);
});
