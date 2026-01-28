import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ DATABASE_URL is not defined in environment variables");
    process.exit(1);
}

console.log("🔗 Initializing Prisma with Neon adapter...");
const adapter = new PrismaNeon({ connectionString });
export const prisma = new PrismaClient({ adapter });

export default prisma;
