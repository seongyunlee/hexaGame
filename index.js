const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const { off } = require("process");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.send("Hello World!");
});

let numUsers = 0;
var cells = [];
var players = [null, null, null, null, null, null];
var turn = null;
let isGameStart = false;

const initCells = () => {
  cells = [];
  const cnt = [11, 13, 15, 17, 19, 19, 17, 15, 13, 11];
  for (var r = 0; r < 10; r++) {
    var line = [];
    for (var i = 0; i < cnt[r]; i++) {
      line.push(false);
    }
    cells.push(line);
  }
};
const getGameInfo = () => {
  return [isGameStart, players, turn];
};
const initGame = () => {
  initCells();
  players = [false, false, false, false, false, false];
  gameStart = true;
};
const getUpperColDif = (row) => {
  if (row == 5) return 0;
  if (row > 5) return 1;
  if (row < 5) return -1;
};
const getDownColDif = (row) => {
  if (row == 4) return 0;
  if (row > 4) return -1;
  if (row < 4) return 1;
};
const checkHexa = (row, col) => {
  //upper Hexa //the origin is lower center
  if (
    row <= 0 ||
    row >= cells.length ||
    col < 0 ||
    col >= cells[row].length - 1
  )
    return false;
  if (((row > 4) + col) % 2 != 0) return false; // not checking for down cell
  for (var r = row - 1; r <= row; r++) {
    for (var c = col - 1; c <= col + 1; c++) {
      if (!cells[r][c + (r == row ? 0 : getUpperColDif(row))]) {
        return false;
      }
    }
  }
  return true;
};
const offHexa = (row, col) => {
  for (var r = row - 1; r <= row; r++) {
    for (var c = col - 1; c <= col + 1; c++) {
      cells[r][c + (r == row ? 0 : getUpperColDif(row))] = false;
    }
  }
};
const checkHexaAround = (row, col) => {
  const onHexaList = [];
  for (var r = row; r <= row + 1; r++) {
    for (var c = col - 1; c <= col + 1; c++) {
      var cali_c = c + (r == row ? 0 : getDownColDif(row));
      if (checkHexa(r, cali_c)) {
        onHexaList.push([r, cali_c]);
      }
    }
  }
  onHexaList.map(([r, c]) => {
    offHexa(r, c);
  });
};
io.on("connection", (socket) => {
  numUsers++;
  console.log("user connected", numUsers);
  if (numUsers == 1) {
    initCells();
  }
  io.emit("game_info", getGameInfo());
  io.emit("board_status", cells);
  socket.on("click_cell", (data) => {
    const [r, c] = data.split(" ").map((e) => parseInt(e));
    cells[r][c] = !cells[r][c];
    checkHexaAround(r, c);
    io.emit("board_status", cells);
  });
  socket.on("disconnect", () => {
    --numUsers;
  });
  socket.on("start_game", () => {
    initGame();
    io.emit("game_info", getGameInfo());
  });
  socket.on("take_seat", (data) => {
    console.log("setat", data - 1);
    if (players[data - 1] != null) return;
    players[data - 1] = true;
    socket.mySeat = data - 1;
    console.log(getGameInfo());
    io.emit("game_info", getGameInfo());
  });
});

var port = 80;
server.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
