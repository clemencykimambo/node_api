import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

// Check the database connection before each query
function handleDisconnect() {
  db.connect(function (err) {
    if (err) {
      console.log("Error connecting to database:", err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  db.on("error", function (err) {
    console.log("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

app.use(express.json());
//cors for allow data to be used by react
app.use(cors());

app.get("/", (req, res) => {
  res.json("hell am a clemency frm cleme devs!");
});

// Fetching all the books from the books table
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Getting a single book
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM books WHERE id = ?";

  db.query(q, [id], (err, data) => {
    if (err) return res.json(err);

    const singleBook = data.find((book) => book.id === Number(id));

    if (!singleBook) {
      return res.status(404).send("Book Does Not Exist");
    }

    return res.json(data);
  });
});

// Inserting a book into the books table
app.post("/books", (req, res) => {
  const q =
    "INSERT INTO books (title, description, price, cover) VALUES (?, ?, ?, ? )";
  const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("book created successful");
  });
});

// Deleting a book in the books table
app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;

  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("book deleted successful");
  });
});

// Updating a book in the books table
app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;

  const q =
    "UPDATE books SET `title`=?, `description`=?, `price`=?, `cover`=? WHERE id=?";

  const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("book updated successfull");
  });
});

app.listen(8800, () => {
  console.log("your connected to backend123");
});
