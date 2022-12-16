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

let sensorDistances = [];
let beaconMaxCoordinate = 4000000;
let possibleLocations = [];
//precalculate distances for each sensor

for (sensor_index in sensors) {
  sensor = sensors[sensor_index];
  beacon = beacons[sensor_index];
  sensorDistances.push(
    distanceBetweenPoint(sensor[0], sensor[1], beacon[0], beacon[1])
  );
}

//go through all sensors and generate possible clear spots
let x = 0;
let y = 0;
while (x <= beaconMaxCoordinate) {
  y = 0;
  while (y <= beaconMaxCoordinate) {
    console.log(x, y);
    let deltas = [];
    let covered = false;
    //check position against all sensors
    for (sensor_index in sensors) {
      let sensor = sensors[sensor_index];
      let covered_distance = sensorDistances[sensor_index];
      let current_distance = distanceBetweenPoint(sensor[0], sensor[1], x, y);
      if (current_distance <= covered_distance) {
        //sensor can reach current point
        deltas.push(Math.abs(current_distance - covered_distance)); // how many points we can jump still being in the sensor area
        covered = true;
      }
    }

    if (!covered) {
      console.log("hi");
      possibleLocations.push(x, y);
    }

    let minDelta = Math.min(...deltas);
    let increment = Math.max(minDelta, 1);

    y += increment;
  }
  x++;
}

console.log(possibleLocations);

/*
for (sensor_index in sensors) {
  sensor = sensors[sensor_index];
  covered_distance = sensorDistances[sensor_index];
  for (let x = 0; x <= beaconMaxCoordinate; x++) {
    let y = 0;
    console.log(x, y);
    current_distance = distanceBetweenPoint(sensor[0], sensor[1], x, y);
    while (y <= beaconMaxCoordinate) {
      current_distance = distanceBetweenPoint(sensor[0], sensor[1], x, y);

      if (current_distance <= covered_distance) {
        //bad spot
        let delta = covered_distance - current_distance;
        y += Math.max(delta, 1);
        continue;
      } else {
        //check what other sensors think
        let covered = false;
        for (i in sensors) {
          let sensor = sensors[i];
          let distance = distanceBetweenPoint(sensor[0], sensor[1], x, y);
          if (distance <= sensorDistances[i]) {
            covered = true;
            break;
          }
        }
        if (!covered) {
          possibleLocations.push([x, y]);
        }
      }
      y++;
    }
  }
}*/

//go through all area and check if point is catched by any sensor
// for (let x = 0; x <= beaconMaxCoordinate; x++) {
//   let y = 0;
//   while (y <= beaconMaxCoordinate) {
//     //go through each sensor
//     let coveredBySensor = false;
//     for (sensor_index in sensors) {
//       sensor = sensors[sensor_index];
//       covered_distance = sensorDistances[sensor_index];

//       //calculate distance from current point to sensor
//       current_distance = distanceBetweenPoint(sensor[0], sensor[1], x, y);

//       if (current_distance <= covered_distance) {
//         let delta = current_distance - covered_distance;
//         coveredBySensor = true;
//         y += delta;
//         break;
//       }
//     }
//     //check if at least one sensor covers this spot
//     if (!coveredBySensor) {
//       possibleLocations.push([x, y]);
//     }
//     y++;
//   }
// }

//if there are multiple possible locations
//filter our beacon and signal coordinates

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
