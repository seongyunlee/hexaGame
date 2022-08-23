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
const checkHexa = (cell, row, col) => {
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
const offHexa = (cell, row, col) => {
  for (var r = row - 1; r <= row; r++) {
    for (var c = col - 1; c <= col + 1; c++) {
      cells[r][c + (r == row ? 0 : getUpperColDif(row))] = false;
    }
  }
};
const checkHexaAround = (cell, row, col) => {
  const onHexaList = [];
  for (var r = row; r <= row + 1; r++) {
    for (var c = col - 1; c <= col + 1; c++) {
      var cali_c = c + (r == row ? 0 : getDownColDif(row));
      if (checkHexa(cell, r, cali_c)) {
        onHexaList.push([r, cali_c]);
      }
    }
  }
  return onHexaList;
};
module.exports.checkConnect = (cell, list, player) => {
  if (list.length >= 2) return false;
  console.log(11, list, player);

  const [r, c] = list[0];
  if (c > 0 && cell[r][c - 1] == player) return true;
  console.log(22, list, player);

  if (c + 1 < cell[r].length && cell[r][c + 1] == player) return true;
  console.log(33, list, player);

  if (
    (r + c) % 2 == 0 &&
    r + 1 < cell.length &&
    cell[r + 1][c + getDownColDif(r)] == player
  )
    return true;
  console.log(44, list, player);

  if ((r + c) % 2 == 1 && r > 0 && cell[r - 1][c + getUpperColDif(r)] == player)
    return true;
  console.log(55, list, player);
  return false;
};
