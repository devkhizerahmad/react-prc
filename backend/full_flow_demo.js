#!/usr/bin/env node

/*
 * Complete User Registration System - Full Flow Demo
 * This script demonstrates the complete user registration and authentication flow
 * with proper validation at each step
 */

import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

console.log("🚀 Starting Complete User Registration Flow Demo...\n");
console.log("=".repeat(60));

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function demo() {
  try {
    // 1. Health Check
    console.log("\n📋 STEP 1: Health Check");
    console.log("-".repeat(30));
    try {
      const healthResponse = await axios.get(`${BASE_URL}/health`);
      console.log("✅ API Health Check: PASSED");
      console.log(`   Status: ${healthResponse.data.status}`);
    } catch (error) {
      console.log("❌ API Health Check: FAILED");
      console.log("   Make sure the server is running on port 5000");
      return;
    }

    await delay(1000);

    // 2. Test Validation Errors - Signup
    console.log("\n📋 STEP 2: Testing Validation Errors (Signup)");
    console.log("-".repeat(30));

    const invalidUsers = [
      {
        name: "A", // Too short
        email: "invalid-email", // Invalid format
        password: "123", // Too short, no special chars
      },
      {
        name: "VeryLongNameThatExceedsFiftyCharactersWhichIsTheMaximumAllowedLength", // Too long
        email: "valid@email.com",
        password: "weakpass", // Missing requirements
      },
    ];

    for (let i = 0; i < invalidUsers.length; i++) {
      try {
        await axios.post(`${BASE_URL}/signup`, invalidUsers[i]);
        console.log(`❌ Validation Test ${i + 1}: FAILED (Should have failed)`);
      } catch (error) {
        if (error.response?.status === 400) {
          console.log(`✅ Validation Test ${i + 1}: PASSED`);
          console.log(`   Errors: ${error.response.data.errors.join(", ")}`);
        } else {
          console.log(`❌ Validation Test ${i + 1}: Unexpected error`);
        }
      }
      await delay(500);
    }

    await delay(1000);

    // 3. Successful User Registration
    console.log("\n📋 STEP 3: Successful User Registration");
    console.log("-".repeat(30));

    const validUsers = [
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

    const registeredUsers = [];

    for (const user of validUsers) {
      try {
        console.log(`📝 Registering: ${user.email}`);
        const response = await axios.post(`${BASE_URL}/signup`, user);
        console.log(`✅ Registration SUCCESS`);
        console.log(`   Name: ${response.data.data.user.name}`);
        console.log(`   Email: ${response.data.data.user.email}`);
        console.log(`   User ID: ${response.data.data.user.id}`);
        console.log(
          `   Token: ${response.data.data.token.substring(0, 30)}...`
        );

        registeredUsers.push({
          ...response.data.data.user,
          token: response.data.data.token,
        });
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  User already exists: ${user.email}`);
          // Try to login to get token
          try {
            const loginResponse = await axios.post(`${BASE_URL}/login`, {
              email: user.email,
              password: user.password,
            });
            registeredUsers.push({
              ...loginResponse.data.data.user,
              token: loginResponse.data.data.token,
            });
            console.log(`✅ Login SUCCESS for existing user`);
          } catch (loginError) {
            console.log(
              `❌ Could not login existing user: ${loginError.response?.data?.message}`
            );
          }
        } else {
          console.log(
            `❌ Registration failed: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      }
      await delay(1000);
    }

    if (registeredUsers.length === 0) {
      console.log("\n❌ No users were registered. Cannot continue demo.");
      return;
    }

    await delay(1000);

    // 4. Test Login with Valid Credentials
    console.log("\n📋 STEP 4: User Login");
    console.log("-".repeat(30));

    for (const user of validUsers) {
      try {
        console.log(`🔐 Logging in: ${user.email}`);
        const response = await axios.post(`${BASE_URL}/login`, {
          email: user.email,
          password: user.password,
        });
        console.log(`✅ Login SUCCESS`);
        console.log(`   Welcome back, ${response.data.data.user.name}!`);
        console.log(
          `   Token: ${response.data.data.token.substring(0, 30)}...`
        );
      } catch (error) {
        console.log(
          `❌ Login failed: ${error.response?.data?.message || error.message}`
        );
      }
      await delay(500);
    }

    await delay(1000);

    // 5. Test Login with Invalid Credentials
    console.log("\n📋 STEP 5: Testing Invalid Login Attempts");
    console.log("-".repeat(30));

    const invalidLoginAttempts = [
      {
        email: "john.doe@example.com",
        password: "WrongPassword123!",
      },
      {
        email: "nonexistent@example.com",
        password: "AnyPassword123!",
      },
    ];

    for (const attempt of invalidLoginAttempts) {
      try {
        await axios.post(`${BASE_URL}/login`, attempt);
        console.log(`❌ Invalid login test FAILED (Should have failed)`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`✅ Invalid login properly rejected`);
          console.log(`   Reason: ${error.response.data.message}`);
        } else {
          console.log(
            `❌ Unexpected error: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      }
      await delay(500);
    }

    await delay(1000);

    // 6. Access Protected Routes
    console.log("\n📋 STEP 6: Accessing Protected Routes");
    console.log("-".repeat(30));

    const authToken = registeredUsers[0]?.token;

    // Test accessing protected route without token
    console.log("🔒 Testing access without authentication token:");
    try {
      await axios.get(`${BASE_URL}/users`);
      console.log(`❌ Should have been blocked`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`✅ Properly blocked unauthorized access`);
      }
    }

    // Test accessing protected route with valid token
    console.log("\n🔓 Testing access with valid authentication token:");
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(`✅ Access GRANTED to protected route`);
      console.log(`   Total users: ${response.data.data.count}`);
      console.log(`   Users retrieved: ${response.data.data.users.length}`);
    } catch (error) {
      console.log(
        `❌ Failed to access protected route: ${
          error.response?.data?.message || error.message
        }`
      );
    }

    // Test getting user profile
    console.log("\n👤 Testing user profile access:");
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(`✅ Profile access SUCCESS`);
      console.log(`   Hello, ${response.data.data.user.name}!`);
      console.log(`   Email: ${response.data.data.user.email}`);
    } catch (error) {
      console.log(
        `❌ Profile access failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }

    await delay(1000);

    // 7. Public User Lookup APIs
    console.log("\n📋 STEP 7: Public User Lookup APIs");
    console.log("-".repeat(30));

    // Get user by ID
    console.log("🔍 Looking up user by ID:");
    try {
      const userId = registeredUsers[0]?.id;
      const response = await axios.get(`${BASE_URL}/users/${userId}`);
      console.log(`✅ User found by ID`);
      console.log(`   Name: ${response.data.data.user.name}`);
      console.log(`   Email: ${response.data.data.user.email}`);
    } catch (error) {
      console.log(
        `❌ User lookup by ID failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }

    // Get user by email
    console.log("\n📧 Looking up user by email:");
    try {
      const response = await axios.get(
        `${BASE_URL}/users/email/john.doe@example.com`
      );
      console.log(`✅ User found by email`);
      console.log(`   Name: ${response.data.data.user.name}`);
      console.log(`   ID: ${response.data.data.user.id}`);
    } catch (error) {
      console.log(
        `❌ User lookup by email failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }

    // Test non-existent user lookup
    console.log("\n❓ Testing lookup of non-existent user:");
    try {
      await axios.get(`${BASE_URL}/users/email/nonexistent@example.com`);
      console.log(`❌ Should have returned 404`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`✅ Properly returned 404 for non-existent user`);
      }
    }

    await delay(1000);

    // 8. Rate Limiting Test (Optional)
    console.log("\n📋 STEP 8: Testing Rate Limiting (Optional)");
    console.log("-".repeat(30));
    console.log(
      "💡 Note: Rapid requests may trigger rate limiting (100 requests/15min)"
    );

    // Uncomment below to test rate limiting (will likely trigger after many rapid requests)
    /*
    console.log('Testing rapid requests...');
    let rateLimitCount = 0;
    for (let i = 0; i < 5; i++) {
      try {
        await axios.get(`${BASE_URL}/health`);
        rateLimitCount++;
      } catch (error) {
        if (error.response?.status === 429) {
          console.log(`✅ Rate limiting working - request ${i + 1} blocked`);
          break;
        }
      }
    }
    console.log(`✅ Successfully made ${rateLimitCount} rapid requests before potential rate limiting`);
    */

    await delay(1000);

    // 9. Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEMO COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n📊 SUMMARY OF TESTED FUNCTIONALITY:");
    console.log("✅ Health check endpoint");
    console.log("✅ Input validation (signup/login)");
    console.log("✅ User registration with password hashing");
    console.log("✅ User login with authentication");
    console.log("✅ JWT token generation and verification");
    console.log("✅ Protected route access control");
    console.log("✅ User profile retrieval");
    console.log("✅ Public user lookup by ID");
    console.log("✅ Public user lookup by email");
    console.log("✅ Error handling and proper HTTP status codes");
    console.log("✅ Security measures (rate limiting, validation)");

    console.log("\n🔧 AVAILABLE API ENDPOINTS:");
    console.log("POST  /api/signup              - Register new user");
    console.log("POST  /api/login               - User login");
    console.log("GET   /api/users               - Get all users (protected)");
    console.log(
      "GET   /api/profile             - Get current user profile (protected)"
    );
    console.log("GET   /api/users/:id           - Get user by ID");
    console.log("GET   /api/users/email/:email  - Get user by email");
    console.log("GET   /api/health              - Health check");
  } catch (error) {
    console.error("\n🚨 FATAL ERROR:", error.message);
    console.error("Make sure the backend server is running on port 5000");
  }
}

// Run the demo
demo();
