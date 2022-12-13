const { throws } = require("assert");
const fs = require("fs");
const { default: nodeTest } = require("node:test");
const { listenerCount } = require("process");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

function Monkey(items) {
  this.items = items;
  this.onPassTo;
  this.onFailTo;
  this.divider = 1;

  this.test = (x) => x % this.divider === 0;

  this.addItem = (item) => {
    this.items.push(item);
  };

  this.setOperator = (evalString) => (this.operator = evalString);
  this.transform = (old) => eval(this.operator);
  this.inspectorCounter = 0;
}

const lines = file_data.split(/\r?\n/);

let monkeys = [];
let currentMonkey = null;
let currentMonkeyIndex;

for (line of lines) {
  //start of Monkey description
  let match = line.match(/Monkey ([0-9]+):/);
  if (match) {
    currentMonkeyIndex = +match[1];
    continue;
  }

  match = line.match(/Starting items: (.*)/);
  if (match) {
    let items = match[1].split(",").map((v) => +v);
    currentMonkey = new Monkey(items);
    continue;
  }

  match = line.match(/Operation: new = (.*)/);
  if (match) {
    currentMonkey.setOperator(match[1]);
    continue;
  }

  match = line.match(/Test: divisible by ([0-9]+)/);
  if (match) {
    currentMonkey.divider = +match[1];
    continue;
  }

  match = line.match(/If true: throw to monkey ([0-9]+)/);
  if (match) {
    currentMonkey.onPassTo = +match[1];
    continue;
  }

  match = line.match(/If false: throw to monkey ([0-9]+)/);
  if (match) {
    currentMonkey.onFailTo = +match[1];
    monkeys.push(currentMonkey);
    continue;
  }
}

//Going for one round
for (let i = 0; i < 20; i++) {
  //Going through each monkey
  for (monkey of monkeys) {
    //Going through each item
    for (item of monkey.items) {
      //   console.log("current worry level");
      //   console.log(item);
      //   console.log("new worry level");
      let newWorryLevel = monkey.transform(item);
      //   console.log(newWorryLevel);
      monkey.inspectorCounter++;

      let worryLevelAfterInspection = Math.floor(newWorryLevel / 3);

      //   console.log(worryLevelAfterInspection);
      if (monkey.test(worryLevelAfterInspection)) {
        // console.log("throw to " + monkey.onPassTo);
        monkeys[monkey.onPassTo].addItem(worryLevelAfterInspection);
      } else {
        // console.log("throw to " + monkey.onFailTo);
        monkeys[monkey.onFailTo].addItem(worryLevelAfterInspection);
      }
      monkey.items = [];
    }
  }
}

let max = 0,
  secondMax = 0;

for (monkey of monkeys) {
  if (monkey.inspectorCounter > max) {
    secondMax = max;
    max = monkey.inspectorCounter;
  } else if (monkey.inspectorCounter > secondMax) {
    secondMax = monkey.inspectorCounter;
  }
}

console.log(max);
console.log(secondMax);
console.log(max * secondMax);
