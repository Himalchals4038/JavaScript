let div = document.querySelector("div");
console.log(div);
// console.dir(div);

let id = div.getAttribute("id");
console.log(id);
// console.dir(id);

let name = div.getAttribute("name");
console.log(name);
// console.dir(name);

let para = document.querySelector("p");
console.log(para);
// console.dir(para);

console.log(para.getAttribute("class"));
console.log(para.setAttribute("class", "newClass"));
console.log(para.getAttribute("class"));

let newBtn1 = document.createElement("button");
newBtn1.innerText = "Click Me 1";
// console.log(newBtn1);
// console.dir(newBtn1);
let newBtn2 = document.createElement("button");
newBtn2.innerText = "Click Me 2";
// console.log(newBtn2);
// console.dir(newBtn2);
let newBtn3 = document.createElement("button");
newBtn3.innerText = "Click Me 3";
// console.log(newBtn3);
// console.dir(newBtn3);
let newBtn4 = document.createElement("button");
newBtn4.innerText = "Click Me 4";
// console.log(newBtn4);
// console.dir(newBtn4);


let btnContainer = document.querySelector(".button-container");
//Adds after contents
btnContainer.append(newBtn1);
//Adds before contents
btnContainer.prepend(newBtn2);
//Adds above the container
btnContainer.before(newBtn3);
//Adds below the container
btnContainer.after(newBtn4);

let newHeading = document.createElement("h1");
newHeading.innerText = "New Heading";
newHeading.innerHTML = "<i>New Heading</i>";
newHeading.setAttribute("class", "newHead");
document.querySelector("body").prepend(newHeading);
// btnContainer.before(newHeading);

newHeading.style.textAlign = "center";
newHeading.style.color = "rgb(233, 85, 85)";
newHeading.style.backgroundColor = "rgb(20, 90, 5)";

let delItem = document.querySelector(".para4");
delItem.remove();

let content = document.querySelector(".para2");
// console.dir(content);
content.classList.add("para2-new");