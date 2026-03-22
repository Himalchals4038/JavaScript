let a = 15, b = 36;
console.log('Sum of a + b is', a+b);
//f strings require special brackets ` ` 
console.log(`Sum of ${a} + ${b} is`, a+b);

//String concatenation possible with + sign
let str1 = "Vinay", str2 = "Raut";
console.log("Full name is", str1+" "+str2);

const lib  = {
    name : "Nayan",
    class : 7,
    section : "G",
    rollNo : 49,
    friends : {
        one : "Shruti",
        two : "Payal",
        three : "Shresth",
        four : "Sneha"
    }
}
console.log(lib["section"]);

//object inside object can be called in both ways
console.log(lib["friends"]["four"]);
console.log(lib.friends.one);

//additional keys can be added to constant objects even after declaration
lib["Address"] = "Sonepat";
console.log(lib.Address);

//values can be altered in constant objects even after declaration
lib["name"] = "Shalini";
lib["Address"] = "Kurukshetra";
console.log(lib);
