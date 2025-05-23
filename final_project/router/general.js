const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

const getBooks = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 0);
  });
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const bookList = await getBooks()
  res.send(JSON.stringify(bookList, null, 4));
});

const getBookDetails = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn])
    }, 0);
  });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const bookDetails = await getBookDetails(isbn);
  res.send(bookDetails);
});
  
const getBookAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksAuthor = [];
      for (const key in books) {
        if (books.hasOwnProperty(key)) {
          if (books[key].author === author) {
            booksAuthor.push(books[key]);
          }
        }
      }
      resolve(booksAuthor);
    }, 0);
  });
};

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const booksByAuthor = await getBookAuthor(author);
  if (booksByAuthor.length > 0) {
    res.send(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by that author" });
  }
});

const getBookTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksTitle = [];
      for (const key in books) {
        if (books.hasOwnProperty(key)) {
          if (books[key].title === title) {
            booksTitle.push(books[key])
          }
        }
      }
      resolve(booksTitle)
    }, 0);
  })
};

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const booksbyTitle = await getBookTitle(title)

  if (booksbyTitle.length > 0) {
    res.send(booksbyTitle)
  } else {
    res.status(404).json({ message: "No books found by that title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
