const fs = require("fs");
const lines = parseInput("./input.txt");

let startTime = performance.now();

let sensors = [];
//precalculate distances for each sensor
let sensorDistances = [];
let beaconMaxCoordinate = 4000000;
let res = 0;

for (line of lines) {
  [, sensorX, sensorY] = line.match(/Sensor at x=([0-9-]+), y=([0-9-]+)/);
  [, beaconX, beaconY] = line.match(/beacon is at x=([0-9-]+), y=([0-9-]+)/);

  sensors.push([parseInt(sensorX), parseInt(sensorY)]);
  sensorDistances.push(
    distanceBetweenPoints(sensorX, sensorY, beaconX, beaconY)
  );
}

//go through all sensors and generate possible clear spots
let x = 0;
let y = 0;
while (x <= beaconMaxCoordinate) {
  y = 0;
  while (y <= beaconMaxCoordinate) {
    let deltas = [];
    let covered = false;
    //check position against all sensors
    for (sensor_index in sensors) {
      let sensor = sensors[sensor_index];
      let covered_distance = sensorDistances[sensor_index];
      let current_distance = distanceBetweenPoints(sensor[0], sensor[1], x, y);
      if (current_distance <= covered_distance) {
        //sensor can reach current point
        deltas.push(Math.abs(current_distance - covered_distance)); // how many points we can jump still being in the sensor area
        covered = true;
      }
    }

    if (!covered) {
      res = x * 4000000 + y;
      break;
    }
    let maxDelta = Math.max(...deltas);
    let increment = Math.max(maxDelta, 1);
    y += increment;
  }
  x++;
}

let endTime = performance.now();
console.log("result: ", res);
console.log("time taken (in seconds): ", (endTime - startTime) / 1000);

//--------------
function distanceBetweenPoints(x1, y1, x2, y2) {
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
