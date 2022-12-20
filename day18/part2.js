const fs = require("fs");
const { exit } = require("process");
const lines = parseInput("./input.txt");

///4168 is too high

//key 'x-y-z' coordinates
//records will be set only for cubes from the list
let airCubesHashmap = {};
const hashmap = {};
const cubes = [];
let fullyClosedCubesHashmap = [];
let totalOpenSides = 0;

for (line of lines) {
  let coordinates = line.split(",").map((v) => parseInt(v));
  cubes.push(coordinates);
  hashmap[line] = 1;
}

totalOpenSides = getTotalOpenSides(cubes, hashmap, fullyClosedCubesHashmap);

//find air cubes
for (cube of cubes) {
  let [x, y, z] = cube;
  if (fullyClosedCubesHashmap[cube.join()]) {
    continue;
  }

  let possibleAirCubeCoordinates = getNearCubes(cube);
  for (let possibleAirCube of possibleAirCubeCoordinates) {
    if (checkPossibleAirCube(possibleAirCube)) {
      airCubesHashmap[possibleAirCube.join()] = 1;
    }
  }
}

let airCubes = [];
let airCubesFullyClosedHashmap = {};
for (air_cube_coordinates in airCubesHashmap) {
  airCubes.push(air_cube_coordinates.split(",").map((v) => parseInt(v)));
}

let airCubesOpenSides = getTotalOpenSides(
  airCubes,
  airCubesHashmap,
  airCubesFullyClosedHashmap
);

console.log(totalOpenSides - airCubesOpenSides);

function getTotalOpenSides(cubes, hashmap, fullyClosedCubesHashmap) {
  let openSides = 0;
  for (cube of cubes) {
    let cubeOpenSides = 6;

    let nearCubes = getNearCubes(cube);

    for (nearCube of nearCubes) {
      key = nearCube.join();
      if (hashmap[key] !== undefined) {
        cubeOpenSides--;
      }
    }

    if (cubeOpenSides === 0) {
      fullyClosedCubesHashmap[cube.join()] = 1;
    }
    openSides += cubeOpenSides;
  }
  return openSides;
}

function getNearCubes(cubeCoordinates) {
  let [x, y, z] = cubeCoordinates;
  let result = [];
  result.push([x + 1, y, z]);
  result.push([x - 1, y, z]);
  result.push([x, y + 1, z]);
  result.push([x, y - 1, z]);
  result.push([x, y, z + 1]);
  result.push([x, y, z - 1]);
  return result;
}

function checkPossibleAirCube(airCubeCoordinates) {
  if (hashmap[airCubeCoordinates.join()] !== undefined) {
    return false;
  }

  let [x, y, z] = airCubeCoordinates;

  let nearCubes = [];
  nearCubes.push([x + 1, y, z]);
  nearCubes.push([x - 1, y, z]);
  nearCubes.push([x, y + 1, z]);
  nearCubes.push([x, y - 1, z]);
  nearCubes.push([x, y, z + 1]);
  nearCubes.push([x, y, z - 1]);

  let count = 0;
  //if all of them exists, but air cube doesn't exist - we found it
  for (nearCube of nearCubes) {
    key = nearCube.join();
    if (hashmap[key] !== undefined) {
      count++;
    }
  }
  if (count == 6) {
    return true;
  } else {
    return false;
  }
}

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
