require("./models/database.js");
const express = require("express");
const http = require("http");
const cors = require("cors");
const userRouter = require("./routes/user.js");

const PORT = 8000;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const userSockets = {};

io.on("connection", (socket) => {
  socket.on("user-connected", (userId) => {
    console.log(`User ${userId} connected, socket id: ${socket.id}`);
    userSockets[userId] = socket.id;
    console.log(userSockets);
  });

  socket.on("currently-playing", ({ user_id, songInfo, friends }) => {
    console.log(
      `Currently playing ${JSON.stringify(
        songInfo
      )}, share to ${friends} from ${socket.id} aka ${user_id}`
    );

    friends.forEach((friendId) => {
      const friendSocketId = userSockets[friendId];
      if (friendSocketId) {
        io.to(friendSocketId).emit("friends-song", { user_id, songInfo });
        console.log(`User ${friendId} has recieved the song`);
      } else {
        console.log(`User ${friendId} is not online`);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

app.use(cors());
app.use(express.json());
app.use(userRouter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to my API" });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
