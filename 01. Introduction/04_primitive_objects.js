//nn bb ss u
let a = null;
let b = 784;
let c = true;
let d = BigInt("15762") + BigInt("62357");
let e = "Cosine";
let f = Symbol("This is a symbol");
let g;

console.log(a, b, c, d, e, f, g);

//typeof displays the type of data stored in the variable
console.log(typeof a, typeof b, typeof c, typeof d, typeof e, typeof f, typeof g);

//works like an unordered map
const item = {
    "One": true,
    "Two": false,
    "Three": 38,
    "Four": undefined
}
console.log(typeof item);

//alternate ways of fetching value associated with the key
console.log(item.One);
console.log(item["One"]);

console.log(item.Two);
console.log(item.Three);
console.log(item.Four);

//will return undefined for a key not previously declared
console.log(item.Five);