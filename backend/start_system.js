#!/usr/bin/env node

/*
 * Startup Script for User Registration System
 * This script sets up and runs the complete system
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🚀 Starting User Registration System Setup...\n");

// Function to run a command
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      cwd: join(__dirname),
      ...options,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", reject);
  });
}

async function setupAndRun() {
  try {
    console.log("1️⃣  Installing dependencies...");
    await runCommand("npm", ["install"]);

    console.log("\n2️⃣  Generating Prisma client...");
    await runCommand("npx", ["prisma", "generate"]);

    console.log("\n3️⃣  Setting up database...");
    await runCommand("npx", ["prisma", "db", "push"]);

    console.log("\n4️⃣  Starting the server...");
    console.log("   Server will run on http://localhost:5000");
    console.log("   Press Ctrl+C to stop the server\n");

    // Start the server
    await runCommand("npm", ["run", "dev"]);
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    console.log("\n🔧 Manual setup steps:");
    console.log("1. cd backend");
    console.log("2. npm install");
    console.log("3. npx prisma generate");
    console.log("4. npx prisma db push");
    console.log("5. npm run dev");
  }
}

setupAndRun();
