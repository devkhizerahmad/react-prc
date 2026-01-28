/*
 * Complete User Registration System - Demo Script
 * This script demonstrates all the functionality of the user registration system
 *
 * Features included:
 * - User registration with validation
 * - User login with authentication
 * - Password hashing
 * - JWT token generation
 * - Protected routes
 * - Input validation middleware
 * - Error handling
 * - API endpoints for all required operations
 */

import axios from "axios";

// Base URL for the API
const BASE_URL = "http://localhost:5000/api";

// Test users
const testUsers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "SecurePass123!",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "MySecretPass456@",
  },
];

console.log("🚀 Starting User Registration System Demo...\n");

async function demo() {
  try {
    // 1. Health check
    console.log("1. Checking API health...");
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health check passed:", healthResponse.data.status);
    console.log("");

    // 2. Register users
    console.log("2. Registering users...");
    const registeredUsers = [];

    for (const user of testUsers) {
      try {
        const response = await axios.post(`${BASE_URL}/signup`, user);
        console.log(`✅ User registered: ${user.email}`);
        console.log(
          `   Token: ${response.data.data.token.substring(0, 20)}...`
        );
        registeredUsers.push({
          ...response.data.data.user,
          token: response.data.data.token,
        });
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  User already exists: ${user.email}`);
        } else {
          console.log(
            `❌ Registration failed for ${user.email}:`,
            error.response?.data?.message || error.message
          );
        }
      }
    }
    console.log("");

    // 3. Login users
    console.log("3. Logging in users...");
    const loggedInUsers = [];

    for (const user of testUsers) {
      try {
        const response = await axios.post(`${BASE_URL}/login`, {
          email: user.email,
          password: user.password,
        });
        console.log(`✅ User logged in: ${user.email}`);
        loggedInUsers.push({
          ...response.data.data.user,
          token: response.data.data.token,
        });
      } catch (error) {
        console.log(
          `❌ Login failed for ${user.email}:`,
          error.response?.data?.message || error.message
        );
      }
    }
    console.log("");

    // 4. Test protected routes with valid token
    if (loggedInUsers.length > 0) {
      console.log("4. Testing protected routes...");

      // Get all users
      try {
        const response = await axios.get(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${loggedInUsers[0].token}`,
          },
        });
        console.log(`✅ Retrieved ${response.data.data.count} users`);
      } catch (error) {
        console.log(
          "❌ Failed to get all users:",
          error.response?.data?.message || error.message
        );
      }

      // Get user profile
      try {
        const response = await axios.get(`${BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${loggedInUsers[0].token}`,
          },
        });
        console.log(
          `✅ Retrieved profile for: ${response.data.data.user.name}`
        );
      } catch (error) {
        console.log(
          "❌ Failed to get profile:",
          error.response?.data?.message || error.message
        );
      }
    }
    console.log("");

    // 5. Test public routes to get users by ID and email
    console.log("5. Testing public user lookup routes...");

    // Get user by ID (using first user if available)
    if (registeredUsers.length > 0) {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/${registeredUsers[0].id}`
        );
        console.log(`✅ Found user by ID: ${response.data.data.user.name}`);
      } catch (error) {
        console.log(
          "❌ Failed to get user by ID:",
          error.response?.data?.message || error.message
        );
      }
    }

    // Get user by email
    try {
      const response = await axios.get(
        `${BASE_URL}/users/email/john.doe@example.com`
      );
      console.log(`✅ Found user by email: ${response.data.data.user.name}`);
    } catch (error) {
      console.log(
        "❌ Failed to get user by email:",
        error.response?.data?.message || error.message
      );
    }
    console.log("");

    // 6. Test error cases
    console.log("6. Testing error handling...");

    // Invalid signup data
    try {
      await axios.post(`${BASE_URL}/signup`, {
        name: "A",
        email: "invalid-email",
        password: "123",
      });
    } catch (error) {
      console.log("✅ Validation error caught for invalid signup data");
    }

    // Invalid login
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });
    } catch (error) {
      console.log("✅ Authentication error caught for invalid credentials");
    }

    // Access protected route without token
    try {
      await axios.get(`${BASE_URL}/users`);
    } catch (error) {
      console.log("✅ Authorization error caught for missing token");
    }

    // Access protected route with invalid token
    try {
      await axios.get(`${BASE_URL}/users`, {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });
    } catch (error) {
      console.log("✅ Authorization error caught for invalid token");
    }

    console.log("\n🎉 Demo completed successfully!");
    console.log("\n📋 Available API Endpoints:");
    console.log("POST  /api/signup              - Register a new user");
    console.log("POST  /api/login               - Login user");
    console.log("GET   /api/users               - Get all users (protected)");
    console.log(
      "GET   /api/profile             - Get current user profile (protected)"
    );
    console.log("GET   /api/users/:id           - Get user by ID");
    console.log("GET   /api/users/email/:email  - Get user by email");
    console.log("GET   /api/health              - Health check");
  } catch (error) {
    console.error("🚨 Demo failed:", error.message);
    console.error("Make sure the server is running on port 5000");
  }
}

// Run the demo
demo();
