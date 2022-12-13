const fs = require("fs");
const { default: nodeTest } = require("node:test");
const { listenerCount } = require("process");
const { start } = require("repl");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const lines = file_data.split(/\r?\n/);

let starting_position = null;
let end_positiion = null;
let map = [];
let visit_map = [];
let min_count_map = []; //map shared between different branches of recursion
let a_positisions = [];
let min_path_from_a = Infinity;

for (line_index in lines) {
  map.push([]);
  visit_map.push([]);
  min_count_map.push([]);
  for (symbol_index in lines[line_index]) {
    let symbol = lines[line_index][symbol_index];

    if (symbol == "S") {
      //starting position
      starting_position = [+line_index, +symbol_index];
      symbol = "a";
    } else if (symbol == "E") {
      end_positiion = [+line_index, +symbol_index];
      symbol = "z";
    }
    map[+line_index][+symbol_index] = symbol.charCodeAt(0) - 97;
    visit_map[+line_index][+symbol_index] = 0;
    min_count_map[+line_index][+symbol_index] = Infinity;

    if (symbol === "a") {
      a_positisions.push([+line_index, +symbol_index]);
    }
  }
}

for (pos of a_positisions) {
  console.log("calculating pos", pos);
  let length = makeStep(map, copyArray(visit_map), pos[0], pos[1], 0, 0);
  if (length < min_path_from_a) {
    min_path_from_a = length;
  }
}

console.log(min_path_from_a);

function copyArray(currentArray) {
  return currentArray.map(function (arr) {
    return arr.slice();
  });
}

// let test = makeStep(
//   map,
//   visit_map.slice(),
//   +starting_position[0],
//   +starting_position[1],
//   0,
//   0
// );

// console.log(test);

function makeStep(map, visit_map, row, column, previous_height, count) {
  //   console.log(row, column, count);

  //not possible step
  if (row < 0 || column < 0) {
    return Infinity;
  }

  if (row > map.length - 1 || column > map[0].length - 1) {
    return Infinity;
  }

  //we already visited cell - we are in the loop
  if (visit_map[row][column] != 0) {
    return Infinity;
  }

  //not possible step
  if (map[row][column] - previous_height > 1) {
    return Infinity;
  }

  if (end_positiion[0] == row && end_positiion[1] == column) {
    console.log("reached end!!!");
    console.log(count);
    return 0;
  }

  let current_height = map[row][column];
  visit_map[row][column] = 1;

  //check if other branches visited this cell sooner
  //in this case don't proceed
  if (min_count_map[row][column] <= count) {
    return Infinity;
  } else {
    min_count_map[row][column] = count;
  }

  return Math.min(
    1 +
      makeStep(
        map,
        copyArray(visit_map),
        row - 1,
        column,
        current_height,
        count + 1
      ),
    1 +
      makeStep(
        map,
        copyArray(visit_map),
        row,
        column + 1,
        current_height,
        count + 1
      ),
    1 +
      makeStep(
        map,
        copyArray(visit_map),
        row + 1,
        column,
        current_height,
        count + 1
      ),
    1 +
      makeStep(
        map,
        copyArray(visit_map),
        row,
        column - 1,
        current_height,
        count + 1
      )
  );
}
