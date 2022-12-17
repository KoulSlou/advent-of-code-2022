const fs = require("fs");
const { exit } = require("process");
const lines = parseInput("./example.txt");
let nodeMap = [];
let current_node = null;
let openNodes = [];
let nodeCount = 0;
let max_rate = 0;
let openDuringAlgo = [];

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

visitNode("AA", 1, false, 0, 0, openNodes, "", [], null);

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
  note += `moved to ${label}, rate is ${releasingRate}, minutes ${stepsLeft}, want to open ${openNode}, prev label ${prevLabel}\n`;

  if (prevLabel && prevLabel == label) {
    console.log("indetical lables");
    process.exit();
  }

  if (openNodes.length == nodeCount) {
    //all nodes are open
    released += releasingRate * (30 - stepsLeft);
    if (released > max) {
      console.log("max reached all open", released, openDuringAlgo, stepsLeft);
      max = released;
    }
    return;
  }

  if (stepsLeft > 30) {
    if (released > max) {
      max = released;
      console.log(
        "max reached max steps",
        released,
        releasingRate,
        openDuringAlgo,
        note
      );
    }
    return;
  }

  if (max > released + (30 - stepsLeft) * max_rate) {
    return;
  }

  if (openNode && openNodes.indexOf(label) < 0) {
    stepsLeft += 1;
    note += `open ${label} on minute ${stepsLeft}\n`;
    released += releasingRate;
    releasingRate += nodeMap[label].rate;
    openDuringAlgo.push(label);
    openNodes.push(label);
  }

  if (stepsLeft > 30) {
    if (released > max) {
      max = released;
    }
    return;
  }
  //check what paths are available
  paths = nodeMap[label].leadsToText;

  //   console.log("current label and paths", current_node, paths);
  for (let path of paths) {
    //path wasn't opened yet
    if (openNodes.indexOf(path) < 0) {
      visitNode(
        path,
        stepsLeft + 1,
        true,
        released + releasingRate,
        releasingRate,
        [...openNodes],
        note,
        [...openDuringAlgo],
        label
      );
    }
    visitNode(
      path,
      stepsLeft + 1,
      false,
      released + releasingRate,
      releasingRate,
      [...openNodes],
      note,
      [...openDuringAlgo],
      label
    );
  }
}

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
