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
    console.log("🔍 Validating user data:", {
      isLogin,
      hasName: !!data.name,
      hasEmail: !!data.email,
      hasPassword: !!data.password,
    });

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
      console.log("❌ Validation failed with errors:", errors);
      throw new Error(errors.join(", "));
    }

    console.log("✅ User data validation passed");
  }

  // Create a new user
  static async createUser(userData) {
    try {
      console.log("👤 UserService: Starting user creation process");

      // Validate input
      console.log("🔍 Step 1: Validating input data");
      this.validateUserData(userData);

      // Check if user already exists
      console.log(
        "🔍 Step 2: Checking for existing user with email:",
        userData.email.toLowerCase().trim()
      );
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase().trim() },
      });

      if (existingUser) {
        console.log("❌ User already exists with email:", userData.email);
        throw new Error("User with this email already exists");
      }
      console.log("✅ No existing user found");

      // Hash password
      console.log("🔒 Step 3: Hashing password");
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      console.log("✅ Password hashed successfully");

      // Create user in database
      console.log("💾 Step 4: Creating user in database");
      console.log("📝 User data to create:", {
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        // Don't log hashed password
      });

      const user = await prisma.user.create({
        data: {
          name: userData.name.trim(),
          email: userData.email.toLowerCase().trim(),
          password: hashedPassword,
        },
      });

      console.log("✅ User created successfully in database");
      console.log("🆔 Generated user ID:", user.id);

      // Return user data without token (token generated only on login)
      const sanitizedUser = sanitizeUser(user);
      console.log("📤 Returning sanitized user data:", {
        id: sanitizedUser.id,
        email: sanitizedUser.email,
        name: sanitizedUser.name,
      });

      return {
        user: sanitizedUser,
      };
    } catch (error) {
      console.error("❌ UserService - Create user error:", error.message);
      throw error;
    }
  }

  // Authenticate user for login (this is where token is generated)
  static async authenticateUser(email, password) {
    try {
      console.log("🔑 UserService: Starting authentication process");

      // Validate input
      console.log("🔍 Step 1: Validating input data");
      this.validateUserData({ email, password }, true);

      // Find user by email
      console.log(
        "🔍 Step 2: Finding user by email:",
        email.toLowerCase().trim()
      );
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        console.log("❌ User not found with email:", email);
        throw new Error("Invalid credentials");
      }
      console.log("✅ User found:", user.id);

      // Compare passwords
      console.log("🔒 Step 3: Comparing passwords");
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log("❌ Invalid password for user:", user.id);
        throw new Error("Invalid credentials");
      }
      console.log("✅ Password validation successful");

      // Generate JWT token (only during login)
      console.log("🎫 Step 4: Generating JWT token");
      const token = generateToken(user.id);
      console.log("✅ JWT token generated successfully");

      const sanitizedUser = sanitizeUser(user);
      console.log("📤 Returning authentication result:", {
        userId: sanitizedUser.id,
        userEmail: sanitizedUser.email,
        tokenLength: token.length,
        token: token,
      });

      return {
        user: sanitizedUser,
        token,
      };
    } catch (error) {
      console.error("❌ UserService - Authenticate user error:", error.message);
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
