var all_tri = [];

addEventListener("resize", setBoardSize);
addEventListener("resize", setRootFontSize);
setBoardSize();
setBoard();
setRootFontSize();
function onMouseOverTri(event) {
  event.target.classList.add("mouse-up");
}
function onMouseOutTri(event) {
  event.target.classList.remove("mouse-up");
}
function getUpperColDif(row) {
  if (row == 5) return 0;
  if (row > 5) return 1;
  if (row < 5) return -1;
}
function getDownColDif(row) {
  if (row == 4) return 0;
  if (row > 4) return -1;
  if (row < 4) return 1;
}

function checkHexa(row, col) {
  //upper Hexa //the origin is lower center
  if (row <= 0 || col >= all_tri[row].length - 1 || col < 0) return false;
  if (all_tri[row][col].classList.contains("down")) return false;
  for (var r = row - 1; r <= row; r++) {
    for (var c = col - 1; c <= col + 1; c++) {
      if (
        !all_tri[r][
          c + (r == row ? 0 : getUpperColDif(row))
        ].classList.contains("owned")
      ) {
        return false;
      }
    }
  }
  return true;
}
function offHexa(row, col) {
  //upper Hexa //the origin is lower center
  if (all_tri[row][col].classList.contains("down")) return false;
  for (var r = row - 1; r <= row; r++) {
    for (var c = col - 1; c <= col + 1; c++) {
      all_tri[r][c + (r == row ? 0 : getUpperColDif(row))].classList.remove(
        "owned"
      );
    }
  }
}
function onClickTri(event) {
  event.target.classList.add("owned");
  const [row, col] = event.target
    .getAttribute("value")
    .split(" ")
    .map((e) => {
      return parseInt(e);
    });
  const hexaList = [];
  for (var r = row; r <= row + 1; r++) {
    for (var c = col - 1; c <= col + 1; c++) {
      var cali_c = c + (r == row ? 0 : getDownColDif(row));
      console.log("c", r, cali_c);
      if (checkHexa(r, cali_c)) {
        console.log(r, cali_c);
        offHexa(r, cali_c);
        hexaList.push([r, cali_c]);
      }
    }
  }
}
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
    board.appendChild(makeTriangleLine(i));
  }
}
function makeTriangleLine(idx) {
  const cnt = [11, 13, 15, 17, 19, 19, 17, 15, 13, 11];
  var line = document.createElement("div");
  line.setAttribute("class", "triangle-line");
  var triangles = [];
  for (var i = 0; i < cnt[idx]; i++) {
    var triangle = document.createElement("div");
    triangle.setAttribute(
      "class",
      ((idx > 4) + i) % 2 == 0 ? "triangle up" : "triangle down"
    );
    triangle.addEventListener("mouseover", (e) => onMouseOverTri(e));
    triangle.addEventListener("mouseout", (e) => onMouseOutTri(e));
    triangle.addEventListener("click", (e) => onClickTri(e));
    //triangle.setAttribute("position", "relative");
    //triangle.setAttribute("top", `${5 * i * l}rem`);
    triangles.push(triangle);
  }
  all_tri.push(triangles);
  for (var i = 0; i < triangles.length; i++) {
    triangles[i].setAttribute("value", `${idx} ${i}`);
    line.appendChild(triangles[i]);
  }
  return line;
}
