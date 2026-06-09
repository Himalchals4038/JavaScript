let name = "Nitin Malhotra";
let len1 = 0;
for (let a of name){
    len1++;
}
console.log(len1);

let len = name.length;
console.log(len);

let num = 152649837;
let len2 = (String(num)).length;
console.log(len2);

//Escape sequences have 1 length despite containing multiple characters
let work = "Software\nDeveloper";
let len3 = work.length;
console.log(len3);