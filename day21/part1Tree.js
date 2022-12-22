const fs = require("fs");
const { exit } = require("process");
const lines = parseInput("./input.txt");

let monkeys = {};

// let parts = test.split(/([-+*\/])/g);

for (line of lines) {
  [monkeyName, operation] = line.split(":").map((v) => v.trim());
  monkeys[monkeyName] = operation;
}

let root = new Node("root");
//building tree where leaves are digits
let toDecode = [root];
do {
  let currentNode = toDecode.pop();
  let op = monkeys[currentNode.label];
  //single digit
  if (parseInt(op)) {
    currentNode.setDigit(parseInt(op));
  } else {
    //check what parts expression consists of
    let parts = op.split(/([-+*\/])/g).map((v) => v.trim());
    currentNode.setOperator(parts[1]);
    let leftChild = new Node(parts[0]);
    let rightChild = new Node(parts[2]);
    currentNode.setLeftChild(leftChild);
    currentNode.setRightChild(rightChild);

    toDecode.push(leftChild, rightChild);
  }
} while (toDecode.length);

//find sum
console.log(root.caclulateValue());

//build tree
function Node(label) {
  this.label = label;

  this.mathCalculations = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
  };

  this.writeExpression = (log) => {
    if (this.operator === undefined) {
      log.text += this.digit + " ";
    } else {
      this.getLeftChild().writeExpression(log);
      log.text += this.operator + " ";
      this.getRightChild().writeExpression(log);
    }
    return log;
  };

  this.caclulateValue = () => {
    if (this.operator === undefined) {
      return this.digit;
    } else {
      return this.mathCalculations[this.operator](
        this.getLeftChild().caclulateValue(),
        this.getRightChild().caclulateValue()
      );
    }
  };

  this.setOperator = (operator) => {
    this.operator = operator;
  };

  this.setDigit = (val) => {
    this.digit = val;
    this.leaf = true;
  };

  this.getLeftChild = () => {
    return this.left;
  };

  this.getRightChild = () => {
    return this.right;
  };

  this.setLeftChild = (Node) => {
    this.left = Node;
  };
  this.setRightChild = (Node) => {
    this.right = Node;
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
