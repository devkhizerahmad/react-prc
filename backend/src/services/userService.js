import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";

// Helper function to sanitize user data (remove password)
const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Input validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// Generate JWT token
const generateToken = (userId) => {
  return signToken({ userId });
};

// User Service - Business Logic Layer
export class UserService {
  // Validate user input data
  static validateUserData(data, isLogin = false) {
    const errors = [];

    if (!isLogin) {
      if (!validateName(data.name)) {
        errors.push("Name must be at least 2 characters long");
      }
    }

    if (!validateEmail(data.email)) {
      errors.push("Valid email is required");
    }

    if (!isLogin && !validatePassword(data.password)) {
      errors.push("Password must be at least 6 characters long");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }

  // Create a new user
  static async createUser(userData) {
    try {
      // Validate input
      this.validateUserData(userData);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase().trim() },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user in database
      const user = await prisma.user.create({
        data: {
          name: userData.name.trim(),
          email: userData.email.toLowerCase().trim(),
          password: hashedPassword,
        },
      });

      // Return user data without token (token generated only on login)
      return {
        user: sanitizeUser(user),
      };
    } catch (error) {
      console.error("UserService - Create user error:", error.message);
      throw error;
    }
  }

  // Authenticate user for login (this is where token is generated)
  static async authenticateUser(email, password) {
    try {
      // Validate input
      this.validateUserData({ email, password }, true);

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Generate JWT token (only during login)
      const token = generateToken(user.id);

      return {
        user: sanitizeUser(user),
        token,
      };
    } catch (error) {
      console.error("UserService - Authenticate user error:", error.message);
      throw error;
    }
  }

  // Get all users
  static async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        users,
        count: users.length,
      };
    } catch (error) {
      console.error("UserService - Get all users error:", error.message);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error("UserService - Get user by ID error:", error.message);
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error("UserService - Get user by email error:", error.message);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error("UserService - Get user profile error:", error.message);
      throw error;
    }
  }
}
