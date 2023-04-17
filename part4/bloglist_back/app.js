const express = require("express");
require("express-async-errors");
const cors = require("cors");
const blogsRouter = require("./controller/blogs.js");
const usersRouter = require("./controller/users.js");
const loginRouter = require("./controller/login.js");
const middleware = require("./utils/middleware.js");
const { info, error } = require("./utils/logger.js");
const config = require("./utils/config.js");
const mongoose = require("mongoose");

const app = express();
mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => info("Connected to mongoDB"))
  .catch((errors) => error(errors));

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// use the middleware in all routes
// app.use(middleware.userExtractor);

// use the middleware only in /api/blogs routes
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
