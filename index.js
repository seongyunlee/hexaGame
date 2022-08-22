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
var round = null;
let isGameStart = false;
const getGameInfo = () => {
  return { isGameStart, players, turn, round };
};
const initGame = () => {
  console.log("init game");
  initCells();
  turn = 0;
  round = 0;
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
  selectMode = "choose_action";
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
  var cnt = [0, 0, 0, 0, 0, 0];
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
      cnt[cells[r][c + (r == row ? 0 : getUpperColDif(row))]] += 1;
    }
  }
  if (
    cnt.filter((e) => {
      return e != 0;
    }).length > 2
  )
    return true;
  for (var i = 0; i < cnt.length; i++) {
    if (cnt[i] > 3) {
      return true;
    }
  }
  return false;
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
  return onHexaList;
};
io.on("connection", (socket) => {
  numUsers++;
  console.log("user connected", numUsers);
  if (numUsers == 1) {
    initCells();
    initGame();
  }
  io.emit("game_info", getGameInfo());
  io.emit("board_status", cells);
  socket.on("click_cell", (data) => {
    console.log(data);
    if (data.player != turn) {
      console.log("당신의 차례가 아닙니다");
      socket.emit("notice", "당신의 차례가 아닙니다");
      return;
    }
    const [r, c] = data.pos.split(" ").map((e) => parseInt(e));
    cells[r][c] = data.player;
    var hexa = checkHexaAround(r, c);
    if (hexa.length > 1) {
      io.emit("game_info", {
        ...getGameInfo(),
        selectMode: "hexa_select",
        hexaList: hexa,
      });
    } else if (hexa.length == 1) {
      io.emit("notice", "전염병 발생");

      io.emit("board_status", cells);
      io.emit("game_info", getGameInfo());
    } else {
      turn = turn == 1 ? 0 : turn + 1;
      io.emit("board_status", cells);
      io.emit("game_info", getGameInfo());
    }
  });
  socket.on("disconnect", () => {
    --numUsers;
  });
  socket.on("start_game", () => {
    startGame();
    io.emit("game_info", getGameInfo());
    io.emit("board_status", cells);
  });
  socket.on("take_seat", (data) => {
    console.log("setat", data - 1);
    if (players[data - 1] != null) return;
    players[data - 1] = true;
    socket.mySeat = data - 1;
    console.log(getGameInfo());
    socket.emit("seat_confirm", data - 1);
    io.emit("game_info", getGameInfo());
  });
  socket.on("reset", (data) => {
    initGame();
    io.emit("game_info", getGameInfo());
    io.emit("board_status", cells);
  });
});

var port = 80;
server.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
