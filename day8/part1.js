const fs = require("fs");
const { default: nodeTest } = require("node:test");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const rows = file_data.split(/\r?\n/);

const width = rows[0].length;
const height = rows.length;

let matrix = [];
let counter = 0;

for (row_index in rows) {
  matrix[row_index] = [];

  for (column of rows[row_index]) {
    matrix[row_index].push(column);
  }
}

for (let i = 0; i < width; i++) {
  for (let j = 0; j < height; j++) {
    if (isVisible(i, j, matrix, width, height)) {
      console.log("visible tree index", i, j, matrix[i][j]);
      counter++;
    }
  }
}

console.log("visible trees:");
console.log(counter);

function isVisible(i, j, matrix, width, height) {
  //elements on the edge are visible
  if (i === 0 || j === 0 || i === width - 1 || j === height - 1) {
    return true;
  }

  //traverse elements to each edge for inner trees
  //checking top

  let visible = true;
  //checking top;
  for (let top_i = i - 1; top_i >= 0; top_i--) {
    if (matrix[i][j] <= matrix[top_i][j]) {
      visible &= false;
    }
  }
  if (visible) return true;

  //checking right
  visible = true;
  for (let right_j = j + 1; right_j < width; right_j++) {
    if (matrix[i][j] <= matrix[i][right_j]) {
      visible &= false;
    }
  }
  if (visible) return true;

  //checking bottom
  visible = true;
  for (let bottom_i = i + 1; bottom_i < height; bottom_i++) {
    if (matrix[i][j] <= matrix[bottom_i][j]) {
      visible &= false;
    }
  }
  if (visible) return true;

  //checking left
  visible = true;
  for (let left_j = j - 1; left_j >= 0; left_j--) {
    if (matrix[i][j] <= matrix[i][left_j]) {
      visible &= false;
    }
  }
  return visible;
}
