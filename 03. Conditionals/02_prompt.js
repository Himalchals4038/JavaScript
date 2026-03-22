const prompt = require("prompt-sync")();
let a  = prompt("Enter value of a: ");
console.log(typeof a);
a = Number.parseInt(a);
console.log(a);
console.log(typeof a);

let b = prompt("Enter value of b: ");
console.log(typeof b);
b = Number.parseFloat(b);
console.log(b);
console.log(typeof b);

