//Objects
const worker = {
    name: "Alisha Raman",
    age: 22,
    company: "Google",
    salary: 175000,
    address: {
        city: "Dehradun",
        state: "Himachal Pradesh",
        country: "India",
    },
    printSalary(){
        console.log(`Salary of ${this.name} is ${this.salary}`);
    }
}
worker.printSalary();


//Proto constructor
const employee = {
    calcTax(){
        console.log("Tax Rate is 10%");
    },
}
const employee1 = {
    salary: 65000,
    calcTax(){
        console.log("Tax Rate is 5%");
    },
}
const employee2 = {
    salary: 97000,
}
const employee3 = {
    salary: 36251,
    calcTax(){
        console.log("Tax Rate is 15%");
    },
}
const employee4 = {
    salary: 48657,
}
const employee5 = {
    salary: 125004,
}
employee1.__proto__ = employee;
employee2.__proto__ = employee;
employee3.__proto__ = employee;
employee4.__proto__ = employee;
employee5.__proto__ = employee;

//Class & Constructor
class carDetails{
    constructor(make, model, year){
        this.make = make;
        this.model = model;
        this.year = year;
    }
    start(){
        console.log("Started");
    }
    stop(){
        console.log("Stopped");
    }
    viewData(){
        console.log(`Make: ${this.make}, Model: ${this.model}, Year: ${this.year}`);
    }
}
const audi = new carDetails("Audi", "A4", 2019);
// console.log(audi);
audi.start();
audi.stop();
audi.viewData();

class electricCar extends carDetails{
    constructor(make, model, year){
        super(make, model, year);
    }
    charge(){
        console.log("Charging Inititated");
        console.log("Charging Completed");
    }
    start(){
        super.start();
        this.charge();
    }
    stop(){
        super.stop();
    }
    viewData(){
        super.viewData();
    }
}
const tesla = new electricCar("Tesla", "Model S", 2020);
// console.log(tesla);
tesla.start();
tesla.stop();
tesla.viewData();

//Error Handling
let getInput = typeof window !== "undefined" 
    ? (msg) => window.prompt(msg) 
    : require("prompt-sync")();
let num1 = 28, num2 = 162, num4 = 10;
let num3 = Number.parseInt(getInput("Enter number: "));
try{
    if (isNaN(num3)) throw new Error("The input provided is not a valid number.");
    console.log(num1/num2);
    console.log(num2/num3);
    console.log(num3/num1);
    console.log(num3/num4);
} catch(err){
    console.error("Error caught:", err.message);
}