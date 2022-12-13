const fs = require("fs");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const rucksacks = file_data.split(/\r?\n/);
let score = 0;

for (rucksack of rucksacks) {
  const compartment_length = rucksack.length / 2;
  const compartment_1 = rucksack.slice(0, compartment_length);
  const compartment_2 = rucksack.slice(compartment_length);
  const duplicates = [];
  for (let i = 0; i < compartment_1.length; i++) {
    if (compartment_2.indexOf(compartment_1[i]) > -1)
      duplicates.push(compartment_1[i]);
  }

  const itemTypesToCount = {};

  for (itemType of duplicates) {
    if (itemTypesToCount[itemType] == undefined) {
      itemTypesToCount[itemType] = 1;
    } else {
      itemTypesToCount[itemType]++;
    }
  }

  for (itemType of Object.getOwnPropertyNames(itemTypesToCount)) {
    console.log(itemType);
    let charCode = itemType.charCodeAt(0);
    //lowercase
    if (charCode >= 97 && charCode <= 122) {
      console.log(charCode - 96);
      score += charCode - 96;
    }
    //uppercase
    if (charCode >= 65 && charCode <= 90) {
      console.log(charCode - 64 + 26);
      score += charCode - 64 + 26;
    }
  }
  console.log("------------");
}

console.log(score);
