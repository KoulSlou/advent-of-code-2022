const fs = require("fs");
const { exit } = require("process");
const lines = parseInput("./input.txt");

///4396 is too high

//key 'x-y-x' coordinates
//records will be set only for cubes from the list
const hashmap = {};
const cubes = [];
let totalOpenSides = 0;

for (line of lines) {
  let coordinates = line.split(",").map((v) => parseInt(v));
  cubes.push(coordinates);
  hashmap[line] = 1;
}

for (cube of cubes) {
  [x, y, z] = cube;
  let cubeOpenSides = 6;

  let nearCubes = [];
  nearCubes.push([x + 1, y, z]);
  nearCubes.push([x - 1, y, z]);
  nearCubes.push([x, y + 1, z]);
  nearCubes.push([x, y - 1, z]);
  nearCubes.push([x, y, z + 1]);
  nearCubes.push([x, y, z - 1]);

  for (nearCube of nearCubes) {
    key = nearCube.join();
    if (hashmap[key] !== undefined) {
      console.log("closed side");
      cubeOpenSides--;
    } else {
      console.log("open side");
    }
  }
  totalOpenSides += cubeOpenSides;
  console.log(cubeOpenSides);
}

console.log(totalOpenSides);

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
