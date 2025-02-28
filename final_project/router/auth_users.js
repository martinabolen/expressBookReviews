const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

const isValid = (username) => users.some(user => user.username === username);
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];  // Get the Authorization header

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];  // Extract token from "Bearer <token>"

        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;  // Attach user info to request
                return next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "No token provided" });
    }
};


const app = express();
app.use(express.json());
app.use(session({
    secret: "fingerprint",
    resave: false,
    saveUninitialized: true
}));

// Login Route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username" });
    }

    if (!users.some(user => user.username === username && user.password === password)) {
        return res.status(401).json({ message: "Incorrect password" });
    }

    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    req.session.authorization = { accessToken };

    return res.status(200).json({ message: "Login successful", token: accessToken });
});

// PUT Review API
// Update the PUT Review API
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;  // Changed to req.body
    const username = req.user.username;

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
