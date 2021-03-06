require("dotenv/config");

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const initFirebase = require("./config/firebase.js");
const {
  messageNotification,
} = require("./controllers/firebaseMessaging/messaging");
const fs = require("fs");

const {
  IndexRouter,
  CardRouter,
  UserRouter,
  MomentRouter,
  LocationRouter,
  AuthRouter,
  AgoraRouter,
  RoomRouter,
  InterestRouter,
  NotificationRouter,
  ReportRouter,
} = require("./routes");

var dir = "./uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
const app = express();
const mongoose = require("mongoose");
initFirebase();
messageNotification();

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    dbName: "Cero_Database",
  })
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((err) => {
    console.log("database connection failed. exiting now...");
    console.error(err);
    process.exit(1);
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", IndexRouter);
app.use("/users", UserRouter);
app.use("/cards", CardRouter);
app.use("/moments", MomentRouter);
app.use("/location", LocationRouter);
app.use("/interest", InterestRouter);
app.use("/auth", AuthRouter);
app.use("/agora", AgoraRouter);
app.use("/notifications", NotificationRouter);
app.use("/report", ReportRouter);

//Rooms
app.use("/room", RoomRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
