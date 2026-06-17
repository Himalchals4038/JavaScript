const BASE_URL = "https://api.frankfurter.dev";
function convert(base, quote, amount){
    const api = "https://api.frankfurter.dev";
    return fetch(`${api}/v2/rate/${base}/${quote}`)
        .then((r) => r.json())
        .then((d) => (amount * d.rate).toFixed(2));
}

// convert("EUR", "USD", 10).then((result) =>{
//     console.log(`10 EUR = ${result} USD`)
// });

// import countryList from "./codes.js";
// for (let code in countryList){
//     console.log(code, countryList[code]);
// }

import countryList from "./codes.js";
const dropSelect = document.querySelectorAll(".dropdown select");
for (let select of dropSelect){
    for (let currCode in countryList){
        let newOption = document.createElement("option");
        newOption.value = currCode;
        newOption.innerText = currCode;
        if (select.name === "from" && currCode === "USD") newOption.selected = "selected";
        if (select.name === "to" && currCode === "INR") newOption.selected = "selected";
        select.append(newOption);
    }
    select.addEventListener("change", (event) => {
        updateFlag(event.target);
    })
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
    element.parentElement.querySelector("img").src = newSrc;  
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input").value;
    if (amount === "" || isNaN(amount) || amount <= 0) amount = 1;
    let from = document.querySelector(".from select").value;
    let to = document.querySelector(".to select").value;
    convert(from, to, amount).then((result) => {
        document.querySelector(".msg").innerText = `${amount} ${from} = ${result} ${to}`;
    });
};

let btn = document.querySelector(".convert-btn");
btn.addEventListener("click", (event) => {
    event.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});