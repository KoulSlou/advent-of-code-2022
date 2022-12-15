const fs = require("fs");
const lines = parseInput("./example.txt");

let space = [];
let sensors = [];
let beacons = [];
let xOffset = 0;
let yOffset = 0;

for (line of lines) {
  [, sensorY, sensorX] = line.match(/Sensor at x=([0-9-]+), y=([0-9-]+)/);
  [, beaconY, beaconX] = line.match(/beacon is at x=([0-9-]+), y=([0-9-]+)/);

  sensors.push([parseInt(sensorX), parseInt(sensorY)]);
  beacons.push([parseInt(beaconX), parseInt(beaconY)]);
}

let maxX = Math.max(...[...beacons, ...sensors].map((el) => parseInt(el[0])));
let maxY = Math.max(...[...beacons, ...sensors].map((el) => parseInt(el[1])));
let minX = Math.min(...[...beacons, ...sensors].map((el) => parseInt(el[0])));
let minY = Math.min(...[...beacons, ...sensors].map((el) => parseInt(el[1])));

if (minX < 0) {
  xOffset = Math.abs(minX);
}
if (minY < 0) {
  yOffset = Math.abs(minY);
}

//draw sensors and beacons
for (sensor_index in sensors) {
  [sX, sY] = sensors[sensor_index];
  drawPoint([sX + xOffset, sY + yOffset], "S", space);
  [bX, bY] = beacons[sensor_index];
  drawPoint([bX + xOffset, bY + yOffset], "B", space);
}

//draw rest of the map
drawRestOfMap(space, maxX + xOffset, maxY + yOffset);
printSpace();

let count = 0;
//build beacon overlap
for (sensor_index in sensors) {
  [sX, sY] = sensors[sensor_index];
  [bX, bY] = beacons[sensor_index];
  let distance = distanceBetweenPoint(sX, sY, bX, bY);
  //starting from sensor mark places where beacon can't be
  let startX = sX + xOffset;
  let startY = sY + yOffset;

  while (
    distanceBetweenPoint(startX, startY, sX + xOffset, sY + yOffset) <= distance
  ) {
    markSameDistanceInRow(startX, startY, space, distance);
    startX--;
  }

  startX = sX + xOffset;
  while (
    distanceBetweenPoint(startX, startY, sX + xOffset, sY + yOffset) <= distance
  ) {
    markSameDistanceInRow(startX, startY, space, distance);
    startX++;
  }
  count++;
}
// printSpace();
let lineToCheck = 10 + xOffset;
let result = space[lineToCheck].filter((e) => e === "#").length;
console.log(result);
return;
//-------------------
function markSameDistanceInRow(sensorX, sensorY, space, distance) {
  let x = sensorX;
  let y = sensorY;

  //going to the left side from sensor
  while (distanceBetweenPoint(sX + xOffset, sY + yOffset, x, y) <= distance) {
    //check if we are over limit
    if (space[x] === undefined || space[x][y] === undefined) {
      break;
    }
    if (space[x][y] !== ".") {
      console.log("Unexpected condition", x, y, space[x][y]);
    } else {
      drawPoint([x, y], "#", space);
    }
    y--;
  }

  y = sensorY;
  //going to the right side
  while (distanceBetweenPoint(sX + xOffset, sY + yOffset, x, y) <= distance) {
    //check if we are over limit
    if (space[x] === undefined || space[x][y] === undefined) {
      break;
    }
    if (space[x][y] !== ".") {
      console.log("Unexpected condition lala", x, y, space[x][y]);
    } else {
      drawPoint([x, y], "#", space);
    }

    y++;
  }
}

function distanceBetweenPoint(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function drawRestOfMap(space, toX, toY) {
  for (let i = 0; i <= toX; i++) {
    for (let j = 0; j <= toY; j++) {
      if (!space[i] || !space[i][j]) {
        drawPoint([i, j], ".", space);
      }
    }
  }
}

function drawPoint(point, symbol, space) {
  [x, y] = point;
  if (space[x] === undefined) {
    space[x] = [];
  }
  space[x][y] = symbol;
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

function printSpace() {
  for (row of space) {
    console.log(row.join(""));
  }
}
