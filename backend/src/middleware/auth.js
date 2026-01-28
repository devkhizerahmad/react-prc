import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";

// Export prisma client for use in other files
export { prisma };

// Sample users are now stored in the database

// Authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = verifyToken(token);

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - user not found",
      });
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Optional authentication middleware (doesn't require auth but adds user if present)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      try {
        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, name: true },
        });

        if (user) {
          req.user = user;
        }
      } catch (err) {
        // Silently continue if token is invalid
      }
    }
    next();
  } catch (error) {
    // Silently continue if token is invalid
    next();
  }
};

// Generate JWT token (deprecated - use signToken from jwt.js)
export const generateToken = (userId) => {
  console.warn(
    "generateToken is deprecated. Use signToken from utils/jwt.js instead."
  );
  return verifyToken.sign(
    { userId },
    process.env.JWT_SECRET || "your-secret-key",
    {
      expiresIn: "24h",
    }
  );
};
