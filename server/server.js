import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { createServer } from "http";
import { initSocket } from "./src/config/socket.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = createServer(app);
initSocket(server);

server.listen(PORT, () => {               // ✅ server.listen not app.listen
  console.log(`Server running on port ${PORT}`);
});