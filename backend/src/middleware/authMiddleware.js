const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  // Check if the token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Get token from "Bearer <token>"
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token, return 401 (Not Authorized)
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    // Verify the token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user by ID and attach it to the request object
    // We exclude the password for security
    req.user = await User.findById(decoded.id).select("-password");

    // Move to the next piece of logic
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Token is not valid" });
  }
};
