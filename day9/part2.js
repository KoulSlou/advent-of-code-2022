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
let head_i = 0,
  head_j = 0,
  tail_i = 0,
  tail_j = 0;

let tails = Array(9).fill([0, 0]);

let last_tail_positions = [];

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
        //move all tails
        moveAllTails(tails, head_i, head_j, last_tail_positions);
      }
      break;
    case "U":
      //increasing i by 1
      for (let i = 0; i < parts[1]; i++) {
        console.log("moving right");
        head_i++;
        //move all tails
        moveAllTails(tails, head_i, head_j, last_tail_positions);
      }
      break;
    case "L":
      //decreasing j by 1
      for (let j = 0; j < parts[1]; j++) {
        console.log("moving left");
        head_j--;
        //move all tails
        moveAllTails(tails, head_i, head_j, last_tail_positions);
      }
      break;
    case "D":
      //decreasing i by 1
      for (let j = 0; j < parts[1]; j++) {
        console.log("moving down");
        head_i--;
        //move all tails
        moveAllTails(tails, head_i, head_j, last_tail_positions);
      }
      break;
    default:
      break;
  }
}

console.log(last_tail_positions.length);

function addUniquePositions(array, tail_i, tail_j) {
  let val = tail_i + "_" + tail_j;
  if (!array.includes(val)) {
    array.push(val);
  }
}

function moveAllTails(tails, head_i, head_j, last_tail_positions) {
  for (tail_index in tails) {
    let leader_node_i, leader_node_j;

    if (tail_index == 0) {
      leader_node_i = head_i;
      leader_node_j = head_j;
    } else {
      leader_node_i = tails[tail_index - 1][0];
      leader_node_j = tails[tail_index - 1][1];
    }
    [tail_i, tail_j] = moveTail(
      tails[tail_index][0],
      tails[tail_index][1],
      leader_node_i,
      leader_node_j
    );
    tails[tail_index] = [tail_i, tail_j];
  }
  addUniquePositions(last_tail_positions, tails[8][0], tails[8][1]);
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
