// let btn1 = document.getElementById("btn1");
// btn1.addEventListener("click", () => {
//  console.log("You Clicked Me");
//  alert("Hello There");
// });

let btn1 = document.querySelector("#btn1");
btn1.onclick = () => {
    console.log("You Clicked Me");
};

// let btn2 = document.getElementById("btn2");
// btn2.addEventListener("dblclick", () => {
//     console.log("You Clicked Me 2 Times");
// });

let btn2 = document.querySelector("#btn2");
btn2.ondblclick = () => {
    console.log("You Clicked Me 2 Times");
};

let boxContent = document.querySelector(".box-content");
// boxContent.addEventListener("mouseover", () => {
//     boxContent.style.backgroundColor = "lightgreen";
// });
// boxContent.addEventListener("mouseout", () => {
//     boxContent.style.backgroundColor = "lightgray";
// });
boxContent.onmouseover = () => {
    boxContent.style.backgroundColor = "lightgreen";
};
boxContent.onmouseout = () => {
    boxContent.style.backgroundColor = "lightgray";
};

let event1 = document.querySelector(".event-object");
event1.onclick = (e) => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.id);
    console.log(e.type);
    console.log(e.clientX, e.clientY);
};

let btn4 = document.querySelector("#btn4");
let isBtn4Toggled = false;
const btn4ClickHandler = () => {
    let targetElement = document.querySelector(".event-listener");
    if (!isBtn4Toggled){
        targetElement.style.backgroundColor = "chartreuse";
        targetElement.style.color = "darkgreen";
    }
    else{
        targetElement.style.backgroundColor = ""; // Resets back to default stylesheet color
        targetElement.style.color = ""; // Resets back to default stylesheet color
    }
    isBtn4Toggled = !isBtn4Toggled; // Flips the boolean state for the next click
};
btn4.addEventListener("click", btn4ClickHandler);

const hover4Handler = () => {
    let targetElement = document.querySelector(".event-listener");
    targetElement.style.backgroundColor = "violet";
    targetElement.style.color = "lightblue";
};
const unHover4Handler = () => {
    let targetElement = document.querySelector(".event-listener");
    targetElement.style.backgroundColor = "";
    targetElement.style.color = "";
}
btn4.addEventListener("mouseover", hover4Handler);
btn4.addEventListener("mouseout", unHover4Handler);
// btn4.removeEventListener("mouseout", unHover4Handler);

const modeChanger = document.querySelector("#view-mode");
modeChanger.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});