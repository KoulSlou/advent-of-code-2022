const fs = require("fs");
const { exit } = require("process");
const lines = parseInput("./input.txt");

const INITIAL_ARRAY = lines.map((v, index) => index + "_" + v);

for (let i = 0; i < INITIAL_ARRAY.length; i++) {
  //find element with index i
  let elementIndex = INITIAL_ARRAY.findIndex((element) =>
    element.includes(i + "_")
  );

  let element = INITIAL_ARRAY[elementIndex];
  let moveSteps = parseInt(element.split("_")[1]);

  let newIndex = (elementIndex + moveSteps) % (INITIAL_ARRAY.length - 1);

  if (newIndex === 0) {
    newIndex = INITIAL_ARRAY.length - 1;
  } else if (newIndex === INITIAL_ARRAY.length - 1) {
    newIndex = 0;
  } else if (newIndex > INITIAL_ARRAY.length - 1) {
    newIndex = newIndex % INITIAL_ARRAY.length;
  }
  let el = INITIAL_ARRAY.splice(elementIndex, 1)[0];
  INITIAL_ARRAY.splice(newIndex, 0, el);
}

let arr = INITIAL_ARRAY.map((v) => parseInt(v.split("_")[1]));
let zeroIndex = arr.indexOf(0);

let result = 0;
let toCheck = [1000, 2000, 3000];
for (let index of toCheck) {
  let i = (zeroIndex + index) % INITIAL_ARRAY.length;
  result += arr[i];
}

function parseInput(file) {
  const file_data = fs.readFileSync(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  const lines = file_data.split(/\r?\n/);
  return lines;
}
