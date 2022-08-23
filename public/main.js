var cells = [];
var hexBtns = [];
const cell_colors = [
  "#ffffd9",
  "#ffdc00",
  "#09ff5e",
  "#fb4f0e",
  "#21c2fe",
  "#77788b",
];
const socket = io();
var mySeat = null;
var nowTurn = null;

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
const initStartBtn = () => {
  const start_btn = document.querySelector(".start_btn");
  start_btn.addEventListener("click", () => socket.emit("start_game", {}));
};
function onMouseOverCell(event) {
  event.target.classList.add("mouse-up");
}
function onMouseOutCell(event) {
  event.target.classList.remove("mouse-up");
}
const onClickCell = (event) => {
  socket.emit("click_cell", {
    pos: event.target.getAttribute("value"),
    player: mySeat,
  });
};
function setBoardSize() {
  var board = document.querySelector(".fixed-ratio");
  board.style.width = `${Math.round(window.innerWidth)}px`;
  board.style.height = `${Math.round(board.clientWidth / 1.8)}px`;
}
function setRootFontSize() {
  var html = document.querySelector("html");
  html.style.fontSize = `${window.innerWidth / 450}px`;
}
function setBoard() {
  var board = document.querySelector(".board");
  for (var i = 0; i < 10; i++) {
    board.appendChild(makeBoardLine(i));
    if (i != 9) {
      board.appendChild(makeBtnLine(i));
    }
  }
  setBtnText();
}
function makeBtnLine(idx) {
  const cnt = [5, 6, 7, 8, 9, 8, 7, 6, 5];
  var btn_line = [];
  var line = document.createElement("div");
  line.setAttribute("class", "btn-line");
  for (var i = 0; i < cnt[idx]; i++) {
    var btn = document.createElement("div");
    btn.setAttribute("class", "hex-btn");
    btn.setAttribute("value", `${idx} ${i}`);
    btn.style.visibility = "hidden";
    line.appendChild(btn);
    btn_line.push(btn);
  }
  hexBtns.push(btn_line);
  return line;
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
const hexaSelect = (list) => {
  console.log(list);
};
const setBtnText = () => {
  hexBtns[2][3].innerHTML = "1";
  hexBtns[3][5].innerHTML = "2";
  hexBtns[5][5].innerHTML = "3";
  hexBtns[6][3].innerHTML = "4";
  hexBtns[5][2].innerHTML = "5";
  hexBtns[3][2].innerHTML = "6";

  hexBtns[2][3].style.visibility = "visible";
  hexBtns[3][5].style.visibility = "visible";
  hexBtns[5][5].style.visibility = "visible";
  hexBtns[6][3].style.visibility = "visible";
  hexBtns[5][2].style.visibility = "visible";
  hexBtns[3][2].style.visibility = "visible";
};
const setSeatPlayer = (data) => {
  console.log(data.players);
  data.players.map((seated, idx) => {
    if (seated == true) {
      const seat = document.querySelector(`player-seat#box_${idx + 1}`);
      seat.innerHTML = "SEATED";
      if (idx == mySeat) {
        seat.style.borderColor = "#ff0000";
      }
    } else {
      const seat = document.querySelector(`player-seat#box_${idx + 1}`);
      seat.innerHTML = "";
    }
  });
  if (data.isGameStart) {
    const playerSeats = document.querySelectorAll("player-seat");
    for (var i = 0; i < playerSeats.length; i++) {
      playerSeats[i].style.background =
        playerSeats[i].getAttribute("id").slice(-1) == data.turn
          ? "#f0f000"
          : "#ffffff";
    }
  }
};
const setGameStartBtn = (isGameStart, players) => {
  const startBtn = document.querySelector(".start_btn");
  startBtn.style.visibility =
    !isGameStart &&
    players.filter((e) => {
      return e == true;
    }).length > 1
      ? "visible"
      : "hidden";
};
const setGameInfo = (data) => {
  setSeatPlayer(data);
  setGameStartBtn(data.isGameStart, data.players);
  nowTurn = data.turn;
};
socket.on("board_status", (data) => {
  for (var r = 0; r < data.length; r++) {
    for (var c = 0; c < data[r].length; c++) {
      if (data[r][c] != null) {
        cells[r][c].classList.add("owned");
        cells[r][c].classList.add(`color${data[r][c]}`);
      } else {
        cells[r][c].classList.remove("owned");
      }
    }
  }
});
socket.on("game_info", (data) => {
  if (data.selectMode == "hexa_select") {
    hexaSelect(data.hexaList);
  }
  console.log(data);
  setGameInfo(data);
});
socket.on("notice", (data) => {
  console.log(data);
  alert(data);
});
socket.on("seat_confirm", (data) => (mySeat = data));
setRootFontSize();
setBoardSize();
setBoard();
setSeat();
initStartBtn();
addEventListener("resize", setBoardSize);
addEventListener("resize", setRootFontSize);
