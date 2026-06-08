const person1 = {
    name: "Trishna Chakraborty",
    age: 23,
    isMarried: false,
    family: {
        father: "Manas Chakraborty",
        mother: "Meghna Chakraborty",
        brother: "Pranay Chakraborty",
    },
    company: "Texas Instruments",
    salary: 175000,
    address: {
        city: "Siliguri",
        state: "West Bengal",
        country: "India"
    }
};
console.log(person1);
console.log(typeof person1);

// console.log(person1.name);
console.log(person1["name"]);
console.log(person1.age);
console.log(person1.isMarried);

console.log(person1.family.father);
console.log(person1.family.mother);
console.log(person1.family.brother);

console.log(person1.company);
console.log(person1.salary);

console.log(person1.address.city);
console.log(person1.address.state);
console.log(person1.address.country);