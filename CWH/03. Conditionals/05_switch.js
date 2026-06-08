const prompt = require("prompt-sync")();
let keepRunning = true;

while (keepRunning){
    let choice = prompt("Enter a fruit (apple, banana, orange, watermelon, durian) or 'exit' to quit: ");
    switch (choice.toLowerCase()){
        case "apple":
            console.log("Apples are ₹200/kg");
            break;
        case "banana":
            console.log("Bananas are ₹50/dozen");
            break;
        case "orange":
            console.log("Oranges are ₹85/dozen");
            break;
        case "watermelon":
            console.log("Watermelons are ₹300/kg");
            break;
        case "durian":
            console.log("Durians are for ₹250/piece");
            break;
        case "exit":
            console.log("Exiting store. Goodbye!");
            keepRunning = false;
            break;
        default:
            console.log("We are out of " + choice);
    }
}
