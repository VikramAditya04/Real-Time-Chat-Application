import "dotenv/config";

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    // initialize socket.io
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
};

startServer();
