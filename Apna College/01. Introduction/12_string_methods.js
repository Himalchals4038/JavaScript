let name = "Surinder Jaiswal";
console.log(name);
console.log(typeof name);

//Converts all characters to uppercase
let name2 = name.toUpperCase();
console.log(name2);
// console.log(typeof name2);

//Converts all characters to lowercase
let name3 = name.toLowerCase();
console.log(name3);
// console.log(typeof name3);

//Returns the character at the specified index
let name4 = name.charAt(0);
console.log(name4);
// console.log(typeof name4);

//Returns the index of the first occurrence of the specified value
let name5 = name.indexOf("J");
console.log(name5);
// console.log(typeof name5);

//Returns the index of the last occurrence of the specified value
let name6 = name.lastIndexOf("a");
console.log(name6);
// console.log(typeof name6);

//Returns a section of a string
let name7 = name.slice(0, 5);
console.log(name7);
// console.log(typeof name7);

//Returns a section of a string
let name8 = name.substr(0, 5);
console.log(name8);
// console.log(typeof name8);

//Returns an array of substrings
let name9 = name.split(" ");
console.log(name9);
// console.log(typeof name9);

//Replaces a part of a string
let name10 = name.replace("Surinder", "Rohit");
console.log(name10);
// console.log(typeof name10);

//Removes leading and trailing spaces
name = "   Surinder Jaiswal   ";
let name11 = name.trim();
console.log(name11);
// console.log(typeof name11);

//Returns true if the string contains the specified value
name = "Surinder Jaiswal";
let name12 = name.includes("Surinder");
console.log(name12);
// console.log(typeof name12);

//Returns a string repeated a specified number of times
let name13 = name.repeat(3);
console.log(name13);
// console.log(typeof name13);

//Concatenates two or more strings
let name14 = name.concat(" is a businessman");
console.log(name14);
// console.log(typeof name14);

//Replaces all occurrences of a specified value
let name15 = "Samaresh Maity";
let name16 = name15.replaceAll("a", "i");
console.log(name16);
// console.log(typeof name16);

let name17 = "Tanmay Sahoo";
name17 = name17.replace(" ", "");
name17 = name17.toLowerCase();
console.log(`@${name17}${name17.length}`);