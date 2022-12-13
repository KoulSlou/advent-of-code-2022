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
let max_scenic_score = 0;

for (row_index in rows) {
  matrix[row_index] = [];

  for (column of rows[row_index]) {
    matrix[row_index].push(column);
  }
}

for (let i = 0; i < width; i++) {
  for (let j = 0; j < height; j++) {
    let current_score = calculateScenicScore(i, j, matrix, width, height);
    if (current_score > max_scenic_score) max_scenic_score = current_score;
  }
}

console.log(max_scenic_score);

function calculateScenicScore(i, j, matrix, width, height) {
  //elements on the edge have at least one viewing distance equal to 0
  if (i === 0 || j === 0 || i === width - 1 || j === height - 1) {
    return 0;
  }

  //get top viewing distance
  let top_distance = 0;
  for (let top_i = i - 1; top_i >= 0; top_i--) {
    top_distance++;
    if (matrix[top_i][j] >= matrix[i][j]) {
      break;
    }
  }

  //get right viewing distance
  let right_distance = 0;
  for (let right_j = j + 1; right_j < width; right_j++) {
    right_distance++;
    if (matrix[i][right_j] >= matrix[i][j]) {
      break;
    }
  }

  let bottom_distance = 0;
  for (let bottom_i = i + 1; bottom_i < height; bottom_i++) {
    bottom_distance++;
    if (matrix[bottom_i][j] >= matrix[i][j]) {
      break;
    }
  }

  let left_distance = 0;
  for (let left_j = j - 1; left_j >= 0; left_j--) {
    left_distance++;
    if (matrix[i][left_j] >= matrix[i][j]) {
      break;
    }
  }
  return top_distance * right_distance * bottom_distance * left_distance;
}
