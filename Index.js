const express = require("express");
const routes = require("./routes/index");
const session = require("./middleware/session");
const { DogeResponse } = require("./controller/DogechatController");
const app = express();
const port = 3000;
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server, {
  path: "/socket.io",
  cors: {
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  },
});

require("dotenv").config();

app.use(express.json());

app.use(session);

app.use(routes);

io.on("connection", (socket) => {
  console.log("user connected");

  const inactivityTimeout = setTimeout(() => {
    socket.disconnect();
    console.log("User disconnected due to inactivity");
  }, 10 * 60 * 1000);
  socket.on("chat message", async (msg) => {
    clearTimeout(inactivityTimeout);
    io.emit("chat message", msg);
    let doge_message = await DogeResponse(msg);
    console.log(doge_message);
    io.emit("chat message", doge_message, "doge");
  });

  socket.on("disconnect", () => {
    clearTimeout(inactivityTimeout);
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`start chatting with doge at ${port}`);
});
