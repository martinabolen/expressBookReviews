const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

const secretKey = "your-secret-key"; // Use env variable in production

// Function to check if the username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Login route to generate JWT token
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    return res.status(200).json({ token });
});

// Middleware to authenticate user via JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        console.log("Authorization Header:", authHeader); // Debugging log
        return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
  

    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden. Invalid token." });
        }

        req.user = decoded; // Attach decoded user info to request object
        next();
    });
};

// PUT Review API (Authenticated Users Only)
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const { isbn } = req.params;
    const review = req.query.review;
    const username = req.user.username; // Extracted from decoded token

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review || typeof review !== "string") {
        return res.status(400).json({ message: "Invalid review" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
 