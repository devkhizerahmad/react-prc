import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import prisma from "./lib/prisma.js";

const PORT = process.env.PORT || 5000;

// Test actual database connection
async function startServer() {
  try {
    console.log("🔄 Connecting to Neon database...");
    await prisma.$connect();
    console.log("✅ Prisma connected to Neon successfully");

    app.listen(PORT, () => {
      console.log(`✅ Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to Neon database:", error.message);
    console.log("🔧 Please check your DATABASE_URL in .env file");
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔄 Shutting down gracefully...");
  await prisma.$disconnect();
  console.log("✅ Database disconnected");
  process.exit(0);
});
