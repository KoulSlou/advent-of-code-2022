const fs = require("fs");
const { exit } = require("process");
const [drawing, guide] = parseInput("./input.txt");
const RIGHT = "right";
const LEFT = "left";
const DOWN = "down";
const UP = "up";

/**
 * (You guessed 100278.) - too high
 * (You guessed 124130.) - too high
 */

const DIRECTIONS_MAP = {
  [RIGHT]: { R: DOWN, L: UP, D: ">" },
  [DOWN]: { R: LEFT, L: RIGHT, D: "v" },
  [LEFT]: { R: UP, L: DOWN, D: "<" },
  [UP]: { R: RIGHT, L: LEFT, D: "^" },
};

//we need to find max string length to offset all lines to it
const drawingLines = drawing.split("\n");
const maxRowLength = Math.max(...drawingLines.map((row) => row.length));

const map = [];

for (let i = 0; i < drawingLines.length; i++) {
  map[i] = [];
  const drawingPoint = drawingLines[i].split("");
  for (let j = 0; j < maxRowLength; j++) {
    map[i][j] = drawingPoint[j] === undefined ? " " : drawingPoint[j];
  }
}

const instructions = guide.matchAll(/([0-9]+)|[R,L]/g);
let direction = RIGHT;
let startColumn = map[0].indexOf(".");
console.log(startColumn);

let currentX = 0;
let currentY = startColumn;
let count = 0;

for (step of instructions) {
  count++;
  //draw point on the map
  map[currentX][currentY] = DIRECTIONS_MAP[direction]["D"];

  if (step[0] === "R" || step[0] === "L") {
    direction = DIRECTIONS_MAP[direction][step[0]];
    continue;
  } else {
    for (let move = 0; move < parseInt(step[0]); move++) {
      let potentialX = currentX;
      let potenitalY = currentY;
      //draw point on the map
      map[currentX][currentY] = DIRECTIONS_MAP[direction]["D"];

      if (direction === RIGHT) {
        potenitalY++;
      } else if (direction === LEFT) {
        potenitalY--;
      } else if (direction === UP) {
        potentialX--;
      } else if (direction === DOWN) {
        potentialX++;
      } else {
        console.log("something else");
      }

      //first check if we are off the map
      if (isOffMap(potentialX, potenitalY, map)) {
        //we should find jump coordinates
        let [jumpX, jumpY] = getWrapCoordinate(
          currentX,
          currentY,
          map,
          direction
        );
        // console.log(
        //   `point ${potentialX},${potenitalY} is off the map, trying to jump to ${jumpX}, ${jumpY}`
        // );
        if (isWall(jumpX, jumpY, map)) {
          break;
        } else {
          currentX = jumpX;
          currentY = jumpY;
          map[currentX][currentY] = DIRECTIONS_MAP[direction]["D"];
          continue;
        }
      } else if (isWall(potentialX, potenitalY, map)) {
        break;
      } else if (cellIsFree(potentialX, potenitalY, map)) {
        currentX = potentialX;
        currentY = potenitalY;
        map[currentX][currentY] = DIRECTIONS_MAP[direction]["D"];
        continue;
      } else {
        console.log("unexpected");
        exit();
      }
    }
  }
}

let finalRow = currentX + 1;
let finalColumn = currentY + 1;

let facing;
if (direction === RIGHT) {
  facing = 0;
} else if (direction === DOWN) {
  facing = 1;
} else if (direction === LEFT) {
  facing = 2;
} else if (direction === UP) {
  facing = 3;
}

console.log(1000 * finalRow + 4 * finalColumn + facing);

fs.writeFileSync("./passing.txt", map.map((v) => v.join("")).join("\n"));

function isOffMap(x, y, map) {
  if (x < 0 || x > map.length - 1) {
    return true;
  } else if (y < 0 || y > maxRowLength - 1) {
    return true;
  } else if (map[x][y] === " ") {
    return true;
  }
  return false;
}

//x, y is a first coordinate off the map
function getWrapCoordinate(x, y, map, direction) {
  if (direction === RIGHT) {
    // console.log("wrapping right direction");
    //changing y
    //find first not empty cell
    for (let wrapY = 0; wrapY < maxRowLength; wrapY++) {
      if (cellNotVoid(x, wrapY, map)) {
        // console.log("not void wrapping", x, wrapY);
        return [x, wrapY];
      }
    }
  } else if (direction === LEFT) {
    //changing y
    //find first not empty cell
    for (let wrapY = maxRowLength - 1; wrapY >= 0; wrapY--) {
      if (cellNotVoid(x, wrapY, map)) {
        // console.log("not void wrapping", x, wrapY);
        return [x, wrapY];
      }
    }
  } else if (direction === DOWN) {
    //changing x
    //find first not empty cell
    for (let wrapX = 0; wrapX < map.length - 1; wrapX++) {
      if (cellNotVoid(wrapX, y, map)) {
        return [wrapX, y];
      }
    }
  } else if (direction === UP) {
    for (let wrapX = map.length - 1; wrapX >= 0; wrapX--) {
      if (cellNotVoid(wrapX, y, map)) {
        return [wrapX, y];
      }
    }
  }
}

function cellNotVoid(x, y, map) {
  //   return map[x][y] !== " ";
  return [".", ">", "^", "<", "v"].includes(map[x][y]);
}
function cellIsFree(x, y, map) {
  if (map[x][y] === undefined) {
    console.log("error");
  }
  if (map[x][y] !== "#" && map[x][y] !== " ") {
    return true;
  }
  return false;
}

function isWall(x, y, map) {
  return map[x][y] === "#";
}

function parseInput(file) {
  const file_data = fs.readFileSync(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  const lines = file_data.split(/\n\n/);
  return lines;
}

function drawMap(map) {
  for (let i = 0; i < map.length; i++) {
    console.log(map[i].join(""));
  }
}
