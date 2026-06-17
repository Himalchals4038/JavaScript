const URL = "https://catfact.ninja/facts";
const catFact = document.querySelector("#fact-cat-para");
let getFactBtn = document.querySelector("#get-cat-fact");

// const getFacts = async () => {
//     catFact.innerText = "Fetching data...";
//     console.log("Fetching data...")
//     let response = await fetch(URL);
//     let data = await response.json();
//     catFact.innerText = data.data[0].fact;
// }
// function getFacts(){
//     catFact.innerText = "Fetching data...";
//     console.log("Fetching data...")
//     fetch(URL)
//     .then(response => response.json())
//     .then(data => catFact.innerText = data.data[0].fact);
// }

function getFacts(){
    catFact.innerText = "Fetching data...";
    console.log("Fetching data...")
    fetch(URL).then((response) => {
        return response.json();
    })
    .then((data) => {
        catFact.innerText = data.data[0].fact;
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
        catFact.innerText = "Failed to fetch cat fact. Please try again later.";
    });
}

if (getFactBtn){
    getFactBtn.addEventListener("click", getFacts);
}
else{
    console.error("Button #get-cat-fact not found in the DOM.");
}