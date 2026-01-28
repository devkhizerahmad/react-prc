#!/usr/bin/env node

/*
 * Quick Test Script for User Registration System
 * Tests basic functionality without complex validation
 */

import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

async function quickTest() {
  console.log("⚡ Quick Test of User Registration System\n");

  try {
    // Test 1: Health check
    console.log("1. Testing health endpoint...");
    const health = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Health check: ${health.data.status}`);

    // Test 2: User registration
    console.log("\n2. Testing user registration...");
    const userData = {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "TestPass123!",
    };

    const signupResponse = await axios.post(`${BASE_URL}/signup`, userData);
    console.log(`✅ User registered: ${signupResponse.data.data.user.email}`);
    const token = signupResponse.data.data.token;

    // Test 3: User login
    console.log("\n3. Testing user login...");
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: userData.email,
      password: userData.password,
    });
    console.log(`✅ User logged in: ${loginResponse.data.data.user.name}`);

    // Test 4: Protected route access
    console.log("\n4. Testing protected route access...");
    const usersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(
      `✅ Protected route accessed. Users found: ${usersResponse.data.data.count}`
    );

    // Test 5: User profile
    console.log("\n5. Testing user profile...");
    const profileResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ Profile retrieved: ${profileResponse.data.data.user.name}`);

    // Test 6: Public user lookup
    console.log("\n6. Testing public user lookup...");
    const userLookupResponse = await axios.get(
      `${BASE_URL}/users/email/${userData.email}`
    );
    console.log(
      `✅ User lookup successful: ${userLookupResponse.data.data.user.name}`
    );

    console.log("\n🎉 All tests passed! System is working correctly.");
    console.log("\n📚 Available Commands:");
    console.log("npm run demo        - Full validation flow demo");
    console.log("npm run demo-full   - Comprehensive functionality demo");
    console.log("npm run dev         - Start development server");
  } catch (error) {
    console.error(
      "❌ Test failed:",
      error.response?.data?.message || error.message
    );
    console.log("\n🔧 Make sure the server is running: npm run dev");
  }
}

quickTest();
