//Standard syntax
function sum1 (a, b){
    return a+b;
}
let a = 14, b = 76;
console.log(`Sum of ${a} and ${b} is ${sum1(a,b)}`);

//Arrow syntax
const sum2 = (a, b) => {
    return a+b;
}
let c = 82, d = 64;
console.log(`Sum of ${c} and ${d} is ${sum2(c,d)}`);

const explain = () => console.log("This is a function");
explain();