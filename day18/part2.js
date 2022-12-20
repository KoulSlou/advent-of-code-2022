const fs = require("fs");
const { exit } = require("process");
const lines = parseInput("./example.txt");
let startTime = performance.now();

//key 'x-y-z' coordinates
//records will be set only for cubes from the list
const hashmap = {};
const cubes = [];
let fullyClosedCubesHashmap = [];
let totalOpenSides = 0;

for (line of lines) {
  let coordinates = line.split(",").map((v) => parseInt(v));
  cubes.push(coordinates);
  hashmap[line] = 1;
  let [x, y, z] = coordinates;
}

let maxX = Math.max(...cubes.map((v) => v[0]));
let maxY = Math.max(...cubes.map((v) => v[1]));
let maxZ = Math.max(...cubes.map((v) => v[2]));
let minX = Math.min(...cubes.map((v) => v[0]));
let minY = Math.min(...cubes.map((v) => v[1]));
let minZ = Math.min(...cubes.map((v) => v[2]));

let pocketsOfAir = {};

for (let i = minX; i <= maxX; i++) {
  for (let j = minY; j <= maxY; j++) {
    for (let k = minZ; k <= maxZ; k++) {
      //check if it's cube of air (aka is not in the list of our cubes)
      let key = [i, j, k].join();
      if (hashmap[key] === undefined) {
        //pocket of air found
        pocketsOfAir[key] = 1;
      }
    }
  }
}

let notLockedAirCubesHashmap = {};
let lockedAirCubesHashmap = {};

//this variables will be resetted during loops
let currentAirAreaHashmap = {};
let airArea = [];
let airPocketNearPoints = [];

for (let pocketOfAirIndex in pocketsOfAir) {
  //check if we already checked air area connected with this point
  if (
    notLockedAirCubesHashmap[pocketOfAirIndex] === 1 ||
    lockedAirCubesHashmap[pocketOfAirIndex] === 1
  ) {
    continue;
  }

  airArea.push(coordinatesStringToArray(pocketOfAirIndex));
  currentAirAreaHashmap[pocketOfAirIndex] = 1;
  let queueToCheck = [coordinatesStringToArray(pocketOfAirIndex)];

  do {
    //if near points are blocks remove them from the list
    airPocketNearPoints = getNearCubes(queueToCheck.shift())
      .filter((coordinates) => !isCube(coordinates))
      .filter(
        (coordinates) => currentAirAreaHashmap[coordinates.join()] === undefined
      );

    queueToCheck = [...queueToCheck, ...airPocketNearPoints];

    //combine them into one air area since they are connected
    airArea = [...airArea, ...airPocketNearPoints];

    let overMax = false;

    //if near points exceeded any of the maximum, it means this air area is not locked between blocks
    for (let airCube of airPocketNearPoints) {
      let [x, y, z] = airCube;
      if (
        x > maxX ||
        x < minX ||
        y > maxY ||
        y < minY ||
        z > maxZ ||
        z < minZ
      ) {
        //we can throw away this whole airArea
        overMax = true;
        break;
      }
      setCoordinatesInHashmap(airCube, currentAirAreaHashmap);
    }
    if (overMax) {
      //this is not closed air area
      for (let airCube of airArea) {
        setCoordinatesInHashmap(airCube, notLockedAirCubesHashmap);
      }
      airArea = [];
      currentAirAreaHashmap = {};
      queueToCheck = [];
      break;
    }
  } while (queueToCheck.length);

  if (airArea.length) {
    //at this point airArea should contain only locked air pockets
    for (let lockedAirCube of airArea) {
      setCoordinatesInHashmap(lockedAirCube, lockedAirCubesHashmap);
    }
  }

  airArea = [];
  currentAirAreaHashmap = {};
}

let lockedAirCubes = [];
for (let index in lockedAirCubesHashmap) {
  lockedAirCubes.push(coordinatesStringToArray(index));
}

let airLockedSides = getTotalOpenSides(
  lockedAirCubes,
  lockedAirCubesHashmap,
  {}
);

totalOpenSides = getTotalOpenSides(cubes, hashmap, fullyClosedCubesHashmap);
console.log(totalOpenSides - airLockedSides);
var endTime = performance.now();
console.log((endTime - startTime) / 1000);

function setCoordinatesInHashmap(coordinates, hashmap) {
  let key = coordinates.join();
  hashmap[key] = 1;
}

function coordinatesStringToArray(coordinates) {
  return coordinates.split(",").map((v) => parseInt(v));
}

function isCube(coordinates) {
  let key = coordinates.join();
  return hashmap[key] == 1;
}

function airCubeIsInsideBlocks(airCube) {
  //check that along each axis we have a block
}

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
