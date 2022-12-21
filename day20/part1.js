const fs = require("fs");
const { exit } = require("process");
const lines = parseInput("./input.txt");

const INITIAL_ARRAY = lines
  .filter((v) => v !== "")
  .map((v, index) => index + "_" + v); //adding information about original index to the element

for (let i = 0; i < INITIAL_ARRAY.length; i++) {
  //find element with index i
  let elementIndex = INITIAL_ARRAY.findIndex((element) =>
    element.includes(i + "_")
  );
  moveNumberAtIndex(elementIndex);
}

let arr = INITIAL_ARRAY.map((v) => parseInt(v.split("_")[1]));
let zeroIndex = arr.indexOf(0);

let result = 0;
let toCheck = [1000, 2000, 3000];
for (let index of toCheck) {
  let i = (zeroIndex + index) % INITIAL_ARRAY.length;
  result += arr[i];
}
console.log(result);

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

function moveNumberAtIndex(elementIndex) {
  let element = INITIAL_ARRAY[elementIndex];
  let moveSteps = parseInt(element.split("_")[1]);

  if (moveSteps !== 0) {
    newIndex = (elementIndex + moveSteps) % (INITIAL_ARRAY.length - 1);
    if (newIndex === 0) {
      newIndex = INITIAL_ARRAY.length - 1;
    }
  } else if (moveSteps === 0) {
    return;
  }

  let el = INITIAL_ARRAY.splice(elementIndex, 1)[0];
  INITIAL_ARRAY.splice(newIndex, 0, el);
}

function printArray(array) {
  let arrayNumberNoIndex = array.map((v) => v.split("_")[1]);
  console.log(arrayNumberNoIndex.join(", "));
}
