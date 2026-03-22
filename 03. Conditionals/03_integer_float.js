const prompt = require("prompt-sync")();
function getNumberType(num){
    if (Number.isNaN(num)) return "Not a valid number";
    else if (Number.isInteger(num)) return "Integer";
    else return "Floating point";
}

let input = prompt("Enter a number: ");
let parsedInput = Number.parseFloat(input);
console.log(`The number ${parsedInput} is of ${getNumberType(parsedInput)} type`);
