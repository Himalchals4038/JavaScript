let arr = [25, 48, 67, 49, 11];
console.log(...arr);
//Array slicing -> Doesn't modify current array
console.log(arr.slice(1, 4));

console.log(...arr);
//Array splicing -> Removes elements from current array
console.log(arr.splice(1, 3, 99, 98, 97, 96, 95));
console.log(...arr);
console.log(arr.splice(2, 0 ,108));
console.log(...arr);
