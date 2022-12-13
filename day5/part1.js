const fs = require("fs");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const lines = file_data.split(/\r?\n/);

let stacks = [];

for (line of lines) {
  //going through each line
  //if it has [] symbols - it's a description of state
  if (line.indexOf("[") !== -1) {
    console.log("state");
    console.log(line.length);
    let current_stack = 0;
    for (let i = 0; i < line.length; i += 4) {
      if (line[i] === "") {
        //no item for current stack - moving to the next one
      } else if (line[i] === "[") {
        //reading next symbol - it will be an item in the stack
        if (stacks[current_stack] === undefined) {
          stacks[current_stack] = [];
        }
        stacks[current_stack].unshift(line[i + 1]);
      }
      current_stack++;
    }
  }

  if (
    line.indexOf("[") === -1 &&
    line.indexOf("1") > -1 &&
    line.indexOf("move") === -1
  ) {
    console.log("stack numbers");
    const match = line.match(/[0-9]+/g);
    const numberOfStacks = match.length;

    console.log(numberOfStacks);
    console.log(stacks.length);
  }

  if (line.indexOf("move") !== -1) {
    console.log(line);
    //this is a move instructions
    const regex = /move ([0-9]+) from ([0-9]+) to ([0-9]+)/;
    const match = line.match(regex);
    const blockCount = match[1];
    const fromStack = match[2];
    const toStack = match[3];

    for (let i = 0; i < blockCount; i++) {
      const el = stacks[fromStack - 1].pop();
      stacks[toStack - 1].push(el);
    }
  }
}

let answer = "";

for (stack of stacks) {
  answer += stack.pop();
}

console.log(answer);
