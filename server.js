import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "interface.html"));
});

io.on("connection", (socket) => {
  console.log("Client connecté :", socket.id);

  socket.on("chat:message", (data) => {
    io.emit("chat:message", {
      username: data.username,
      message: data.message,
      timestamp: Date.now(),
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur Chat Interface lancé sur le port ${PORT}`);
});

