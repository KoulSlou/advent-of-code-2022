const fs = require("fs");

const file_data = fs.readFileSync("./example.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
});

const lines = file_data.split(/\r?\n/);
let space = [];

//build rocks
for (line of lines) {
  let coordinates = line.split(" -> ");
  let previous_point = null;
  for (point of coordinates) {
    [y, x] = point.split(",");

    //draw current point
    if (space[x] === undefined) {
      space[x] = [];
    }
    space[x][y] = 1;

    //if previous point is set - draw a line
    if (previous_point) {
      if (x != previous_point[0]) {
        //detect if x changed
        for (
          let i = Math.min(x, previous_point[0]);
          i < Math.max(x, previous_point[0]);
          i++
        ) {
          if (space[i] === undefined) {
            space[i] = [];
          }
          space[i][y] = 1;
        }
      } else if (y != previous_point[1]) {
        //detect if y changed
        for (
          let i = Math.min(y, previous_point[1]);
          i < Math.max(y, previous_point[1]);
          i++
        ) {
          space[x][i] = 1;
        }
      }
    }
    previous_point = [x, y];
  }
}

//sand can't fall below this point
let max_x = space.length - 1; //9

//find max coordinates
let max_y = 0;
for (row of space) {
  if (row && row.length > max_y) max_y = row.length;
}
max_y *= 2;

//format space - create all missing rows/columns
for (let x = 0; x < space.length; x++) {
  if (!space[x]) {
    space[x] = [];
  }
  for (let y = 0; y < max_y; y++) {
    if (space[x][y] !== 1) {
      space[x][y] = ".";
    }
  }
}

//adding floor
space[max_x + 1] = new Array(max_y).fill(".");
space[max_x + 2] = new Array(max_y).fill(1);

printSpace(50);
return;

let count = 0;
while (oneUnitFall(0, 500)) {
  count++;
}
console.log(count);
printSpace(50);

function oneUnitFall(x, y, debug = false) {
  if (debug) {
    console.log(x, y);
    console.log(space[x][y]);
  }

  if (space[x + 1] === undefined) {
    console.log("not possible");
    //unit is falling off
    return false;
  }

  if (space[x + 1][y] !== 1 && space[x + 1][y] !== 2) {
    return oneUnitFall(x + 1, y);
  } else if (space[x + 1][y - 1] !== 1 && space[x + 1][y - 1] !== 2) {
    return oneUnitFall(x + 1, y - 1);
  } else if (space[x + 1][y + 1] !== 1 && space[x + 1][y + 1] !== 2) {
    return oneUnitFall(x + 1, y + 1);
  }

  //reached end
  if (space[x][y] === 2) {
    return false;
  }
  space[x][y] = 2;
  return true;
}

function printSpace(length = 50) {
  for (row of space) {
    console.log(row.slice(-1 * length).join(""));
  }
}
