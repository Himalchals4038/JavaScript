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
    // printSalary: function(){
    //     console.log(`Salary of ${this.name} is ${this.salary}`);
    // }
    printSalary(){
        console.log(`Salary of ${this.name} is ${this.salary}`);
    }
}
worker.printSalary();