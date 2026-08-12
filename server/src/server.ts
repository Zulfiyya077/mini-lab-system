import http from "node:http";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";

const PORT = 3000;

const httpServer = http.createServer(app);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

httpServer.on("error", (error) => {
  console.error("HTTP Server Error:", error);
});