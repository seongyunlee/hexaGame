const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const { off } = require("process");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { checkConnect } = require("./script/hexa.js");
const e = require("express");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.send("Hello World!");
});

let numPlayers = 0;
var cells = [];
var players = [null, null, null, null, null, null];
var turn = null;
var round = null;
let isGameStart = false;
var turnMode = null;
var cellClickList = [];
const getGameInfo = () => {
  return { isGameStart, players, turn, round, turnMode };
};
const initGame = () => {
  console.log("init game");
  initCells();
  turn = 1;
  round = 0;
  numPlayers = 0;
  turnMode = "user_action";
  cellClickList = [];
  players = [null, null, null, null, null, null];
  isGameStart = false;
};
const initCells = () => {
  cells = [];
  const cnt = [11, 13, 15, 17, 19, 19, 17, 15, 13, 11];
  for (var r = 0; r < 10; r++) {
    var line = [];
    for (var i = 0; i < cnt[r]; i++) {
      line.push(null);
    }
    cells.push(line);
  }
};

const startGame = () => {
  isGameStart = true;
  turnMode = "choose_action";
  numPlayers = players.filter((e) => {
    return e != null;
  }).length;
};

const nextTurn = () => {
  cellClickList = [];
  if (turnMode == "pendemic") {
    turnMode = "choose_action";
    turn = 1;
  } else if (turn == numPlayers) {
    turnMode = "pendemic";
  } else {
    turn += 1;
  }
};
const cellClick = (data) => {
  //check wrong order
  if (data.player != turn) {
    return false;
  }
  //fill the cell
  const [r, c] = data.pos.split(" ").map((e) => parseInt(e));
  if (cells[r][c] == null) {
    cells[r][c] = data.player;
    cellClickList.push([r, c]);
    return true;
  }
  return false;
};

//socket-io setting
io.on("connection", (socket) => {
  //onconnection
  io.emit("game_info", getGameInfo());
  io.emit("board_status", cells);

  // event listener

  //reset click
  socket.on("reset", (data) => {
    initGame();
    io.emit("game_info", getGameInfo());
    io.emit("board_status", cells);
  });

  //seat click
  socket.on("take_seat", (data) => {
    console.log("setat", data);
    if (players[data - 1] != null) return;
    players[data - 1] = true;
    socket.mySeat = data;
    console.log(getGameInfo());
    socket.emit("seat_confirm", data);
    io.emit("game_info", getGameInfo());
  });

  //start button click
  socket.on("start_game", () => {
    startGame();
    io.emit("game_info", getGameInfo());
    io.emit("board_status", cells);
  });

  //click cell
  socket.on("click_cell", (data) => {
    if (turnMode == "choose_action") {
      var chk = cellClick(data);
      if (chk == true) {
        if (checkConnect(cells, cellClickList, data.player)) {
          io.emit("game_info", getGameInfo());
          socket.emit("notice", "한 칸 더 선택 하세요.");
        } else {
          nextTurn();
        }
        io.emit("board_status", cells);
        io.emit("game_info", getGameInfo());
      } else {
        socket.emit("notice", "잘못된 선택입니다.");
      }
    }
  });

  socket.on("disconnect", () => {});
});

var port = 80;
server.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
