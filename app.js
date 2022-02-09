const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
// const fileUpload = require("express-fileupload");

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
    message: "This is the version one of library management system API",
    "api-documentation_link": `<a href="https://documenter.getpostman.com/view/5643221/UVXbtefA">API-Docs</a>`,
  });
});

app.use("/api/v1", reminderRoute);

app.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database is connected");
  } catch (error) {
    console.log(`Database Not Connected`);
  }
  console.log(`The app is listening on PORT ${PORT}`);
});
