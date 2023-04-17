const morgan = require("morgan");
const logger = require("./logger");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

morgan.token("body", ({ body }) => JSON.stringify(body));
const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :body"
);

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.replace("Bearer ", "");
    request.token = token;
  }
  return next();
};

const userExtractor = async (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.replace("Bearer ", "");
    const decodedToken = await jwt.verify(token, config.SECRET_TKN);
    request.user = decodedToken;
  }
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === "CastError")
    return response.status(400).send({ error: "malformatted id" });
  if (error.name === "ValidationError")
    return response.status(400).json({ error: error.message });
  if (error.name === "JsonWebTokenError")
    return response.status(400).json({ error: error.message });
  if (error.name === "TokenExpiredError")
    return response.status(401).json({ error: "token expired" });

  return next(error);
};

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
