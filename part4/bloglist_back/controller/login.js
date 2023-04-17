const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const config = require("../utils/config");
const User = require("../models/user");

loginRouter.post("/", async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  const passwordChecked =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordChecked)) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const userForToken = {
    username,
    id: user.id,
  };

  const token = await jwt.sign(userForToken, config.SECRET_TKN, {
    expiresIn: 60 * 60,
  });

  res.status(200).send({ token, username, name: user.name });
});

module.exports = loginRouter;
