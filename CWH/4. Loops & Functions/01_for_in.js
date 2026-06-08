let obj = {
    name: "Vinod",
    age: 37,
    city: "Chennai",
    country: "India",
}
for (let a in obj){
    console.log(a, ":", obj[a]);
}

let marks = {
    sunil: 15,
    mayank: 23,
    dinesh: 18,
    vinod: 22,
    shivam: 19,
    anil: 24,
    raj: 17,
    shiv: 20,
    ravi: 16,
    vijay: 21,
}
for (let a in marks){
    console.log(`Marks of ${a} is ${marks[a]}`);
}


