const fs = require("fs");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const rucksacks = file_data.split(/\r?\n/);
const itemBadges = [];
let score = 0;

//find groups of 3
for (let i = 0; i < rucksacks.length; i += 3) {
  let rucksack_1 = rucksacks[i];
  let rucksack_2 = rucksacks[i + 1];
  let rucksack_3 = rucksacks[i + 2];

  for (let itemType of rucksack_1) {
    if (
      rucksack_2.indexOf(itemType) > -1 &&
      rucksack_3.indexOf(itemType) > -1
    ) {
      itemBadges.push(itemType);
      break;
    }
  }
}

for (badge of itemBadges) {
  let charCode = badge.charCodeAt(0);

  //lowercase
  if (charCode >= 97 && charCode <= 122) {
    score += charCode - 96;
  }
  //uppercase
  if (charCode >= 65 && charCode <= 90) {
    score += charCode - 64 + 26;
  }
}

console.log(score);
