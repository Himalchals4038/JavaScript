let arr1 = [1,2,3,4,5];
console.log(`arr1 = ${arr1}`);
console.log(`typeof arr1 = ${typeof arr1}`);
console.log(`arr1[2] = ${arr1[2]}`);
console.log(`arr1.length = ${arr1.length}`);

let arr2 = [];
console.log(`arr2 = ${arr2}`);
console.log(`arr2.length = ${arr2.length}`);
// console.log(`typeof arr2 = ${typeof arr2}`);
arr2[0] = 1;
arr2[1] = 2;
arr2[2] = 3;
arr2[3] = 4;
arr2[4] = 5;
console.log(`arr2 = ${arr2}`);
console.log(`arr2.length = ${arr2.length}`);

//Dynamic Array
let arr3 = new Array();
console.log(`arr3 = ${arr3}`);
// console.log(typeof arr3);
arr3[0] = 1;
arr3[1] = 2;
arr3[2] = 3;
arr3[3] = 4;
arr3[4] = 5;
console.log(`arr3 = ${arr3}`);

let arr4 = new Array(1,2,3,4,5);
console.log(`arr4 = ${arr4}`);
console.log(`arr4.length = ${arr4.length}`);

let arr5 = new Array(7);
console.log(`arr5 = ${arr5}`);
console.log(`arr5.length = ${arr5.length}`);

//Dynamic Array with specific size and initialized to 0
let arr6 = new Array(5).fill(0);
console.log(`arr6 = [${arr6}]`);
console.log(`arr6.length = ${arr6.length}`);

// Creates an array of size 5 and fills it with 0
let arr7 = Array.from({length: 5}, ()=>0); 
console.log(`arr7 = [${arr7}]`);
console.log(`arr7.length = ${arr7.length}`);