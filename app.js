var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");

var UserRouter = require("./routes/UserRouter");

var app = express();
const url = "mongodb://localhost:27017/cerodb";
const mongoose = require("mongoose");

require("dotenv/config");

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Cero_Database",
  })
  .then(() => {
    console.log("Database connected....");
  })
  .catch((err) => {
    console.log(err);
  });

/*
const Users = require("./modals/User");
const connect = mongoose.connect(url);
connect.then(
  (db) => {
    console.log("Connected to Server");
  },
  (err) => {
    console.log(err);
  }
);
*/

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", UserRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
