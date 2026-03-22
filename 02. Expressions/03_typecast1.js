let num1 = 15;
let bool1 = true;
let float1 = 15.26;
let str1 = "Default";

//Tries to convert to number
console.log(Number(bool1));
console.log(Number(float1));
console.log(Number(str1)); //Doesn't work

//Tries to convert to string
console.log(String(num1));
console.log(String(bool1));
console.log(String(float1));

//Tries to convert to boolean
console.log(Boolean(num1));
console.log(Boolean(float1));
console.log(Boolean(str1));

//Tries to convert string to integer
console.log(parseInt("47.63"));
console.log(parseInt("-47.63"));

//Tries to convert string to float
console.log(parseFloat("47.63"));
console.log(parseFloat("-47.63"));


