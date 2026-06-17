const URL = "https://catfact.ninja/facts";
const getFacts = async () => {
    let catFact = document.querySelector("#fact-cat-para");
    if (!catFact){
        console.error("Element #fact-cat not found in the DOM.");
        return;
    }
    try{
        catFact.innerText = "Fetching data...";
        console.log("Fetching data...");
        let response = await fetch(URL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        let data = await response.json();
        catFact.innerText = data.data[0].fact;
        console.log("Data fetched successfully.");
    }
    catch (error){
        console.error("Error fetching data:", error);
        catFact.innerText = "Failed to fetch cat fact. Please try again later.";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    let getFactBtn = document.querySelector("#get-cat-fact");
    if (getFactBtn) getFactBtn.addEventListener("click", getFacts);
    else console.error("Button #get-cat-fact not found in the DOM.");
});