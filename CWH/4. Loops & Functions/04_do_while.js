const prompt = require("prompt-sync")();
let limit = Number.parseInt(prompt("Enter final number: "));
let sum = 0, i = 0;
do{
    if (i%3 === 0) sum+=i;
    i++;
}
while(i < limit)
console.log(`Sum of multiples of 3 from 0 to ${limit} is: ` + sum);
