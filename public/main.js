var cells = [];
const cell_colors = [
  "#ffffd9",
  "#ffdc00",
  "#09ff5e",
  "#fb4f0e",
  "#21c2fe",
  "#77788b",
];
const socket = io();

const onClickSeat = (seat_id) => {
  socket.emit("take_seat", seat_id.slice(-1));
};
const setSeat = () => {
  const seats = document.querySelectorAll("player-seat");
  for (var i = 0; i < seats.length; i++) {
    seats[i].addEventListener("click", (e) =>
      onClickSeat(e.target.getAttribute("id"))
    );
  }
};
const onClickStart = () => {
  const start_btn = document.querySelector(".start_btn");
  start_btn.addEventListener("click", () => socket.emit("start_game"));
};
function onMouseOverCell(event) {
  event.target.classList.add("mouse-up");
}
function onMouseOutCell(event) {
  event.target.classList.remove("mouse-up");
}
const onClickCell = (event) => {
  socket.emit("click_cell", event.target.getAttribute("value"));
};
function setBoardSize() {
  var board = document.querySelector(".fixed-ratio");
  board.style.width = `${Math.round(window.innerWidth)}px`;
  board.style.height = `${Math.round(board.clientWidth / 1.8)}px`;
}
function setRootFontSize() {
  var html = document.querySelector("html");
  html.style.fontSize = `${window.innerWidth / 350}px`;
}
function setBoard() {
  var board = document.querySelector(".board");
  for (var i = 0; i < 10; i++) {
    board.appendChild(makeBoardLine(i));
  }
}
function makeBoardLine(idx) {
  const cnt = [11, 13, 15, 17, 19, 19, 17, 15, 13, 11];
  var line = document.createElement("div");
  var cell_line = [];
  line.setAttribute("class", "triangle-line");
  for (var i = 0; i < cnt[idx]; i++) {
    var cell = document.createElement("div");
    cell.setAttribute(
      "class",
      ((idx > 4) + i) % 2 == 0 ? "triangle up" : "triangle down"
    );
    cell.addEventListener("mouseover", (e) => onMouseOverCell(e));
    cell.addEventListener("mouseout", (e) => onMouseOutCell(e));
    cell.addEventListener("click", (e) => onClickCell(e));
    cell.setAttribute("value", `${idx} ${i}`);
    line.appendChild(cell);
    cell_line.push(cell);
  }
  cells.push(cell_line);
  return line;
}

const setSeatPlayer = (players) => {
  console.log(players);
  players.map((seated, idx) => {
    if (seated) {
      const seat = document.querySelector(`player-seat#box_${idx + 1}`);
      seat.innerHTML = "SEATED";
    }
  });
};
const setGameStartBtn = (isGameStart, players) => {
  const startBtn = document.querySelector(".start_btn");
  startBtn.style.visibility =
    !isGameStart && players.filter((e) => e == true).length > 1
      ? "visible"
      : "hidden";
};
const setGameInfo = ([isGameStart, players, turn]) => {
  setSeatPlayer(players);
  setGameStartBtn(isGameStart, players);
};
socket.on("board_status", (data) => {
  for (var r = 0; r < data.length; r++) {
    for (var c = 0; c < data[r].length; c++) {
      if (data[r][c]) {
        cells[r][c].classList.add("owned");
      } else {
        cells[r][c].classList.remove("owned");
      }
    }
  }
});
socket.on("game_info", (data) => {
  console.log(data);
  setGameInfo(data);
});
setRootFontSize();
setBoardSize();
setBoard();
setSeat();
setGameStartBtn();
addEventListener("resize", setBoardSize);
addEventListener("resize", setRootFontSize);
