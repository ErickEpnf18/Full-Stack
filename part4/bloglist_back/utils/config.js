require("dotenv").config();

const PORT = process.env.PORT || 3001;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const SECRET_TKN = process.env.SECRET_TOKEN;

module.exports = { PORT, MONGODB_URI, SECRET_TKN };
