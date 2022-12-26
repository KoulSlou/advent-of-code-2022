const fs = require("fs");
const { hasUncaughtExceptionCaptureCallback } = require("process");
const lines = parseInput("./input.txt");

//get number of rows
const rowsCount = lines.length;
//get number of columns
const colsCount = lines[0].length;
const elves = [];
const NORTH = "north";
const SOUTH = "south";
const WEST = "west";
const EAST = "east";
const NUMBER_OF_ROUNDS = 10;
const DIRESCTIONS_CHECK = [NORTH, SOUTH, WEST, EAST];
let currentDirectionCheck = 0;
let elfCount = 1;

const offsetLength = 100;

//create a map with an offset
const map = [];
for (let i = 0; i <= rowsCount + offsetLength; i++) {
  map[i] = [];
  for (let j = 0; j <= colsCount + offsetLength; j++) {
    map[i][j] = ".";
    if (
      lines[i - offsetLength / 2] &&
      lines[i - offsetLength / 2][j - offsetLength / 2] !== undefined
    ) {
      map[i][j] = lines[i - offsetLength / 2][j - offsetLength / 2];
    }
    //initialize Elf
    if (map[i][j] === "#") {
      let currentElf = new Elf(i, j, elfCount);
      elves.push(currentElf);
      elfCount += 1;
    }
  }
}

let round = 0;
//Rounds loop
while (true) {
  round++;
  console.log("starting round ", round);
  let canStayCount = 0;
  //going through round
  //for each elf check directions
  for (let elfObj of elves) {
    elfObj.plannedMove = null;
    if (elfObj.canStay()) {
      canStayCount++;
      continue;
    }

    //planning move for each elf
    for (let direction of DIRESCTIONS_CHECK) {
      if (elfObj.directionIsFree(direction, map)) {
        elfObj.planNextMove(direction);
        break;
      }
    }
  }

  if (canStayCount === elves.length) {
    console.log("all elves can stay!");
    console.log(round);
    return;
  }

  //check if several elves planned the same move
  //map of coordinates to elves
  let plannedMovesMap = {};
  for (let elfObj of elves) {
    if (!elfObj.hasPlan()) {
      continue;
    }
    let keyMap = elfObj.plannedMove.join("-");
    if (plannedMovesMap[keyMap] === undefined) {
      plannedMovesMap[keyMap] = [];
    }
    plannedMovesMap[keyMap].push(elfObj);
  }

  for (let plan in plannedMovesMap) {
    if (plannedMovesMap[plan].length > 1) {
      for (let e of plannedMovesMap[plan]) {
        e.clearNextMove();
      }
    }
  }

  //at this point all elves who need to move should have non-NULL plan
  for (let e of elves) {
    if (e.hasPlan()) {
      let [currentX, currentY] = e.currentPosition;
      let [newX, newY] = e.plannedMove;
      map[newX][newY] = "#";
      map[currentX][currentY] = ".";
      //swap planned and current coordinates
      e.currentPosition = [newX, newY];
      //clear plans
      e.clearNextMove();
    }
  }
  //transform directions array
  let usedDirection = DIRESCTIONS_CHECK.shift();
  DIRESCTIONS_CHECK.push(usedDirection);
}

function Elf(x, y, orderNumber) {
  this.currentPosition = [x, y];
  this.orderNumber = orderNumber;

  this.hasPlan = () => {
    return this.plannedMove !== null;
  };

  this.clearNextMove = () => {
    this.plannedMove = null;
  };
  this.samePlannedMove = (Elf) => {
    return JSON.stringify(this.plannedMove) === JSON.stringify(Elf.plannedMove);
  };

  //elf needs to move only if there is another elf in the next cells
  this.canStay = () => {
    return (
      this.directionIsFree(NORTH, map) &&
      this.directionIsFree(SOUTH, map) &&
      this.directionIsFree(EAST, map) &&
      this.directionIsFree(WEST, map)
    );
  };

  this.directionIsFree = (direction, map) => {
    let [x, y] = this.currentPosition;

    switch (direction) {
      //checking N, NE, NW that there is no elves
      case NORTH:
        return (
          map[x - 1][y] !== "#" &&
          map[x - 1][y + 1] !== "#" &&
          map[x - 1][y - 1] !== "#"
        );
      case SOUTH:
        return (
          map[x + 1][y] !== "#" &&
          map[x + 1][y + 1] !== "#" &&
          map[x + 1][y - 1] !== "#"
        );
      case WEST:
        return (
          map[x][y - 1] !== "#" &&
          map[x - 1][y - 1] !== "#" &&
          map[x + 1][y - 1] !== "#"
        );
      case EAST:
        return (
          map[x][y + 1] !== "#" &&
          map[x - 1][y + 1] !== "#" &&
          map[x + 1][y + 1] !== "#"
        );
    }
    console.log("Unexpected direction", direction);
    process.exit(1);
  };

  this.planNextMove = (direction) => {
    let [x, y] = this.currentPosition;
    switch (direction) {
      case NORTH:
        this.plannedMove = [x - 1, y];
        return;
      case SOUTH:
        this.plannedMove = [x + 1, y];
        return;
      case WEST:
        this.plannedMove = [x, y - 1];
        return;
      case EAST:
        this.plannedMove = [x, y + 1];
        return;
    }
    console.log("Unexpected direction", direction);
    process.exit(1);
  };
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

function printMap(map) {
  for (let i = 0; i < map.length; i++) {
    console.log(map[i].join(""));
  }
}
