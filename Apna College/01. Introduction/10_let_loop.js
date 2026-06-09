const user1 = {
    name: "Krishna Mehta",
    department: "Electronics",
    CGPA: 9.2,
    isHosteller: true,
    address: {
        city: "Kolkata",
        state: "West Bengal",
        country: "India"
    }
}
for (let a in user1){
    console.log(a, ":", user1[a]);
}

let guest = "Tarak Sharma";
for (let a of guest){
    console.log(a);
}