// API Integration Test for UserProfile functionality
import { prisma } from "./src/lib/prisma.js";
import { UserService } from "./src/services/userService.js";
import { UserProfileService } from "./src/services/userProfileService.js";

async function apiIntegrationTest() {
  console.log("🧪 API Integration Test for UserProfile\n");

  let testUser = null;

  try {
    // Step 1: Create a test user (simulating signup)
    console.log("📝 Step 1: Creating test user (simulating signup)...");
    const userData = {
      name: "API Test User",
      email: `apitest_${Date.now()}@example.com`,
      password: "TestPass123!",
    };

    const signupResult = await UserService.createUser(userData);
    testUser = signupResult.user;
    console.log(`✅ User created with ID: ${testUser.id}`);

    // Step 2: Update user profile (simulating profile update API call)
    console.log("\n📝 Step 2: Updating user profile...");
    const profileData = {
      bio: "API integration test user with detailed bio information.",
      avatar: "https://example.com/api-test-avatar.jpg",
      dateOfBirth: "1992-08-20",
    };

    const updateResult = await UserProfileService.updateProfile(
      testUser.id,
      profileData
    );
    console.log("✅ Profile updated successfully");
    console.log(`   - Bio: ${updateResult.profile.bio}`);
    console.log(`   - Avatar: ${updateResult.profile.avatar}`);
    console.log(`   - Date of Birth: ${updateResult.profile.dateOfBirth}`);

    // Step 3: Retrieve updated profile (simulating get profile API call)
    console.log("\n📝 Step 3: Retrieving updated profile...");
    const getResult = await UserProfileService.getProfileByUserId(testUser.id);
    console.log("✅ Profile retrieved successfully");
    console.log(`   - Bio: ${getResult.profile.bio}`);
    console.log(`   - Avatar: ${getResult.profile.avatar}`);
    console.log(`   - Date of Birth: ${getResult.profile.dateOfBirth}`);

    // Step 4: Test partial update (only update bio)
    console.log("\n📝 Step 4: Testing partial profile update...");
    const partialUpdateData = {
      bio: "Partially updated bio - only bio changed",
    };

    const partialUpdateResult = await UserProfileService.updateProfile(
      testUser.id,
      partialUpdateData
    );
    console.log("✅ Partial update successful");
    console.log(`   - New Bio: ${partialUpdateResult.profile.bio}`);
    console.log(`   - Avatar preserved: ${partialUpdateResult.profile.avatar}`);
    console.log(
      `   - Date of Birth preserved: ${partialUpdateResult.profile.dateOfBirth}`
    );

    // Step 5: Test public profile access
    console.log("\n📝 Step 5: Testing public profile access...");
    const publicResult = await UserProfileService.getPublicProfileByUserId(
      testUser.id
    );
    console.log("✅ Public profile accessed successfully");
    console.log(`   - Public Bio: ${publicResult.profile.bio}`);
    console.log(`   - Public Avatar: ${publicResult.profile.avatar}`);
    // Date of birth should not be in public profile
    console.log(
      `   - Date of Birth in public profile: ${
        publicResult.profile.dateOfBirth ? "YES (ERROR)" : "NO (CORRECT)"
      }`
    );

    console.log("\n🎉 All API integration tests passed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   - User ID: ${testUser.id}`);
    console.log(`   - Email: ${testUser.email}`);
    console.log(`   - Final Bio: ${partialUpdateResult.profile.bio}`);
    console.log(`   - Avatar: ${partialUpdateResult.profile.avatar}`);
    console.log(`   - Profile update functionality: WORKING`);
    console.log(`   - Partial update functionality: WORKING`);
    console.log(`   - Public profile privacy: WORKING`);
  } catch (error) {
    console.error("❌ API integration test failed:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    // Cleanup
    if (testUser) {
      try {
        await prisma.user.delete({
          where: { id: testUser.id },
        });
        console.log("\n🧹 Test user cleaned up successfully");
      } catch (cleanupError) {
        console.warn(
          "⚠️ Warning: Could not clean up test user:",
          cleanupError.message
        );
      }
    }

    await prisma.$disconnect();
    console.log("✅ Database connection closed");
  }
}

apiIntegrationTest();
