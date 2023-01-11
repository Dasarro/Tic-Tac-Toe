import { GameServer } from "./models/socket";
import express from "express";
import http from "http";
import { getUsers, createUser } from "./db_connection";
import { setupQueue } from "./lobby";

const app = express();
app.use(express.json());
const server = http.createServer(app);

// console.log(process.env.DB_USER,
// process.env.DB_NAME,
// process.env.DB_PASSWORD,
// process.env.DB_HOST,
// parseInt(process.env.DB_PORT));

app.get('/api/leaderboard', getUsers);
app.post('/api/users', createUser);

const io = new GameServer(server, {
  cors: {
    origin: "http://localhost:4200",
  },
});

// validate username
io.use((socket, next) => {
  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error("invalid username"));
  }

  console.log();
  socket.data.username = username;

  next();
});

io.on("connect", socket => {
    console.log(socket.data.username + ' has connected');
    socket.on("disconnect", reason => {
        console.log(socket.data.username + ' has disconnected: ' + reason);
    })
})

setupQueue(io);

server.listen(3000);