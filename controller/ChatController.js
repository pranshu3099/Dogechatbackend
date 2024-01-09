const express = require("express");
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

const Messages = (req, res, next) => {};

module.exports = {
  Messages,
};
