const fs = require("fs");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const strings = file_data.split(/\r?\n/);
let max = 0;
let current_elf_calories = 0;
let max_items = [];
let current_elf_items = [];

for (string of strings) {
  //if we have a non-empty value - started list of the new elf
  if (string.length > 0) {
    const item_calories = parseInt(string);
    current_elf_calories += item_calories;
    current_elf_items.push(string);
  } else {
    //got empty string - current elf's list ended
    if (current_elf_calories > max) {
      max = current_elf_calories;
      max_items = current_elf_items;
    }
    current_elf_calories = 0;
    current_elf_items = [];
  }
}

console.log(max_items);
console.log(max);
