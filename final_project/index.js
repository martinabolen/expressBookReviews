const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if there's an access token in the session
  const token = req.session.accessToken;

  // If no token is found in the session, return an authentication error
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. No access token found in session.' });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach the decoded user info to the request object (optional)
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid or expired
    return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
