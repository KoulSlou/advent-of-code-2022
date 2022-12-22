const fs = require("fs");
const { exit } = require("process");
const lines = parseInput("./input.txt");

let monkeys = {};
let test = "lala + tyty";
let parts = test.split(/([-+*\/])/g);

for (line of lines) {
  [monkeyName, operation] = line.split(":").map((v) => v.trim());
  monkeys[monkeyName] = operation;
}

let full_operation = "root";
let toDecode = ["root"];
do {
  let currentCode = toDecode.pop();
  console.log(currentCode);
  let op = monkeys[currentCode];

  //single digit
  if (parseInt(op)) {
    full_operation = full_operation.replace(currentCode, parseInt(op));
  } else {
    //check what parts expression consists of
    let parts = op.split(/[-+*\/]/g).map((v) => v.trim());
    full_operation = full_operation.replace(currentCode, "(" + op + ")");
    toDecode.push(parts[0], parts[1]);
  }
} while (toDecode.length);

console.log(full_operation);
console.log(eval(full_operation));

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
