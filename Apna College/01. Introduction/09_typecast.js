let a = 15;
let b = "14";
console.log(`a+b = ${a+b}`); //Concatenation
console.log(typeof (a+b));
console.log(`a-b = ${a-b}`); //Subtraction

let c = Number.parseInt(b);
console.log(`a+c = ${a+c}`); //Addition
console.log(typeof c);

let z = "25.46";
console.log(`z+a = ${z+a}`); //Concatenation
console.log(`z+b = ${z+b}`); //Concatenation
console.log(typeof z);

let d = Number.parseFloat(z);
console.log(`a+d = ${a+d}`); //Addition
console.log(typeof d);

let x = 75;
console.log(`x+a = ${x+a}`); //Addition
console.log(`x+b = ${x+b}`); //Concatenation
console.log(`x+z = ${x+z}`); //Concatenation

let y = String(x);
console.log(y);
console.log(typeof y);

let e = Boolean(x);
console.log(e);
console.log(typeof e);

let f = Boolean(b);
console.log(f);
console.log(typeof f);