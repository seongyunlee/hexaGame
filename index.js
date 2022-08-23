const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const card_info = require("./cards.json");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.send("Hello World!");
});

let numUser = 0;
var cells = [];
var clients = [];
var handList = [[], [], [], [], [], []];
var preventCnt = [0, 0, 0, 0, 0, 0];
var pendemic_card = [];
var hand_deck = [];
const getGameInfo = () => {
  return {
    numUser,
    handList,
    preventCnt,
    pendemic_left: pendemic_card.length,
    deck_left: hand_deck.length,
  };
};
const initGame = () => {
  handList = [[], [], [], [], [], []];
  pendemic_card = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  hand_deck = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15,
  ];
  pendemic_card.sort(() => Math.random() - 0.5);
  hand_deck.sort(() => Math.random() - 0.5);
  initCells();
  userConnection();
};
const userConnection = () => {
  for (var i = 0; i < clients.length; i++) {
    clients[i].emit("user_no", i + 1);
  }
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

const cellClick = (data) => {
  const [r, c] = data.pos.split(" ");
  if (cells[r][c] == null) {
    cells[r][c] = data.player;
  } else {
    cells[r][c] = null;
  }
};

//socket-io setting
io.on("connection", (socket) => {
  //onconnection
  clients.push(socket);
  userConnection();
  if (clients.length == 1) {
    initGame();
  }
  io.emit("game_info", getGameInfo());
  io.emit("board_status", cells);

  // event listener

  //reset click
  socket.on("reset", (data) => {
    initGame();
    io.emit("game_info", getGameInfo());
    io.emit("board_status", cells);
  });

  //click cell
  socket.on("click_cell", (data) => {
    cellClick(data);
    io.emit("board_status", cells);
    io.emit("game_info", getGameInfo());
  });
  socket.on("pendemic", (data) => {
    io.emit("pendemic", {
      img_src: `https://s3.ap-northeast-2.amazonaws.com/mmmclone.test2.s3/pendemic/${pendemic_card.pop()}.png`,
      pos: Math.floor(Math.random() * 6 + 1),
    });
    io.emit("game_info", getGameInfo());
  });
  socket.on("medicine", (data) => {
    console.log("medicine", data);
    if (hand_deck.length == 0) return;
    const { type, name } = card_info[hand_deck.pop() - 1];
    handList[data - 1].push(`${type} ${name}`);
    io.emit("game_info", getGameInfo());
  });
  socket.on("use_card", (data) => {
    try {
      console.log("use card", data);
      if (handList[data.player][data.idx].charAt(0) == "예") {
        preventCnt[data.player] += 1;
      }
      handList[data.player].splice(data.idx, 1);
    } catch (e) {
      console.log(e);
    }
    io.emit("game_info", getGameInfo());
  });
  io.emit("game_info", getGameInfo());
  socket.on("disconnect", () => {
    clients.splice(clients.indexOf(socket), 1);
    console.log("disconnet", clients.length);
  });
});

var port = 80;
server.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
