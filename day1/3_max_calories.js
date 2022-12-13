const fs = require("fs");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const strings = file_data.split(/\r?\n/);
console.log(strings);

let three_max_elves = [];
let current_elf_calories = 0;

let max = 0;
let max_items = [];
let current_elf_items = [];

for (var i = 0; i < strings.length; i++) {
  //if we have a non-empty value - started list of the new elf
  if (strings[i].length > 0) {
    const item_calories = parseInt(strings[i]);
    current_elf_calories += item_calories;
    current_elf_items.push(strings[i]);
  }

  if (strings[i].length === 0 || i == strings.length - 1) {
    //got empty string OR end of the list - current elf's list ended
    if (current_elf_calories > max) {
      max = current_elf_calories;
      max_items = current_elf_items;
    }
    three_max_elves = addToThreeMaxIfEligible(
      three_max_elves,
      current_elf_calories
    );
    current_elf_calories = 0;
    current_elf_items = [];
  }
}

const sum = three_max_elves.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  0
);

console.log("three max calories:");
console.log(three_max_elves);

console.log("sum of 3 max calories:");
console.log(sum);

//Check if current elf calories should be included in the 3 max calories list
function addToThreeMaxIfEligible(three_max_elves, current_elf_calories) {
  for (let i = 0; i < 3; i++) {
    //we don't have a list of 3 items yet
    if (three_max_elves[i] === undefined) {
      three_max_elves[i] = current_elf_calories;
      break;
    } else if (current_elf_calories > three_max_elves[i]) {
      //we need to include new element and move existing elements
      three_max_elves.splice(i, 0, current_elf_calories);
      three_max_elves = three_max_elves.slice(0, 3);
      break;
    }
  }
  return three_max_elves;
}
