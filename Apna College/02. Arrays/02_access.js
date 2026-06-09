let arr = [25, 14, 75, 84, 96, 35, 26, 18, 94, 65];

// Method 1: Using a loop and String Concatenation
let outputString = "";
for (let a of arr) {
  outputString += a + " "; // Add the item and a space
}
console.log("String Concatenation: ", outputString);

// Method 2: Spread Operator (Modern & Easiest)
console.log("Spread Operator: ", ...arr);

// Method 3: Using .join() (Great for custom separators)
console.log("Using Join: ", arr.join(" | "));

// Method 4: Node.js standard output (prints inline during the loop)
process.stdout.write("Node.js stdout: ");
for (let a of arr) process.stdout.write(a + " ");

console.log("\n");
let prices = [150, 270, 910, 600, 350, 740, 480, 300];
// for (let val of prices){
//     console.log(`Original Price: ${val}`);
//     console.log(`Discounted Price: ${val*0.9}`);
// }
for (let i=0; i<prices.length; i++){
    let n = i+1;
    let suffix = "th";
    if (n%100 >= 11 && n%100 <= 13) suffix = "th";
    else if (n%10 === 1) suffix = "st";
    else if (n%10 === 2) suffix = "nd";
    else if (n%10 === 3) suffix = "rd";
    console.log(`Original Price of ${n}${suffix} item: ${prices[i]}`);
    console.log(`Discounted Price of ${n}${suffix} item: ${prices[i]*0.9}`);
}
