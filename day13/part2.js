const fs = require("fs");
const { default: nodeTest } = require("node:test");
const { type } = require("os");
const { listenerCount } = require("process");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const lines = file_data
  .split(/\r?\n/)
  .filter((v) => v)
  .map((v) => JSON.parse(v));
let result = 1;

//add dividers
lines.push([[2]]);
lines.push([[6]]);

lines.sort(sortCompareSignals);

for (line_index in lines) {
  let json = JSON.stringify(lines[line_index]);

  if (json === "[[6]]" || json === "[[2]]") {
    result *= +line_index + 1;
  }
}

console.log(result);
return;

function sortCompareSignals(left, right) {
  if (typeof left == "number" && typeof right == "number") {
    //both values are number
    if (left < right) {
      return -1;
    } else if (left > right) {
      return 1;
    }
    return 0;
  } else if (typeof left == "number" && Array.isArray(right)) {
    //left value is number another is array
    return sortCompareSignals([left], right);
  } else if (typeof right == "number" && Array.isArray(left)) {
    //right value is number another is array
    return sortCompareSignals(left, [right]);
  } else if (Array.isArray(left) && Array.isArray(right)) {
    let inOrder = 0;
    //both values are arrays, loop through them
    for (let i = 0; i < left.length; i++) {
      //right signal is shorter
      if (right[i] === undefined) {
        inOrder = 1;
        break;
      }
      inOrder = sortCompareSignals(left[i], right[i]);
      if (inOrder === -1 || inOrder === 1) break;
    }
    //we looped through array, but don't have info about order
    //check if right signal is longer
    if (inOrder === 0 && left.length < right.length) {
      inOrder = -1;
    }
    return inOrder;
  }
}

//comparison in reverse order
/*
function sortCompareSignals(left, right) {
  console.log("comparing", left, right);
  if (typeof left == "number" && typeof right == "number") {
    //both values are number
    if (left < right) {
      return 1;
    } else if (left > right) {
      return -1;
    }
    return 0;
  } else if (typeof left == "number" && Array.isArray(right)) {
    //left value is number another is array
    return sortCompareSignals([left], right);
  } else if (typeof right == "number" && Array.isArray(left)) {
    //right value is number another is array
    return sortCompareSignals(left, [right]);
  } else if (Array.isArray(left) && Array.isArray(right)) {
    let inOrder = 0;
    //both values are arrays, loop through them
    for (let i = 0; i < left.length; i++) {
      //right signal is shorter
      if (right[i] === undefined) {
        inOrder = -1;
        break;
      }
      inOrder = sortCompareSignals(left[i], right[i]);
      if (inOrder === -1 || inOrder === 1) break;
    }
    //we looped through array, but don't have info about order
    //check if right signal is longer
    if (inOrder === null && left.length < right.length) {
      inOrder = 1;
    }
    return inOrder;
  }
}*/

function compareSignals(left, right) {
  if (typeof left == "number" && typeof right == "number") {
    //both values are number
    if (left < right) {
      return true;
    } else if (left > right) {
      return false;
    }
    return null;
  } else if (typeof left == "number" && Array.isArray(right)) {
    //left value is number another is array
    return compareSignals([left], right);
  } else if (typeof right == "number" && Array.isArray(left)) {
    //right value is number another is array
    return compareSignals(left, [right]);
  } else if (Array.isArray(left) && Array.isArray(right)) {
    let inOrder = null;
    //both values are arrays, loop through them
    for (let i = 0; i < left.length; i++) {
      //right signal is shorter
      if (right[i] === undefined) {
        inOrder = false;
        break;
      }
      inOrder = compareSignals(left[i], right[i]);
      if (inOrder === true || inOrder === false) break;
    }
    //we looped through array, but don't have info about order
    //check if right signal is longer
    if (inOrder === null && left.length < right.length) {
      inOrder = true;
    }
    return inOrder;
  }
}
