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
let registry = 1;
let cycle = 0;
let result = 0;
const cycles_to_record = [20, 60, 100, 140, 180, 220];

for (line of lines) {
  [command, value] = line.split(" ");
  let number_of_cycles = command === "noop" ? 1 : 2;

  for (let i = 0; i < number_of_cycles; i++) {
    cycle++;
    if (cycles_to_record.includes(cycle)) {
      result += registry * cycle;
    }
  }

  if (value) {
    registry += parseInt(value);
  }
}

console.log(result);
