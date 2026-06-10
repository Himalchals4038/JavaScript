let arr1 = [27, 43, 61, 80, 95, 21];

// let arr2 = arr1.reduce((accumulator, currentValue) => {
    //     return accumulator + currentValue;
    // }, initial);
    
let initial = 0;
// let sum = arr1.reduce((accumulator, currentValue) => accumulator+currentValue, initial);
let sum = arr1.reduce((accumulator, currentValue) => {
    return accumulator+currentValue;
})
console.log(sum);

initial = 1;
// let mul = arr1.reduce((accumulator, currentValue) => accumulator*currentValue, initial);
let mul = arr1.reduce((accumulator, currentValue) => {
    return accumulator*currentValue;
})
console.log(mul);

let arr2 = [46, 95, 76, 28, 34, 50, 91];
let max = arr2.reduce((prev, curr)=>{
    // return prev > cur ? prev : cur;
    return Math.max(prev, curr);
})
let min = arr2.reduce((prev, curr)=>{
    // return prev < cur ? prev : cur;
    return Math.min(prev, curr);
})
console.log(max);
console.log(min);