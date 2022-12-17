const fs = require("fs");
const { exit } = require("process");
const lines = parseInput("./input.txt");

const TOTAL_MINUTES = 30;

let nodeMap = [];
let current_node = null;
let openNodes = [];
let nodeCount = 0;
let max_rate = 0;
let openDuringAlgo = [];
let cnt = 0;

var startTime = performance.now();
for (line of lines) {
  nodeCount++;
  let matches = line.match(
    /Valve ([A-Z]{2}) has flow rate=([0-9]+); tunnels? leads? to valves? (.*)/
  );
  current_node = new Node(
    matches[1],
    matches[3].split(",").map((v) => v.trim()),
    parseInt(matches[2])
  );
  nodeMap[matches[1]] = current_node;
  if (parseInt(matches[2]) == 0) {
    openNodes.push(matches[1]);
  }
  max_rate += parseInt(matches[2]);
}

let max = 0;

visitNode("AA", 0, false, 0, 0, openNodes, "", [], []);

function visitNode(
  label,
  stepsLeft,
  openNode,
  released,
  releasingRate,
  openNodes,
  note,
  openDuringAlgo,
  prevLabel
) {
  stepsLeft = stepsLeft + 1;
  //here we sill tick clock
  note += `moved to ${label}, rate is ${releasingRate}, minutes ${stepsLeft}, want to open ${openNode}, prev label ${prevLabel}\n`;

  if (openNodes.length == nodeCount) {
    //all nodes are open
    released += releasingRate * (TOTAL_MINUTES - stepsLeft);
    if (released > max) {
      console.log("max reached all open", released, openDuringAlgo, stepsLeft);
      max = released;
    }
    return;
  }

  if (stepsLeft > TOTAL_MINUTES) {
    if (released > max) {
      max = released;
    }
    return;
  }

  if (max > released + (TOTAL_MINUTES - stepsLeft + 1) * max_rate) {
    return;
  }

  if (openNode && openNodes.indexOf(label) < 0) {
    stepsLeft = stepsLeft + 1;
    note += `open ${label} on minute ${stepsLeft}\n`;
    released += releasingRate;
    releasingRate += nodeMap[label].rate;
    openDuringAlgo.push(label);
    openNodes.push(label);
  }

  if (stepsLeft > TOTAL_MINUTES) {
    if (released > max) {
      max = released;
    }
    return;
  }
  //check what paths are available
  paths = nodeMap[label].leadsToText;

  for (let path of paths) {
    //if we didn't open current node and about to jump to the node that just visited - we waisted a step,
    //no need to continue this route
    if (!openNode && path == prevLabel[prevLabel.length - 1]) {
      //   console.log(
      //     `waisted step, current ${label}, next ${path}, visited ${prevLabel}`
      //   );
      cnt++;
      //   console.log(cnt);
      continue;
    }

    //path wasn't opened yet
    if (openNodes.indexOf(path) < 0) {
      visitNode(
        path,
        stepsLeft,
        true,
        released + releasingRate,
        releasingRate,
        [...openNodes],
        note,
        [...openDuringAlgo],
        [...prevLabel, label]
      );
    }
    visitNode(
      path,
      stepsLeft,
      false,
      released + releasingRate,
      releasingRate,
      [...openNodes],
      note,
      [...openDuringAlgo],
      [...prevLabel, label]
    );
  }
}
var endTime = performance.now();

console.log(`Time: ${(endTime - startTime) / 1000} seconds`);
console.log(max);

function Node(label, leadsTo, rate) {
  this.label = label;
  this.leadsToText = leadsTo;
  this.rate = rate;
  this.leadsToLinks = [];
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
