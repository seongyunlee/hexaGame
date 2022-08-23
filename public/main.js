var cells = [];
var hexBtns = [];
const socket = io();
var my_no = null;

function onMouseOverCell(event) {
  event.target.classList.add("mouse-up");
}
function onMouseOutCell(event) {
  event.target.classList.remove("mouse-up");
}
const onClickCell = (event) => {
  socket.emit("click_cell", {
    pos: event.target.getAttribute("value"),
    player: my_no,
  });
};
function setBoardSize() {
  var board = document.querySelector(".fixed-ratio");
  board.style.width = `${Math.round(window.innerWidth)}px`;
  board.style.height = `${Math.round(board.clientWidth / 2.2)}px`;
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
function closePendemicCard() {
  document.querySelector(".pendemic-card").style.visibility = "hidden";
}
const setPlayerCard = (list) => {
  for (var no = 0; no < list.length; no++) {
    const box = document.querySelector(`.player-box#box_${no + 1}`);
    box.innerHTML = "";
    for (var idx = 0; idx < list[no].length; idx++) {
      const card = document.createElement("div");
      card.classList.add("hand");
      card.setAttribute("player", no);
      card.setAttribute("idx", idx);
      card.addEventListener("click", (e) =>
        socket.emit("use_card", {
          player: e.target.getAttribute("player") + 1,
          idx: e.target.getAttribute("idx"),
        })
      );
      card.innerHTML = list[no][idx];
      box.appendChild(card);
    }
  }
};
const setPreventCnt = (list) => {
  for (var i = 0; i < list.length; i++) {
    const counter = document.querySelector(`.prevent-cnt#id${i + 1}`);
    counter.innerHTML = list[i];
  }
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
socket.on("board_status", (data) => {
  for (var r = 0; r < data.length; r++) {
    for (var c = 0; c < data[r].length; c++) {
      if (data[r][c] != null) {
        cells[r][c].classList.add("owned");
        cells[r][c].classList.add(`color${data[r][c]}`);
      } else {
        cells[r][c].classList.remove("owned");
        for (var idx = 1; idx < 7; idx++) {
          cells[r][c].classList.remove(`color${idx}`);
        }
      }
    }
  }
});
socket.on("game_info", (data) => {
  console.log(data);
  setPlayerCard(data.handList);
  setPreventCnt(data.preventCnt);
  document.querySelector(
    ".card.medicine"
  ).innerHTML = `방어 예방카드(${data.deck_left})`;
  document.querySelector(
    ".card.pendemic"
  ).innerHTML = `펜데믹 카드(${data.pendemic_left})`;
});
socket.on("notice", (data) => {
  console.log(data);
  alert(data);
});
socket.on("user_no", (data) => {
  console.log("user_no", data);
  my_no = data;
});
socket.on("pendemic", (data) => {
  document.querySelector(".pendemic-image").setAttribute("src", data.img_src);
  document.querySelector(
    ".pendemic-location"
  ).innerHTML = `${data.pos} 지역에 전염병 발생`;
  document.querySelector(".pendemic-card").style.visibility = "visible";
});
setRootFontSize();
setBoardSize();
setBoard();
addEventListener("resize", setBoardSize);
addEventListener("resize", setRootFontSize);
