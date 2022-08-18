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
function getUpperColIndex(row, col) {
  if (row == 5) return col;
  if (row > 5) return col + 1;
  if (row < 5) return col - 1;
}
function getBottomColIndex(row, col) {
  if (row == 4) return col;
  if (row > 4) return col - 1;
  if (row < 4) return col + 1;
}

function checkUpperHexa(row, col) {
  //upper Hexa
  try {
    if (all_tri[row][col].classList.contains("down")) return false;
    const upperline = all_tri[row - 1].slice(col - 4, col);
    if (
      !(
        all_tri[row][col - 1].classList.contains("owned") &&
        all_tri[row][col + 1].classList.contains("owned")
      )
    ) {
      return false;
    }
    for (var c = -1; c < 2; c++) {
      if (
        !all_tri[row - 1][getUpperColIndex(row, col) + c].classList.contains(
          "owned"
        )
      ) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}
function checkBottomLeftHexa(row, col) {
  //left bottom Hexa.

  try {
    if (all_tri[row][col].classList.contains("down")) return false;

    console.log(getBottomColIndex(row, col));
    for (var c = 0; c < 3; c++) {
      if (
        !all_tri[row + 1][getBottomColIndex(row, col) - c].classList.contains(
          "owned"
        )
      ) {
        return false;
      }
    }
    if (
      !(
        all_tri[row][col - 1].classList.contains("owned") &&
        all_tri[row][col - 2].classList.contains("owned")
      )
    ) {
      console.log("asdf");
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
function checkBottomRightHexa(row, col) {
  //right bottom Hexa
  try {
    if (all_tri[row][col].classList.contains("down")) return false;
    for (var c = 0; c < 3; c++) {
      if (
        !all_tri[row + 1][getBottomColIndex(row, col) + c].classList.contains(
          "owned"
        )
      ) {
        return false;
      }
    }
    if (
      !(
        all_tri[row][col + 1].classList.contains("owned") &&
        all_tri[row][col + 2].classList.contains("owned")
      )
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
function checkBottomHexa(row, col) {
  //right bottom Hexa
  try {
    if (all_tri[row][col].classList.contains("up")) return false;
    const upperline = all_tri[row - 1].slice(col - 4, col);
    for (var c = -1; c < 2; c++) {
      if (!all_tri[row][col + c].classList.contains("owned")) {
        return false;
      }
    }
    for (var c = -1; c < 2; c++) {
      if (
        !all_tri[row - 1][getBottomColIndex(row, col) + c].classList.contains(
          "owned"
        )
      ) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}
function offUpperLeftHexa(row, col) {
  //upper left Hexa
  try {
    for (var c = 0; c < 3; c++) {
      all_tri[row - 1][getUpperColIndex(row, col) - c].classList.remove(
        "owned"
      );
    }
    all_tri[row][col - 2].classList.remove("owned");
    all_tri[row][col - 1].classList.remove("owned");
  } catch {
    return false;
  }
}
function offUpperRightHexa(row, col) {
  //upper left Hexa
  try {
    for (var c = 0; c < 3; c++) {
      all_tri[row - 1][getUpperColIndex(row, col) + c].classList.remove(
        "owned"
      );
    }
    all_tri[row][col + 2].classList.remove("owned");
    all_tri[row][col + 1].classList.remove("owned");
  } catch {
    return false;
  }
}
function offUpperHexa(row, col) {
  //upper left Hexa
  try {
    for (var c = -1; c < 2; c++) {
      all_tri[row][col + c].classList.remove("owned");
    }
    for (var c = -1; c < 2; c++) {
      all_tri[row - 1][getUpperColIndex(row, col) + c].classList.remove(
        "owned"
      );
    }
  } catch {
    return false;
  }
}
function offBottomRightHexa(row, col) {
  //upper left Hexa
  try {
    for (var c = 0; c < 3; c++) {
      all_tri[row + 1][getBottomColIndex(row, col) + c].classList.remove(
        "owned"
      );
    }
    all_tri[row][col + 2].classList.remove("owned");
    all_tri[row][col + 1].classList.remove("owned");
  } catch {
    return false;
  }
}
function offBottomLeftHexa(row, col) {
  //upper left Hexa
  try {
    for (var c = 0; c < 3; c++) {
      all_tri[row + 1][getBottomColIndex(row, col) - c].classList.remove(
        "owned"
      );
    }
    all_tri[row][col - 2].classList.remove("owned");
    all_tri[row][col - 1].classList.remove("owned");
  } catch {
    return false;
  }
}
function offBottomHexa(row, col) {
  //upper left Hexa
  try {
    for (var c = -1; c < 2; c++) {
      all_tri[row][col + c].classList.remove("owned");
    }
    for (var c = -1; c < 2; c++) {
      all_tri[row + 1][getBottomColIndex(row, col) + c].classList.remove(
        "owned"
      );
    }
  } catch {
    return false;
  }
}
function onClickTri(event) {
  const [row, col] = event.target
    .getAttribute("value")
    .split(" ")
    .map((e) => {
      return parseInt(e);
    });
  var toggled = false;
  if (checkBottomLeftHexa(row, col)) {
    console.log("bottom left on");
    offBottomLeftHexa(row, col);
    toggled = true;
  }
  if (checkBottomRightHexa(row, col)) {
    console.log("bottom right on");
    offBottomRightHexa(row, col);
    toggled = true;
  }
  if (checkBottomHexa(row, col)) {
    console.log("bottom on");
    offBottomHexa(row, col);
    toggled = true;
  }
  if (checkUpperRightHexa(row, col)) {
    offUpperRightHexa(row, col);
    console.log("upper right on");
    toggled = true;
  }
  if (checkUpperLeftHexa(row, col)) {
    console.log("upper left on");
    offUpperLeftHexa(row, col);
    toggled = true;
  }
  if (checkUpperHexa(row, col)) {
    console.log("upper on");
    offUpperHexa(row, col);
    toggled = true;
  }
  if (!toggled) {
    event.target.classList.add("owned");
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
