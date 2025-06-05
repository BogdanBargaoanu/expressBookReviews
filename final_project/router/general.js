const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Add axios for HTTP requests


// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Promise version for getting all books
public_users.get('/promise/books', (req, res) => {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then(data => res.status(200).json(data))
    .catch(() => res.status(500).json({ message: "Error retrieving books" }));
});

// Async/Await with Axios version for getting all books
public_users.get('/async/books', async (req, res) => {
  try {
    // Simulate axios call to self
    const response = await axios.get('http://localhost:5000/'); // Adjust port if needed
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Promise version for getting book by ISBN
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) resolve(book);
    else reject();
  })
    .then(book => res.status(200).json(book))
    .catch(() => res.status(404).json({ message: "Book not found" }));
});

// Async/Await with Axios version for getting book by ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`); // Adjust port if needed
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Promise version for getting books by author
public_users.get('/promise/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
    if (filteredBooks.length > 0) resolve(filteredBooks);
    else reject();
  })
    .then(books => res.status(200).json(books))
    .catch(() => res.status(404).json({ message: "No books found for this author" }));
});

// Async/Await with Axios version for getting books by author
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`); // Adjust port if needed
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Promise version for getting books by title
public_users.get('/promise/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
    if (filteredBooks.length > 0) resolve(filteredBooks);
    else reject();
  })
    .then(books => res.status(200).json(books))
    .catch(() => res.status(404).json({ message: "No books found with this title" }));
});

// Async/Await with Axios version for getting books by title
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`); // Adjust port if needed
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
