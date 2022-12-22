const fs = require("fs");
const { exit } = require("process");
const lines = parseInput("./input.txt");

let monkeys = {};
let MONKEY_TO_REPLACE = "humn";

const mathCalculations = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
};

const positiionalOperators = ["/", "-"];

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

  //special case
  if (currentNode.label == MONKEY_TO_REPLACE) {
    currentNode.setDigit(NaN);
    continue;
  }

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

//find sum of left and right tree

let leftTreeSum = root.getLeftChild().caclulateValue();
let rightTreeSum = root.getRightChild().caclulateValue();

let currentValue = rightTreeSum || leftTreeSum;
let currentNode = isNaN(leftTreeSum)
  ? root.getLeftChild()
  : root.getRightChild();

do {
  if (currentNode.label === MONKEY_TO_REPLACE) {
    break;
  }

  let currentOperator = currentNode.operator;
  //check if operator of the current node positional or not

  let oppositeOperator = getOppositeOperator(currentNode.operator);

  //find not NaN side
  let leftTreeSum = currentNode.getLeftChild().caclulateValue();
  let rightTreeSum = currentNode.getRightChild().caclulateValue();

  //update current value
  currentNode = isNaN(leftTreeSum)
    ? currentNode.getLeftChild()
    : currentNode.getRightChild();

  currentValue = mathCalculations[oppositeOperator](
    currentValue,
    isNaN(leftTreeSum) ? rightTreeSum : leftTreeSum
  );
} while (true);

console.log(currentValue);

function getOppositeOperator(operator) {
  switch (operator) {
    case "+":
      return "-";
    case "-":
      return "+";
    case "*":
      return "/";
    case "/":
      return "*";
  }
}

//build tree
function Node(label) {
  this.label = label;

  this.writeExpression = (log) => {
    let add = isNaN(this.getLeftChild().caclulateValue(log))
      ? this.getLeftChild().writeExpression(log)
      : this.getLeftChild().caclulateValue() + " ";

    log.text += add;

    if (this.operator) {
      log.text += this.operator;
    }
    let addR = isNaN(this.getRightChild().caclulateValue(log))
      ? this.getRightChild().writeExpression(log)
      : this.getRightChild().caclulateValue() + " ";

    log.text += add;

    return log;
  };

  this.mathCalculations = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
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
