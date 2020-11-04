var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
const cors = require("cors");

const corsOptions = {
	origin: "*",
};

var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", cors(corsOptions), indexRouter);

module.exports = app;
