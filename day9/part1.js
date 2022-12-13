const fs = require("fs");
const { default: nodeTest } = require("node:test");
const { listenerCount } = require("process");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const lines = file_data.split(/\r?\n/);
let tail_i = 0,
  tail_j = 0,
  head_i = 0,
  head_j = 0;

let tail_positions = [];

for (line of lines) {
  let parts = line.split(" ");
  console.log(parts[0], parts[1]);

  //move head
  switch (parts[0]) {
    case "R":
      //increasing j by 1
      for (let j = 0; j < parts[1]; j++) {
        console.log("moving right");
        head_j++;
        console.log(head_i, head_j);
        //move tail if necessary
        [tail_i, tail_j] = moveTail(tail_i, tail_j, head_i, head_j);
        console.log(tail_i, tail_j);
        addUniquePositions(tail_positions, tail_i, tail_j);
      }
      break;
    case "U":
      //increasing i by 1
      for (let i = 0; i < parts[1]; i++) {
        console.log("moving right");
        head_i++;
        console.log("head");
        console.log(head_i, head_j);
        [tail_i, tail_j] = moveTail(tail_i, tail_j, head_i, head_j);
        console.log(tail_i, tail_j);
        addUniquePositions(tail_positions, tail_i, tail_j);
      }
      break;
    case "L":
      //decreasing j by 1
      for (let j = 0; j < parts[1]; j++) {
        console.log("moving left");
        head_j--;
        console.log(head_i, head_j);
        //move tail if necessary
        [tail_i, tail_j] = moveTail(tail_i, tail_j, head_i, head_j);
        console.log(tail_i, tail_j);
        addUniquePositions(tail_positions, tail_i, tail_j);
      }
      break;
    case "D":
      //decreasing i by 1
      for (let j = 0; j < parts[1]; j++) {
        console.log("moving down");
        head_i--;
        console.log(head_i, head_j);
        //move tail if necessary
        [tail_i, tail_j] = moveTail(tail_i, tail_j, head_i, head_j);
        console.log(tail_i, tail_j);
        addUniquePositions(tail_positions, tail_i, tail_j);
      }
      break;
    default:
      break;
  }
}

console.log(tail_positions.length);

function addUniquePositions(array, tail_i, tail_j) {
  let val = tail_i + "_" + tail_j;
  if (!array.includes(val)) {
    array.push(val);
  }
}

function moveTail(tail_i, tail_j, head_i, head_j) {
  //head and tail intersect - do nothing
  if (tail_i === head_i && tail_j === head_j) {
    return [tail_i, tail_j];
  }
  //head and tail are touching - do nothing
  if (Math.abs(tail_i - head_i) <= 1 && Math.abs(tail_j - head_j) <= 1) {
    return [tail_i, tail_j];
  }

  if (tail_i === head_i) {
    //same row - moving column
    if (head_j > tail_j) {
      tail_j++;
    } else {
      tail_j--;
    }
  } else if (tail_j === head_j) {
    //same column - moving row
    if (head_i > tail_i) {
      tail_i++;
    } else {
      tail_i--;
    }
  } else {
    //moving diagonally - incrementing both coordinates
    if (head_i > tail_i) {
      tail_i++;
    } else {
      tail_i--;
    }

    if (head_j > tail_j) {
      tail_j++;
    } else {
      tail_j--;
    }
  }

  return [tail_i, tail_j];
}
