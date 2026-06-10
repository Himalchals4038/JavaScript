let arr = [25, 48, 67, 49, 91];

//Inserts an element at the end
arr.push(50, 22, 41);
console.log(...arr);

//Removes the last element
arr.pop();
console.log(...arr);

//Inserts an element at the beginning
arr.unshift(67, 38);
console.log(...arr);

//Removes the first element
arr.shift();
console.log(...arr);

//Reverses the array
arr.reverse();
console.log(...arr);

//Sorts the array
arr.sort();
console.log(...arr);

//Joins the array
let greet = ['Thank', 'you', 'for', 'visiting', 'our', 'website.'];
console.log(greet.join(' '));

console.log(arr.toString());
let arr2 = [99, 98, 97, 96, 95];
let arr3 = [101, 102, 103, 104, 105];
console.log(arr.concat(arr2, arr3));