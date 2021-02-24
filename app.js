const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");

const corsOptions = {
	origin: "*",
};

const indexRouter = require("./routes/index");

const app = express();

app.use(compression());
app.use(logger("dev"));
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", cors(corsOptions), indexRouter);
app.use("/", express.static(path.join(__dirname, "public/assets")));
app.all("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public/assets/index.html"));
});

module.exports = app;
