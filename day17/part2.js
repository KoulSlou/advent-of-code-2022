const { countReset } = require("console");
const fs = require("fs");
const jets = parseInput("./input.txt");

const VERTICAL_OFFSET = 3;
const LEFT_OFFSET = 2;

const RUNS = 1000000000000;

let currentJetIndex = 0;
let currentFigureIndex = 0;
let currentHighestPoint = -1; //floor in the beginning

let figures = ["line-hor", "cross", "l-shape", "line-ver", "square"];
let count = 0;
let possibleStates = {};
let stateJetFigureMap = {};

let loopStartCount = 0;
let loopStartHeight = 0;
let loopStartState = null;

let countIncreasePerLoop = 0;
let heightIncreasePerLoop = 0;

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
      let state = getSurfaceRepresentation(map);
      if (possibleStates[state] === undefined) {
        possibleStates[state] = 1;
      } else {
        possibleStates[state]++;
      }

      //save to state-jet-figure map
      let key = state + "-J" + currentJetIndex + "-F" + currentFigureIndex;
      if (stateJetFigureMap[key] == undefined) {
        stateJetFigureMap[key] = 1;
      } else {
        //in this case we saw repeating patern
        stateJetFigureMap[key]++;
        if (stateJetFigureMap[key] == 2) {
          //start analysing loop
          if (!loopStartCount) {
            loopStartCount = count;
            loopStartHeight = currentHighestPoint;
            loopStartState = key;
          }
        } else if (stateJetFigureMap[key] == 3) {
          //we did a full loop
          countIncreasePerLoop = count - loopStartCount;
          heightIncreasePerLoop = currentHighestPoint - loopStartHeight;
          break;
        }
      }
    }
    count++;
    if (count == RUNS) {
      break;
    }
    //init next figure
    currentFigureIndex = (currentFigureIndex + 1) % 5;
    figure = initializeFigure(figures[currentFigureIndex]);
  }

  if (currentJetIndex < jets.length - 1) {
    currentJetIndex++;
  } else {
    currentJetIndex = 0;
  }
}

// console.log(possibleStates);
console.log(stateJetFigureMap);
console.log("number of possible states", Object.keys(stateJetFigureMap).length);

console.log("loop started at count", loopStartCount);
console.log("loop started at height", loopStartHeight);
console.log("count increase per loop", countIncreasePerLoop);
console.log("height increase per loop", heightIncreasePerLoop);
console.log("loop start state", loopStartState);

let numberOfLoops = Math.floor((RUNS - loopStartCount) / countIncreasePerLoop);
let potentialHeight = numberOfLoops * heightIncreasePerLoop;
let result = potentialHeight + loopStartHeight;
let leftCountsToRun =
  RUNS - loopStartCount - countIncreasePerLoop * numberOfLoops;

if (leftCountsToRun !== 0) {
  //we need to continue simulation, because loop wasn't fully completed
  let surfacesState = loopStartState.split("-");
  let mapState = surfacesState.slice(0, 7);
  let jetIndex = parseInt(surfacesState[7].slice(1));
  let figureIndex = parseInt(surfacesState[8].slice(1));
  //reset height to the max point of the row
  let surfaceHighestPoint = Math.max(...mapState);
  currentHighestPoint = surfaceHighestPoint;

  const mapAfterLoops = [];
  for (let i = 0; i < 7; i++) {
    mapAfterLoops[i] = [];
    mapAfterLoops[i][mapState[i]] = "#";
  }
  count = 0;
  runSimulation(mapAfterLoops, figureIndex + 1, jetIndex + 1, leftCountsToRun);
  drawMap(mapAfterLoops, figure);
  result += currentHighestPoint - surfaceHighestPoint;
}
console.log(result);

function runSimulation(
  map,
  figureIndexToStart,
  jetIndexToStart,
  countToRun,
  detectLoops = false
) {
  //initialize first figure
  let figure = initializeFigure(figures[figureIndexToStart]);
  console.log(figure);
  console.log(count);
  console.log(countToRun);

  while (true) {
    let currentJetPattern = jets[jetIndexToStart];

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
        if (detectLoops) {
          let state = getSurfaceRepresentation(map);
          if (possibleStates[state] === undefined) {
            possibleStates[state] = 1;
          } else {
            possibleStates[state]++;
          }

          //save to state-jet-figure map
          let key = state + "-J" + jetIndexToStart + "-F" + figureIndexToStart;
          if (stateJetFigureMap[key] == undefined) {
            stateJetFigureMap[key] = 1;
          } else {
            //in this case we saw repeating patern
            stateJetFigureMap[key]++;
            if (stateJetFigureMap[key] == 2) {
              //start analysing loop
              if (!loopStartCount) {
                loopStartCount = count;
                loopStartHeight = currentHighestPoint;
                loopStartState = key;
              }
            } else if (stateJetFigureMap[key] == 3) {
              //we did a full loop
              countIncreasePerLoop = count - loopStartCount;
              heightIncreasePerLoop = currentHighestPoint - loopStartHeight;
              break;
            }
          }
        }
      }
      count++;

      if (count == countToRun) {
        console.log("count break", count, countToRun);
        break;
      }
      //init next figure
      figureIndexToStart = (figureIndexToStart + 1) % 5;
      figure = initializeFigure(figures[figureIndexToStart]);
    }

    if (jetIndexToStart < jets.length - 1) {
      jetIndexToStart++;
    } else {
      jetIndexToStart = 0;
    }
  }
}

function getSurfaceRepresentation(map) {
  let lowest = Infinity;
  let state = [];
  for (let i = 0; i < 7; i++) {
    let columnHeight = map[i].length;
    //get highest column in each row
    state.push(columnHeight);
    if (columnHeight < lowest) {
      lowest = columnHeight;
    }
  }
  state = state.map((v) => v - lowest);
  return state.join("-");
}

function getRowPresentation(map, highestPoint) {
  let representation = [];
  for (let i = 0; i < 7; i++) {
    if (map[i][highestPoint] === undefined) {
      representation.push(0);
    } else if (map[i][highestPoint] === "#") {
      representation.push(1);
    }
  }
  return representation.join("");
}

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
