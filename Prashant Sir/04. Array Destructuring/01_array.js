let arr1 = [35, 16, 48, 27, 59, 12];
console.log(...arr1);

let [a, b, c, d] = arr1;
console.log(a, b, c, d);

let [x, y, ...rest] = arr1;
console.log(x, y, rest);

let obj1 = { name: "Alice", age: 25, city: "New York" };
console.log({ ...obj1 });

let { name, age } = obj1;
console.log(name, age);

let { city, ...restObj } = obj1;
console.log(city, restObj);

let arr2 = [1, 2, 3];
let arr3 = [4, 5, 6];
let arr4 = [...arr2, ...arr3];
console.log(arr4);

let obj2 = { name: "Alice", age: 25 };
let obj3 = { city: "New York" };
let obj4 = { ...obj2, ...obj3 };
console.log(obj4);

let arr5 = [1, 2, 3];
let obj5 = { name: "Alice", age: 25 };
let arr6 = [...arr5, obj5];
console.log(arr6);

let obj6 = { name: "Alice", age: 25 };
let arr7 = [1, 2, 3, obj6];
console.log(arr7);