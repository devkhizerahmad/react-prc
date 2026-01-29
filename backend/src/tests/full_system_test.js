import { prisma } from "../lib/prisma.js";
import { UserService } from "../services/userService.js";
import { UserProfileService } from "../services/userProfileService.js";
import { PostService } from "../services/postService.js";

async function runFullSystemTest() {
    console.log("🚀 Starting Full System Test: User -> Profile -> Post CRUD\n");

    let testUser = null;
    const timestamp = Date.now();
    const testEmail = `full_test_${timestamp}@example.com`;
    const testPassword = "Password123!";

    try {
        // 1. Signup
        console.log("📝 Phase 1: User Signup");
        const signupResult = await UserService.createUser({
            name: "Full Test User",
            email: testEmail,
            password: testPassword,
        });
        testUser = signupResult.user;
        console.log(`✅ User created: ${testUser.id} (${testUser.email})`);

        // 1.5. Test Post Creation without Profile Completion
        console.log("\n📝 Phase 1.5: Testing Post Creation (should fail due to incomplete profile)");
        try {
            await PostService.createPost(testUser.id, {
                title: "Should Fail",
                content: "This content should never be saved."
            });
            console.log("❌ Error: Post creation should have failed!");
            throw new Error("Post creation succeeded with incomplete profile");
        } catch (e) {
            console.log(`✅ Expected failure caught: ${e.message}`);
        }

        // 2. Profile Completion (Upsert)
        console.log("\n📝 Phase 2: Profile Completion");
        const profileResult = await UserProfileService.upsertProfile(testUser.id, {
            bio: "This is a bio created during the full system test.",
            avatar: "https://example.com/full-test-avatar.jpg",
            dateOfBirth: "1990-01-01",
        });
        console.log("✅ Profile completed successfully");
        console.log(`   Bio: ${profileResult.profile.bio}`);

        // 3. Post Creation
        console.log("\n📝 Phase 3: Post Creation");
        const postData = {
            title: "My First Test Post",
            content: "This is some amazing content for my first automated test post.",
            img: "https://example.com/post-image.jpg",
        };
        const newPost = await PostService.createPost(testUser.id, postData);
        console.log(`✅ Post created: ${newPost.id}`);
        console.log(`   Title: ${newPost.title}`);

        // 4. Read Posts
        console.log("\n📝 Phase 4: Reading Posts");
        const allPosts = await PostService.getAllPosts();
        console.log(`✅ Fetched ${allPosts.length} posts successfully`);

        const myPosts = await PostService.getPostsByAuthor(testUser.id);
        console.log(`✅ Fetched ${myPosts.length} posts for the test user`);

        // 5. Post Update
        console.log("\n📝 Phase 5: Post Update");
        const updateData = {
            title: "Updated Post Title",
            content: "Updated content that is long enough for validation rules.",
        };
        const updatedPost = await PostService.updatePost(testUser.id, newPost.id, updateData);
        console.log("✅ Post updated successfully");
        console.log(`   New Title: ${updatedPost.title}`);

        // 6. Post Deletion
        console.log("\n📝 Phase 6: Post Deletion");
        const deleteResult = await PostService.deletePost(testUser.id, newPost.id);
        console.log(`✅ ${deleteResult.message}`);

        // 7. Verify deletion
        try {
            await PostService.getPostById(newPost.id);
            console.log("❌ Error: Post still exists after deletion");
        } catch (e) {
            console.log(`✅ Post deletion verified: ${e.message}`);
        }

        console.log("\n🎉 ALL PHASES COMPLETED SUCCESSFULLY");

    } catch (error) {
        console.error("\n❌ TEST FAILED at some point:");
        console.error(error.message);
        if (error.stack) console.error(error.stack);
    } finally {
        if (testUser) {
            console.log("\n🧹 Cleaning up test user...");
            try {
                await prisma.user.delete({ where: { id: testUser.id } });
                console.log("✅ Test user and their relations (cascaded) deleted");
            } catch (e) {
                console.log(`⚠️ Cleanup warning: ${e.message}`);
            }
        }
        await prisma.$disconnect();
        console.log("👋 Done.");
        process.exit(0);
    }
}

runFullSystemTest();
