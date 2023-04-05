const express = require("express");
let morgan = require("morgan");
let persons = require("./data");

const app = express();
app.use(express.json());

morgan.token("resBody", (req, res) =>
  Object.values(req.body).length !== 0 ? JSON.stringify(req.body) : ""
);
const morganFunc = morgan(
  ":method :url :status :res[content-length] - :response-time ms :resBody"
);

// const secMorganFunc = morgan(function (tokens, req, res) {
//   // console.log(tokens.resBody())
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms',
//     tokens.resBody() ? tokens.resBody : ""
//   ].join(' ')
// })

app.use(morganFunc);

app.get("/api/persons", (req, res, next) => {
  res.json(persons);
});

app.get("/info", (req, res, next) => {
  res.send(`Phonebook has info for ${persons.length} people \n ${new Date()}
    `);
});

app.get("/person/:id", (req, res, next) => {
  const reqID = Number(req.params.id);

  if (!reqID) {
    // when is NaN
    return res.status(400).json({
      msg: "id missing not found",
    });
  }

  const person = persons.find((p) => p.id === reqID);
  if (person) {
    res.json(person);
  } else {
    res.status(400).end("Not found");
  }
});

app.delete("/person/:id", (req, res, next) => {
  const reqID = Number(req.params.id);

  if (!reqID) {
    // when is NaN
    return res.status(400).json({
      msg: "id missing not found",
    });
  }

  persons = persons.filter((p) => p.id !== reqID);
  res.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 1000000000000);

app.post("/api/persons", (req, res, next) => {
  const { body } = req;
  if (!body.name)
    res.status(400).json({
      error: "name is missing",
    });

  const uniquePerson = persons.find((p) => p.name === body.name);

  if (uniquePerson) res.status(400).json({ error: "name must be unique" });

  if (!body.number)
    res.status(400).json({
      error: "number is missing",
    });

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  // morgan.token('resBody', (req, res) => JSON.stringify(person));
  res.json(person);
});

const PORT = 3006;
app.listen(PORT, () =>
  console.log("Listening on ", `http://localhost:${PORT}`)
);
