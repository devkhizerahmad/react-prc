import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const testUser = {
    name: "Test User",
    email: `test_${Date.now()}@example.com`,
    password: "Password123!",
};

async function runTest() {
    console.log("🚀 Starting Signup & Login Flow Test...\n");

    try {
        // 1. Test Validation (Signup)
        console.log("🧪 Testing Validation (Invalid Signup)...");
        try {
            await axios.post(`${BASE_URL}/signup`, {
                name: "T",
                email: "invalid-email",
                password: "123",
            });
            console.log("❌ Error: Validation test failed (request should have failed)");
        } catch (error) {
            console.log("✅ Validation test passed: " + (error.response?.data?.message || error.message));
        }
        console.log("");

        // 2. Test Success Signup
        console.log("🧪 Testing Valid Signup...");
        const signupResponse = await axios.post(`${BASE_URL}/signup`, testUser);
        if (signupResponse.data.success) {
            console.log("✅ Signup successful!");
            console.log(`👤 User Created: ${signupResponse.data.data.user.email}`);
        } else {
            console.log("❌ Signup failed: " + signupResponse.data.message);
        }
        console.log("");

        // 3. Test Conflict (Signup with same email)
        console.log("🧪 Testing Duplicate Signup...");
        try {
            await axios.post(`${BASE_URL}/signup`, testUser);
            console.log("❌ Error: Duplicate signup test failed (request should have failed)");
        } catch (error) {
            if (error.response?.status === 409) {
                console.log("✅ Duplicate signup test passed: User already exists");
            } else {
                console.log("❌ Unexpected error: " + error.message);
            }
        }
        console.log("");

        // 4. Test Valid Login
        console.log("🧪 Testing Valid Login...");
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: testUser.email,
            password: testUser.password,
        });
        if (loginResponse.data.success) {
            console.log("✅ Login successful!");
            console.log(`🎫 Token: ${loginResponse.data.data.token.substring(0, 30)}...`);
        } else {
            console.log("❌ Login failed: " + loginResponse.data.message);
        }
        console.log("");

        // 5. Test Invalid Login
        console.log("🧪 Testing Invalid Login (Wrong Password)...");
        try {
            await axios.post(`${BASE_URL}/login`, {
                email: testUser.email,
                password: "WrongPassword123!",
            });
            console.log("❌ Error: Invalid login test failed (request should have failed)");
        } catch (error) {
            console.log("✅ Invalid login test passed: " + (error.response?.data?.message || "Unauthorized"));
        }

        console.log("\n✨ All tests completed!");

    } catch (error) {
        console.error("\n🚨 Test Suite Error:", error.response?.data || error.message);
        console.log("\n💡 Make sure the server is running on http://localhost:5000");
    }
}

runTest();
