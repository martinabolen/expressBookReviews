const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
module.exports=books;

public_users.post("/register", (req, res) => {
    // Accept both body and query parameters
    const username = req.body.username || req.query.username;
    const password = req.body.password || req.query.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password });
    res.send("User is registered successfully");
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  let books_title=Object.values(books).map(book=>
    book.title
  );
  res.send(books_title); 
} );

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
        res.json(books[isbn]); // Return the book object if found
    } else {
        res.status(404).json({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const auhtor=req.params.author;
  let filtered_books=Object.values(books).filter(book=>
    book.author==auhtor
  );
  if(filtered_books.length>0){
  res.send(filtered_books);
  }
  else{
    res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title;
    let filtered_books=Object.values(books).filter(book=>
      book.title==title
    );
    if(filtered_books.length>0){
    res.send(filtered_books);
    }
    else{
      res.status(404).json({ message: "Book not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
        res.json(books[isbn].reviews); // Return the book object if found
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
