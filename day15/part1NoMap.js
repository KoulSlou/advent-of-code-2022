const fs = require("fs");
const lines = parseInput("./input.txt");

let space = [];
let sensors = [];
let beacons = [];
let xOffset = 0;
let yOffset = 0;

for (line of lines) {
  [, sensorX, sensorY] = line.match(/Sensor at x=([0-9-]+), y=([0-9-]+)/);
  [, beaconX, beaconY] = line.match(/beacon is at x=([0-9-]+), y=([0-9-]+)/);

  sensors.push([parseInt(sensorX), parseInt(sensorY)]);
  beacons.push([parseInt(beaconX), parseInt(beaconY)]);
}

let maxX = Math.max(...[...beacons, ...sensors].map((el) => parseInt(el[0])));
let maxY = Math.max(...[...beacons, ...sensors].map((el) => parseInt(el[1])));
let minX = Math.min(...[...beacons, ...sensors].map((el) => parseInt(el[0])));
let minY = Math.min(...[...beacons, ...sensors].map((el) => parseInt(el[1])));

//find the left most zone
for (sensor_index in sensors) {
  let sensor = sensors[sensor_index];
  let beacon = beacons[sensor_index];

  //diff in X coordiante
  let xDist = Math.abs(sensor[0] - sensor[1]);
  if (sensor[0] - xDist < minX) {
    minX = sensor[0] - xDist;
  }
  if (sensor[0] + xDist > maxX) {
    maxX = sensor[0] + xDist;
  }
}

let count = 0;
let sensor_beacon_distance = 0;
let current_distance = 0;

let reservedSpots = {};

for (point of [...sensors, ...beacons]) {
}

let lineToCheck = 2000000;

//going through whole line
for (let i = minX; i <= maxX; i++) {
  //going through each sensor
  for (sensor_index in sensors) {
    [sX, sY] = sensors[sensor_index];
    [bX, bY] = beacons[sensor_index];
    sensor_beacon_distance = distanceBetweenPoint(sX, sY, bX, bY);
    //check if current point is within distance to the sensor
    //if yes, increase counter
    current_distance = distanceBetweenPoint(i, lineToCheck, sX, sY);
    if (current_distance <= sensor_beacon_distance) {
      //   console.log("within reach!!!!", i, lineToCheck);
      //   console.log("----------");
      count++;
      break;
    }
  }
}

//Y coordiante is fixed, store only X coordiate here
let pointsOnCheckLine = [];
//find beacons and sensors on this line and remove from result
for (point of [...sensors, ...beacons]) {
  [pointX, pointY] = point;
  if (pointY === lineToCheck) {
    console.log("something on check line", point);
    if (!pointsOnCheckLine.includes(pointX)) {
      pointsOnCheckLine.push(pointX);
    }
  }
}
console.log(count - pointsOnCheckLine.length);

function distanceBetweenPoint(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
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
