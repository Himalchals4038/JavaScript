const prompt = require("prompt-sync")();
let limit = Number.parseInt(prompt("Enter final number: "));
let sum = 0, i = 0;
while(i < limit){
    if (i%3 === 0) sum+=i;
    i++;
}
console.log(`Sum of multiples of 3 from 0 to ${limit} is: ` + sum);
