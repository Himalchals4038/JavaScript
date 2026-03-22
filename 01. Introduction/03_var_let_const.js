var a = 15;
var b = "Minus";
var c = true;
var d = null;
var e = undefined;

//var acts as a global variable value changer
{
    var a = 26;
    console.log(a);
}
console.log(a);

//let acts as a local variable value changer
{
    let b = "Plus";
    console.log(b);
}
console.log(b);

//let can't be re-declared
// let f = 78;
// let f = 99;

//Const values don't change once declared
const name = "Admin";
console.log(name);
// name = "Michael";
// console.log(name);
