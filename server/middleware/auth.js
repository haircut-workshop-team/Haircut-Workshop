const jwt = require("jsonwebtoken");
require("dotenv").config();

// Validate JWT_SECRET exists on startup
if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

const authenticateToken = (req, res, next) => {
  // Get the token from the header
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided",
    });
  }

  // Validate Bearer format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format. Use: Bearer <token>",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Log error for debugging
    console.error("Token verification failed:", error.message);

    // Provide specific error messages
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Token verification failed",
    });
  }
};

module.exports = authenticateToken;
