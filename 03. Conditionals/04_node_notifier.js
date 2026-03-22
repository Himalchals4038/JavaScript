const prompt = require("prompt-sync")();
const notifier = require("node-notifier");

let age = prompt("What is your age? ");
age = Number.parseInt(age);
if (age<=0) notifier.notify("Invalid age!");
else if (age>=18) notifier.notify("You can drive!");
else notifier.notify("Sorry, you are not old enough to drive.");


