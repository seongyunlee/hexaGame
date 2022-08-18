const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

var port = 80;
server.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
