// Debug script to test the profile update functionality
import { prisma } from "./src/lib/prisma.js";
import { UserProfileService } from "./src/services/userProfileService.js";

async function debugProfileUpdate() {
  console.log("🔍 Debugging Profile Update Functionality\n");

  try {
    // Create a test user
    console.log("Creating a test user...");
    const testUser = await prisma.user.create({
      data: {
        name: "Debug User",
        email: `debug_${Date.now()}@example.com`,
        password: "hashed_password_placeholder", // In real scenario, this would be hashed
      },
    });

    console.log(`✅ Test user created with ID: ${testUser.id}`);

    // Show initial state
    console.log("\n📋 Initial user data:");
    console.log(`   Name: ${testUser.name}`);
    console.log(`   Bio: ${testUser.bio || "NULL"}`);
    console.log(`   Avatar: ${testUser.avatar || "NULL"}`);
    console.log(`   Date of Birth: ${testUser.dateOfBirth || "NULL"}`);

    // Prepare profile data to update
    const profileData = {
      bio: "This is a debug bio for testing profile updates.",
      avatar: "https://example.com/debug-avatar.jpg",
      dateOfBirth: "1995-06-15",
    };

    console.log("\n📝 Preparing to update profile with:");
    console.log(`   Bio: ${profileData.bio}`);
    console.log(`   Avatar: ${profileData.avatar}`);
    console.log(`   Date of Birth: ${profileData.dateOfBirth}`);

    // Update the profile
    console.log("\n🔄 Calling UserProfileService.updateProfile()...");
    const result = await UserProfileService.updateProfile(
      testUser.id,
      profileData
    );

    console.log("✅ Profile update successful!");
    console.log("\n📋 Updated user data:");
    console.log(`   Name: ${result.profile.name}`);
    console.log(`   Bio: ${result.profile.bio}`);
    console.log(`   Avatar: ${result.profile.avatar}`);
    console.log(`   Date of Birth: ${result.profile.dateOfBirth}`);
    console.log(`   Updated At: ${result.profile.updatedAt}`);

    // Verify the update in database
    console.log("\n🔍 Verifying database update...");
    const updatedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
    });

    console.log("✅ Database verification successful!");
    console.log("\n📋 Database record:");
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Bio: ${updatedUser.bio}`);
    console.log(`   Avatar: ${updatedUser.avatar}`);
    console.log(`   Date of Birth: ${updatedUser.dateOfBirth}`);
    console.log(`   Updated At: ${updatedUser.updatedAt}`);

    // Test partial update (only bio)
    console.log("\n📝 Testing partial update (only bio)...");
    const partialUpdateData = {
      bio: "Updated bio - only bio field changed",
    };

    const partialResult = await UserProfileService.updateProfile(
      testUser.id,
      partialUpdateData
    );
    console.log("✅ Partial update successful!");
    console.log(`   New Bio: ${partialResult.profile.bio}`);
    console.log(`   Avatar still: ${partialResult.profile.avatar}`);
    console.log(`   Date of Birth still: ${partialResult.profile.dateOfBirth}`);

    // Clean up
    console.log("\n🧹 Cleaning up test user...");
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log("✅ Test user deleted");

    console.log("\n🎉 Profile update debugging completed successfully!");
  } catch (error) {
    console.error("❌ Error during debugging:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

debugProfileUpdate();
