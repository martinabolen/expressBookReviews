const express = require("express");
const app = express();
const PORT = 3000;

const auth_routes = require("./auth_users.js").authenticated;  // Import registered user routes
const public_routes = require("./general.js").general;  // Import public routes

app.use(express.json()); // ✅ Middleware to parse JSON

// ✅ Mount authentication & public routes
app.use("/auth", auth_routes);  // Fix: Ensure auth routes are correctly mounted
app.use("/", public_routes);    // Fix: Ensure public routes are mounted

// ✅ Start the Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
