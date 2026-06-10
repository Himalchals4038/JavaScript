let arr1 = [27, 43, 61, 80, 95, 21, 14, 18, 17, 9, 22, 27];

let arr2 = arr1.filter((element) => {
    return element%2 == 0;
});
console.log(...arr2);