const fs = require("fs");

const file_data = fs.readFileSync("./input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const pairs = file_data.split(/\r?\n/);

let full_overlaps = 0;

for (pair of pairs) {
  //split each elf
  let elves_task = pair.split(",");

  let first_elf_task = elves_task[0].split("-").map((e) => parseInt(e));
  let second_elf_task = elves_task[1].split("-").map((e) => parseInt(e));

  if (
    first_elf_task[0] == second_elf_task[0] &&
    first_elf_task[1] == second_elf_task[1]
  ) {
    console.log(first_elf_task);
  }

  //if first elf fully includes second
  if (
    first_elf_task[0] <= second_elf_task[0] &&
    first_elf_task[1] >= second_elf_task[1]
  ) {
    full_overlaps++;
  } else if (
    second_elf_task[0] <= first_elf_task[0] &&
    second_elf_task[1] >= first_elf_task[1]
  ) {
    full_overlaps++;
  }
}

console.log(full_overlaps);
