import http from "http";
import app from "./app";
import { envConfig } from "./config/env";
import { prisma } from "./lib/prisma";
import { initSocket } from "./socket";

const serverHttp = http.createServer(app);

// Initialize Socket.io
initSocket(serverHttp);

async function server() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to the database");
    serverHttp.listen(envConfig.PORT, () => {
      console.log(`🚀 Server is running on port ${envConfig.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
server();
