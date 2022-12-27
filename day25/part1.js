const fs = require("fs");
const lines = parseInput("./input.txt");

let sum = 0;

for (line of lines) {
  sum += transformToDemical(line);
}

console.log(sum);
console.log(transformFromDecimal(sum));
return;

function transformToDemical(value) {
  let number = 0;
  //example 1=-1= - 625 - 2 * 125 - 1 * 25 + 5 - 2 =
  for (let i = value.length - 1; i >= 0; i--) {
    let powerOf5 = value.length - 1 - i;
    switch (value[i]) {
      case "-":
        number += -1 * Math.pow(5, powerOf5);
        break;
      case "=":
        number += -2 * Math.pow(5, powerOf5);
        break;
      default:
        number += parseInt(value[i]) * Math.pow(5, powerOf5);
    }
  }
  return number;
}

// exaample 137
function transformFromDecimal(number) {
  let result = "";

  //find highest power of 5 we will need to use
  let currentPower = 0;
  while (maxNumberRepresentedByXPowers(currentPower) < number) {
    currentPower++;
  }

  let currentSymbol;
  let remainder = number;
  let currentVal;

  //highest power is a special case
  currentSymbol = 1;
  remainder = remainder - Math.pow(5, currentPower);
  if (remainder > maxNumberRepresentedByXPowers(currentPower - 1)) {
    currentSymbol++;
    remainder -= Math.pow(5, currentPower);
  }
  result += currentSymbol;
  currentPower--;

  do {
    console.log("processing ", Math.pow(5, currentPower), remainder);
    if (
      Math.abs(remainder) <= maxNumberRepresentedByXPowers(currentPower - 1)
    ) {
      //check if remainder is positive or negative
      //we can skip this position
      currentSymbol = "0";
    } else {
      //what value current power contributes to the number
      currentVal = 1;
      if (
        Math.abs(Math.abs(remainder) - Math.pow(5, currentPower)) >
          maxNumberRepresentedByXPowers(currentPower - 1) &&
        currentVal < 2
      ) {
        currentVal++;
      }
      currentSymbol =
        remainder > 0 ? currentVal.toString() : currentVal === 1 ? "-" : "=";
      remainder =
        remainder -
        Math.pow(5, currentPower) * transformToDemical(currentSymbol);
    }
    result += currentSymbol.toString();
    currentPower--;
  } while (currentPower >= 0);
  return result;
}

function symbolToNumber() {}

// in SNAFU system, what is the maximum number we can get if we use X symbols
// for example, if we provide 3, we are going to use 3 symbols _ _ _, max value we can provide in
// SNAFU is 2 2 2 which translates to 25 * 2 + 5 * 2 + 2 = 50 + 10 +2 = 62
function maxNumberRepresentedByXPowers(x) {
  let number = 0;
  for (let i = x; i >= 0; i--) {
    number += Math.pow(5, i) * 2;
  }
  return number;
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
