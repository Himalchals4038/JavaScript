let arr1 = [35, 48, 72, 10, 61, 33, 46];

let arr2 = arr1.filter((element) => {
    return element % 2 == 0;
});
console.log(`Even numbers in the array are:`,...arr2);

let arr3 = arr1.filter((element) => {
    return element % 2 != 0;
});
console.log(`Odd numbers in the array are:`,...arr3);