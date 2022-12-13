const fs = require("fs");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const SHAPE_SCORES = {
  X: 1,
  Y: 2,
  Z: 3,
};

const CHOSED_FIGURE = {
  A: {
    X: "Z", //lose
    Y: "X", //draw
    Z: "Y", //win
  },
  B: {
    X: "X", //lose
    Y: "Y", //draw
    Z: "Z", //win
  },
  C: {
    X: "Y", //lose
    Y: "Z", //draw
    Z: "X", //win
  },
};

const OUTCOME_SCORES = {
  AZ: 0,
  BX: 0,
  CY: 0,
  AX: 3,
  BY: 3,
  CZ: 3,
  AY: 6,
  BZ: 6,
  CX: 6,
};

let score = 0;

for (string of file_data.split(/\r?\n/)) {
  if (string) {
    let my_move = CHOSED_FIGURE[string[0]][string[2]];
    score += SHAPE_SCORES[my_move] + OUTCOME_SCORES[string[0] + my_move];
  }
}

console.log(score);
