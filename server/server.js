const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// 🔐 middleware imports
const protect = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

dotenv.config();

const app = express();

// connect database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// 🔹 basic route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// 🔹 test API
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working ✅" });
});

// 🔹 auth routes
app.use("/api/auth", authRoutes);

// 🔹 protected route (any logged-in user)
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route 🎉",
    user: req.user,
  });
});

// 🔹 role-based route (warden only)
app.get("/api/warden", protect, authorizeRoles("warden"), (req, res) => {
  res.json({ message: "Warden access only 👮" });
});

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const issueRoutes = require("./routes/issueRoutes");
app.use("/api/issues", issueRoutes);

// server start
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Health check initialized.");
});