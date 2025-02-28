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
    let myPromise = new Promise((resolve,reject) => {
     let books_title=Object.values(books).map(book=>
            book.title
          );
        setTimeout(() => {
          resolve(res.send(books_title))
        },6000)})
    console.log("Before calling promise");
    myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
      })

} );

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        
        if (books.hasOwnProperty(isbn)) {
            resolve(books[isbn]); // Resolve with book data
        } else {
            reject({ message: "Book not found" }); // Reject with an error object
        }
    });

    myPromise
        .then((book) => {
            console.log("Books from ISBN:", book);
            res.json(book); // Send response inside .then()
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(404).json(error); // Send error response inside .catch()
        });
});
 
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let myPromise = new Promise((resolve, reject) => { // Fixed syntax
        const author = req.params.author; // Fixed typo
        let filtered_books = Object.values(books).filter(book => book.author === author);

        if (filtered_books.length > 0) {
            resolve(filtered_books);
        } else {
            reject({ message: "Book not found" });
        }
    });

    myPromise
        .then((filtered_books) => {
            console.log("Books by author:", filtered_books);
            res.json(filtered_books);
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(404).json(error);
        });
});


//  Get book review
public_users.get('/title/:title', function (req, res) {
    let myPromise = new Promise((resolve, reject) => { // Fixed syntax
        const title = req.params.title;
        let filtered_books = Object.values(books).filter(book => book.title === title);

        if (filtered_books.length > 0) {
            resolve(filtered_books);
        } else {
            reject({ message: "Book not found" });
        }
    });

    myPromise
        .then((filtered_books) => {
            console.log("Books by title:", filtered_books);
            res.json(filtered_books);
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(404).json(error);
        });
});


module.exports.general = public_users;
