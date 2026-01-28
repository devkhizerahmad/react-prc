import jwt from "jsonwebtoken";
import "dotenv/config";

// JWT Secret (you should use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-2024";

// JWT Options
const JWT_OPTIONS = {
  expiresIn: process.env.JWT_EXPIRES_IN || "1h",
};

// Sign JWT token
export function signToken(payload, options = {}) {
  try {
    return jwt.sign(
      payload,
      JWT_SECRET,
      Object.assign({}, JWT_OPTIONS, options)
    );
  } catch (error) {
    console.error("Error signing JWT token:", error.message);
    throw error;
  }
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.error("JWT token validation error");
    } else if (error.name === "TokenExpiredError") {
      console.error("JWT token has expired");
    }
    throw error;
  }
}
