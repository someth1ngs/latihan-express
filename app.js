const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan("dev"));

const logger = function (req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
};
app.use(logger);

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/products", function (req, res) {
  res.json(["Apple", "Samsung", "One Plus"]);
});

const date = function (req, res, next) {
  const currentDate = new Date(Date.now());
  console.log(currentDate.toLocaleString());
  next();
};

app.get("/orders", date, function (req, res) {
  let paid = req.query.paid;
  let orders = [
    { id: 1, paid: true, user_id: 1 },
    { id: 2, paid: false, user_id: 2 },
    { id: 3, paid: true, user_id: 3 },
  ];
  if (paid) {
    orders = orders.filter((i) => {
      return i.paid == (paid == "true");
    });
  }
  res.json(orders);
});

app.get("/orders/:id", function (req, res) {
  let id = Number(req.params.id);

  res.json({ id: id, paid: true, user_id: id });
});

app.post("/orders", function (req, res) {
  res.json(req.body);
});

// internal server error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ err: err.message });
});

// 404 error handler
app.use((req, res, next) => {
  res
    .status(404)
    .json({ err: `are you lost? ${req.method} ${req.url} is not registered!` });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
