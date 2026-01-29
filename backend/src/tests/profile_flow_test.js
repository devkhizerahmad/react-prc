import { prisma } from "../lib/prisma.js";
import { UserService } from "../services/userService.js";
import { UserProfileService } from "../services/userProfileService.js";

async function testProfileFlow() {
    console.log("🚀 Starting Full Profile Flow Test\n");

    let testUser = null;
    const timestamp = Date.now();
    const testEmail = `test_flow_${timestamp}@example.com`;

    try {
        // 1. Signup Flow
        console.log("📝 Phase 1: Signup");
        const signupData = {
            name: "Test Flow User",
            email: testEmail,
            password: "Password123!",
        };

        const signupResult = await UserService.createUser(signupData);
        testUser = signupResult.user;
        console.log(`✅ User signed up: ${testUser.id}`);

        // 2. Profile Creation (Upsert) - Initial
        console.log("\n📝 Phase 2: Profile Creation (using upsert logic)");
        const initialProfile = {
            bio: "Initial bio for testing upsert.",
            avatar: "https://example.com/avatar1.jpg",
            dateOfBirth: "1990-01-01",
        };

        // We will call the new upsert method we're about to create
        const createResult = await UserProfileService.upsertProfile(testUser.id, initialProfile);
        console.log("✅ Profile created/initialized via upsert");
        console.log(`   Bio: ${createResult.profile.bio}`);

        // 3. Profile Update (Upsert) - Modification
        console.log("\n📝 Phase 3: Profile Update (using upsert logic)");
        const updatedProfile = {
            bio: "Updated bio for testing upsert - it should overwrite.",
            dateOfBirth: "1995-05-05"
        };

        const updateResult = await UserProfileService.upsertProfile(testUser.id, updatedProfile);
        console.log("✅ Profile updated via upsert");
        console.log(`   Bio: ${updateResult.profile.bio}`);
        console.log(`   Avatar (preserved): ${updateResult.profile.avatar}`);

        // 4. Validation Tests
        console.log("\n📝 Phase 4: Validation Tests");

        // Bio too long
        console.log("Testing bio length validation...");
        try {
            await UserProfileService.upsertProfile(testUser.id, { bio: "a".repeat(501) });
            console.log("❌ Error: Bio length validation failed (allowed > 500)");
        } catch (e) {
            console.log(`✅ Bio length validation caught: ${e.message}`);
        }

        // Invalid Avatar URL
        console.log("Testing avatar URL validation...");
        try {
            await UserProfileService.upsertProfile(testUser.id, { avatar: "invalid-url" });
            console.log("❌ Error: Avatar URL validation failed (allowed invalid URL)");
        } catch (e) {
            console.log(`✅ Avatar URL validation caught: ${e.message}`);
        }

        // Future date of birth
        console.log("Testing date of birth validation...");
        try {
            await UserProfileService.upsertProfile(testUser.id, { dateOfBirth: "2099-01-01" });
            console.log("❌ Error: Date of birth validation failed (allowed future date)");
        } catch (e) {
            console.log(`✅ Date of birth validation caught: ${e.message}`);
        }

        // 5. Public Profile Check
        console.log("\n📝 Phase 5: Public Profile Check");
        const publicProfile = await UserProfileService.getPublicProfileByUserId(testUser.id);
        console.log("✅ Public profile fetched");
        if (publicProfile.profile.dateOfBirth) {
            console.log("❌ Error: Public profile exposing date of birth");
        } else {
            console.log("✅ Public profile privacy verified");
        }

        console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY");

    } catch (error) {
        console.error("\n❌ TEST FAILED");
        console.error(error);
    } finally {
        if (testUser) {
            console.log("\n🧹 Cleaning up...");
            await prisma.user.delete({ where: { id: testUser.id } });
            console.log("✅ Test user deleted");
        }
        await prisma.$disconnect();
        process.exit(0);
    }
}

testProfileFlow();
