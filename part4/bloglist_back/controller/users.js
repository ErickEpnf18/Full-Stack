const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  response.status(200).json(users);
});

userRouter.get("/:id", async (request, response) => {
  const users = await User.findById(request.params.id).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  response.status(200).json(users);
});

userRouter.post("/", async (request, response) => {
  const { username, password, name } = request.body;

  if (password.length < 3 || username.length < 3)
    return response.status(400).json({ error: "invalid password or username" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
    name,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = userRouter;
