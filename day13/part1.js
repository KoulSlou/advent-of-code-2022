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

const lines = file_data.split(/\r?\n/).filter((v) => v);
let pairsOrder = [];
let result = 0;

for (let i = 0; i < lines.length; i += 2) {
  let leftSignal = JSON.parse(lines[i]);
  let rightSignal = JSON.parse(lines[i + 1]);

  let inOrder = compareSignals(leftSignal, rightSignal);
  pairsOrder.push(inOrder);
}

for (pair_index in pairsOrder) {
  if (pairsOrder[pair_index]) {
    result += +pair_index + 1;
  }
}

console.log(result);

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
