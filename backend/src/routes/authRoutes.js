const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Define the signup route
// This maps to: POST /api/v1/auth/signup
router.post("/signup", register);

// Define the login route
// This maps to: POST /api/v1/auth/login
router.post("/login", login);

// This maps to:
// GET  /api/v1/auth/me      -> get current user
// PUT  /api/v1/auth/me      -> update profile
router.route("/me").get(protect, getMe).put(protect, updateProfile);

module.exports = router;
