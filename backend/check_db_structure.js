import { prisma } from "./src/lib/prisma.js";

async function checkDbStructure() {
  try {
    console.log("Testing Prisma connection...");
    await prisma.$connect();
    console.log("✅ Connected to database");

    // Try to create a temporary user to verify the schema
    console.log("\nCreating a test user to verify schema...");
    const testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test_${Date.now()}@example.com`,
        password: "temp_password",
        bio: "Test bio",
        avatar: "https://example.com/test-avatar.jpg",
        dateOfBirth: new Date("1990-01-01"),
      },
    });

    console.log("✅ User created successfully with profile fields");
    console.log("User ID:", testUser.id);
    console.log("Bio:", testUser.bio);
    console.log("Avatar:", testUser.avatar);
    console.log("Date of Birth:", testUser.dateOfBirth);

    // Test updating profile fields
    console.log("\nUpdating profile fields...");
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: {
        bio: "Updated bio",
        avatar: "https://example.com/updated-avatar.jpg",
        // Not updating dateOfBirth to test partial updates
      },
    });

    console.log("✅ Profile fields updated successfully");
    console.log("Updated Bio:", updatedUser.bio);
    console.log("Updated Avatar:", updatedUser.avatar);
    console.log("Date of Birth preserved:", updatedUser.dateOfBirth);

    // Clean up
    await prisma.user.delete({
      where: { id: testUser.id },
    });

    console.log("\n✅ Database structure test completed successfully!");
    console.log(
      "The User model correctly contains bio, avatar, and dateOfBirth fields."
    );
  } catch (error) {
    console.error("❌ Error during database structure test:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDbStructure();
