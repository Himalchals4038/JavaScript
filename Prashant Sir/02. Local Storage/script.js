localStorage.setItem("name", "Prashant");
localStorage.setItem("age", 22);
localStorage.setItem(
    "user",
    JSON.stringify(
        {
            college: 'IIT Jammu',
            year: 3,
            SGPA: 9.3,
            CGPA: 8.4
        }
    )
)
console.log(localStorage.getItem("name"));
console.log(localStorage.getItem("age"));
console.log(JSON.parse(localStorage.getItem("user")));

localStorage.removeItem("name");
console.log(localStorage.getItem("name")); //null
localStorage.clear();