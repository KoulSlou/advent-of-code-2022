const fs = require("fs");
const jets = parseInput("./input.txt");

const VERTICAL_OFFSET = 3;
const LEFT_OFFSET = 2;

let currentJetIndex = 0;
let currentFigureIndex = 0;
let currentHighestPoint = -1; //floor in the beginning

let figures = ["line-hor", "cross", "l-shape", "line-ver", "square"];
let count = 0;

const map = [];
for (let i = 0; i < 7; i++) {
  map[i] = [];
}

//initialize first figure
let figure = initializeFigure(figures[currentFigureIndex]);

while (true) {
  let currentJetPattern = jets[currentJetIndex];

  //gas pushes figure
  if (currentJetPattern === ">") {
    moveFigureRight(map, figure);
  } else if (currentJetPattern === "<") {
    moveFigureLeft(map, figure);
  } else {
    console.log("unexpected condition", currentJetPattern);
    process.exit();
  }

  let can_move_down = moveFigureDown(map, figure);
  if (!can_move_down) {
    let figureHighestPoint = leaveFigureAtCurrentPosition(map, figure);
    if (figureHighestPoint > currentHighestPoint) {
      currentHighestPoint = figureHighestPoint;
    }
    count++;
    if (count == 2022) {
      break;
    }
    //init next figure
    currentFigureIndex = (currentFigureIndex + 1) % 5;
    console.log(currentFigureIndex);
    figure = initializeFigure(figures[currentFigureIndex]);
  }

  if (currentJetIndex < jets.length - 1) {
    currentJetIndex++;
  } else {
    currentJetIndex = 0;
  }
}

drawMap(map, figure);
console.log(count);
console.log(currentHighestPoint + 1);
// drawMap(map, figure);

function leaveFigureAtCurrentPosition(map, figure) {
  let figureMaxY = 0;
  //if figure can't move down, store figure on the map
  for (point of figure.points) {
    [x, y] = point;
    if (y > figureMaxY) {
      figureMaxY = y;
    }
    if (map[x] === undefined) {
      map[x] = [];
    }
    map[x][y] = "#";
  }
  //return highest position with a new figure in place;
  return figureMaxY;
}

function moveFigureDown(map, figure) {
  for (point of figure.points) {
    [x, y] = point;
    //over border or another figure found
    if (y - 1 < 0 || (map[x] && map[x][y - 1] == "#")) {
      return false;
    }
  }
  //updating points
  for (point of figure.points) {
    point[1]--;
  }
  return true;
}

function moveFigureRight(map, figure) {
  for (point of figure.points) {
    [x, y] = point;
    //over border or another figure found
    if (x + 1 == 7 || (map[x + 1] && map[x + 1][y] == "#")) {
      return false;
    }
  }
  //updating points
  for (point of figure.points) {
    point[0]++;
  }
  return true;
}

function moveFigureLeft(map, figure) {
  for (point of figure.points) {
    [x, y] = point;
    //over border or another figure found
    if (x - 1 < 0 || (map[x - 1] && map[x - 1][y] == "#")) {
      return false;
    }
  }
  //updating points
  for (point of figure.points) {
    point[0]--;
  }
  return true;
}

function initializeFigure(figureType) {
  let figure = new Figure(figureType);
  let initPoint = [LEFT_OFFSET, currentHighestPoint + VERTICAL_OFFSET + 1];
  if (figureType === "cross") {
    initPoint[0]++;
  }
  figure.setInitialPosition(initPoint);
  return figure;
}

function Figure(type) {
  this.type = type;
  this.points = [];
  this.includesPoint = function (x, y) {
    for (let point of this.points) {
      if (point[0] == x && point[1] == y) return true;
    }
    return false;
  };
  this.setInitialPosition = function (initializationPoint) {
    switch (type) {
      //for horizontal line initialization point is left most point - {i}###
      case "line-hor":
        this.points = [
          [initializationPoint[0], initializationPoint[1]],
          [initializationPoint[0] + 1, initializationPoint[1]],
          [initializationPoint[0] + 2, initializationPoint[1]],
          [initializationPoint[0] + 3, initializationPoint[1]],
        ];
        break;
      //for cross line initialization point is the bottom one
      //     #
      //   # #  #
      //    {i}
      case "cross":
        this.points = [
          [initializationPoint[0], initializationPoint[1]],
          [initializationPoint[0], initializationPoint[1] + 1],
          [initializationPoint[0], initializationPoint[1] + 2],
          [initializationPoint[0] - 1, initializationPoint[1] + 1],
          [initializationPoint[0] + 1, initializationPoint[1] + 1],
        ];
        break;
      //for L-shape init point is the most left one in the bottom
      //       #
      //       #
      // {i} # #
      case "l-shape":
        this.points = [
          [initializationPoint[0], initializationPoint[1]],
          [initializationPoint[0] + 1, initializationPoint[1]],
          [initializationPoint[0] + 2, initializationPoint[1]],
          [initializationPoint[0] + 2, initializationPoint[1] + 1],
          [initializationPoint[0] + 2, initializationPoint[1] + 2],
        ];
        break;
      //for vertical line init point is the bottom one
      //   #
      //   #
      //   #
      //  {i}
      case "line-ver":
        this.points = [
          [initializationPoint[0], initializationPoint[1]],
          [initializationPoint[0], initializationPoint[1] + 1],
          [initializationPoint[0], initializationPoint[1] + 2],
          [initializationPoint[0], initializationPoint[1] + 3],
        ];
        break;
      case "square":
        //for square init point is the most left-bottom one
        //   # #
        //  {i}#
        this.points = [
          [initializationPoint[0], initializationPoint[1]],
          [initializationPoint[0] + 1, initializationPoint[1]],
          [initializationPoint[0], initializationPoint[1] + 1],
          [initializationPoint[0] + 1, initializationPoint[1] + 1],
        ];
        break;
      default:
        console.log("unknown shaped", type);
        process.exit();
        break;
    }
  };
}

function parseInput(file) {
  const file_data = fs.readFileSync(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  return file_data;
}

function drawMap(map, figure) {
  console.log("\n\n");
  for (let i = 0; i < 7; i++) {
    let drawingColumn = [...map[i]];
    for (let j = 0; j < currentHighestPoint + 20; j++) {
      drawingColumn[j] = map[i][j] || ".";
      if (drawingColumn[j] !== "#" && figure.includesPoint(i, j)) {
        drawingColumn[j] = "@";
      }
    }
    console.log(drawingColumn.join(""));
  }
}

function drawMapInversion(map, figure) {
  let drawingMap = [];
  for (let i = currentHighestPoint + 20; i >= 0; i--) {
    drawingMap[i] = map[i] || [];
    for (let j = 0; j < 7; j++) {
      if (drawingMap[i][j] === undefined) {
        drawingMap[i][j] = ".";
      }
      if (drawingMap[i][j] !== "#" && figure.includesPoint(j, i)) {
        drawingMap[i][j] = "@";
      }
    }
    console.log(drawingMap[i].join(""));
  }
}
