const fs = require("fs");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

console.log(file_data);

let currentFourChars = [];
let index = -1;

for (i in file_data) {
  while (currentFourChars.includes(file_data[i])) {
    currentFourChars.shift();
  }

  currentFourChars.push(file_data[i]);
  if (currentFourChars.length === 14) {
    index = +i + 1;
    break;
  }
}

console.log(currentFourChars);
console.log(index);
