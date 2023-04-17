const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const blogRouter = require("express").Router();

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const { likes, title, author, url } = request.body;

  if (typeof url === "undefined" || typeof title === "undefined")
    return response.status(400).json({ error: "Url & title are missing." });

  if (typeof likes === "undefined")
    return response.status(400).json({ error: "likes is missing." });

  const decodedUser = request.user;
  if (!decodedUser.id) {
    return response.status(401).json({ error: "Invalid token." });
  }

  // adding a blog to any user (the first user)
  const user = await User.findById(decodedUser.id).populate("blogs", {
    author: 1,
  });

  const newBlog = new Blog({
    likes,
    title,
    author,
    url,
    user: user.id,
  });

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogRouter.get("/:id", async ({ params: { id } }, response, next) => {
  const blog = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  if (blog) {
    return response.status(200).json(blog);
  } else {
    return response.status(404).end();
  }
});

blogRouter.delete("/:id", async (request, response) => {
  const blogId = request.params.id;

  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: "invalid token" });
  }

  const blog = await Blog.findById(blogId);

  if (JSON.stringify(blog) === "null")
    return response.status(400).json({ error: "the blog doesn't exist" });

  if (blog.user.length === 0) {
    return response.status(400).json({ error: "blog's user doesn't exist" });
  }
  if (!(blog.user.toString() === user.id.toString())) {
    return response
      .status(401)
      .json({ error: "this user can't delete this blog" });
  }

  await Blog.findByIdAndRemove(blogId);
  await response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
  const blog = request.body;
  const { id } = request.params.id;

  const opts = {
    runValidators: true,
    context: "query",
    new: true,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, opts);
  await response.status(200).json(updatedBlog);
});

module.exports = blogRouter;
