//Timeout function
console.log("One");
console.log("Two");
function greet(name) {
    console.log("Hello " + name);
}
setTimeout(greet, 2000, "Samar"); //Timeour 2000ms
setTimeout(() => {
    console.log("Good Morning User!");
}, 3000);
console.log("Three");
console.log("Four");

//Callback function
function sum(a, b){
    console.log(a + b);
}
function calculator(a, b, sumCallback){
    sumCallback(a, b);
}
calculator(10, 20, sum);
// calculator(10, 20, (a, b) => {
//     console.log(a + b)
// });