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
let sprite = [0, 1, 2]; //registry value is a middle of sprite

let cycle = 0;

let pixels = [];

for (line of lines) {
  [command, value] = line.split(" ");
  let number_of_cycles = command === "noop" ? 1 : 2;

  for (let i = 0; i < number_of_cycles; i++) {
    if (sprite.includes(cycle % 40)) {
      pixels.push("#");
    } else {
      pixels.push(".");
    }
    cycle++;
  }

  if (value) {
    registry += parseInt(value);
    //updating sprite
    sprite = [registry - 1, registry, registry + 1];
  }
}

let chunks = [];
let start = 0;
let end = 39;

do {
  chunks.push(pixels.slice(start, end));
  start += 40;
  end += 40;
} while (end < 240);

for (chunk of chunks) {
  console.log(chunk.join(""));
}
