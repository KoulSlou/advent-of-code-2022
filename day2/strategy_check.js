const fs = require("fs");

const file_data = fs.readFileSync("./example.txt", "utf8", (err, data) => {
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
  formatted = string.replace(" ", "").trim();
  if (formatted.length > 0) {
    score += SHAPE_SCORES[formatted[1]] + OUTCOME_SCORES[formatted];
  }
}

console.log(score);
