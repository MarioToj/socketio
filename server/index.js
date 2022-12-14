import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";

import { PORT } from "./config.js";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Initializations
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// Middlewares
app.use(cors());
app.use(morgan("dev"));

io.on("connection", (socket) => {

  socket.on("message", (message) => {

    socket.broadcast.emit( 'message', {
      body: message, 
      from: socket.id
    } )

  });
});

app.use(express.static(join(__dirname, '../client/build')))

server.listen(PORT);
console.log(`server on port ${PORT}`);