const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const { username, password } = helper.initialUser;
  const passwordHash = await bcrypt.hashSync(password, 10);
  const newUser = new User({ username, passwordHash });
  const user = await newUser.save();

  for (let blog of helper.initialBlogs) {
    blog.user = user.id; // adding user
    let blogObj = new Blog(blog);
    await blogObj.save();
  }
}, 100000);

describe("Getting a blog list", () => {
  test("GET /api/blogs | All bloglist", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 20000);
  test("GET /api/blogs | identifier _id is not for default in DB", async () => {
    const response = await api.get("/api/blogs");
    const ids = response.body.map((_) => _.id);
    expect(ids).toBeDefined();
  }, 20000);
});

describe("Create a new post blog", () => {
  test("POST /api/blogs | new post blog", async () => {
    const newBlog = {
      title: "Benefits of IA applicaion to automatized homes",
      author: "Erick Andrade",
      url: "http:example.com",
      likes: 20000,
    };

    const loginUser = await helper.loginUser(api, helper.initialUser);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${loginUser.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDB();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogs.map((b) => b.title);
    expect(titles).toContain("Benefits of IA applicaion to automatized homes");
  });
}, 12000);

describe("validate values when are missing", () => {
  test("POST /api/blogs | The likes property is missing", async () => {
    const newBlog = {
      title: "Benefits of IA applicaion to automatized homes",
      author: "Erick Andrade",
      url: "http://example.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogs = await helper.blogsInDB();
    expect(blogs).toHaveLength(helper.initialBlogs.length);
  });

  test("POST /api/blogs | The url & title properties are missing", async () => {
    const newBlog = {
      likes: 22,
      author: "Erick Andrade",
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
  });
}, 12000);

describe("validate and manipulate a blog in specific", () => {
  test("DELETE /api/blogs | validate blog is deleted by the same user", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToDelete = blogsAtStart[0];

    const loginUser = await helper.loginUser(api, helper.initialUser);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${loginUser.body.token}`)
      .expect(204);
    const blogsAtEnd = await helper.blogsInDB();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = await blogsAtEnd.map((_) => _.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test("PUT /api/blogs | update likes of a blog", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    const blog = {
      likes: 7879,
    };
    await api.put(`/api/blogs/:${blogToUpdate.id}`).send(blog).expect(200);

    const blogsAtEnd = await helper.blogsInDB();
    const likes = blogsAtEnd.map((_) => _.likes);
    expect(likes).toContain(blogToUpdate.likes);
  });

  test("GET /api/blogs | validate an Nonexisting blog", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test("GET /api/blogs | fails with statuscode 400 id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  }, 20000);
});

describe("Validate users", () => {
  test("POST /api/blogs | validate when user exists", async () => {
    const userAtStart = await helper.usersInDB();

    const newUser = helper.initialUser;

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");
    const userAtEnd = await helper.usersInDB();
    expect(userAtEnd).not.toContain(userAtStart.length);
  });

  test("POST /api/blogs | username and password should be at least 3 characters long", async () => {
    const newUser = {
      username: "fo",
      password: "foo",
      name: "Foo",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const newUserTwo = {
      username: "foo",
      password: "f",
      name: "Foo",
    };
    await api
      .post("/api/users")
      .send(newUserTwo)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe("An user sign-in", () => {
  test("POST /api/blogs | should be signed in", async () => {
    const newUser = helper.initialUser;
    // const agent = supertest.agent(app);

    const result = await api
      .post("/api/login")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(result.body.username).toBeDefined();
    expect(result.body.username).toBe(newUser.username);
  });

  test("POST /api/blogs | should not be signed in with wrong username", async () => {
    const newUser = { username: "Martin McFly", password: "sekret" };
    const result = await api
      .post("/api/login")
      .send(newUser)
      .expect(401)
      .expect("Content-Type", /application\/json/);
    expect(result.body.username).not.toBeDefined();
  });
  test("POST /api/blogs | should not be signed in with wrong password", async () => {
    const newUser = { username: "erick", password: "return to the future" };

    const result = await api
      .post("/api/login")
      .send(newUser)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    expect(result.body.username).not.toBeDefined();
  });
});

afterAll(async () => await mongoose.connection.close(), 20000);
