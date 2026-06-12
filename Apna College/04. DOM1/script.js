// console.log(window);
// console.log(window.document);
console.log(document.head);
console.dir(document.head);

console.log(document.body);
console.dir(document.body);

// console.dir(document.body.childNodes[3]);
console.log(document.body.childNodes[3]);

// document.body.childNodes[3].childNodes[1].innerText = "Hello";
document.getElementById("name").innerText = "Hitesh Chauhan";
document.getElementsByClassName("skills")[0].style.color = "rgb(33, 92, 170)";

console.dir(document.getElementsByClassName("skills")[0]);
document.getElementsByClassName("skills")[0].childNodes[3].childNodes[1].innerText = "Python";

// document.getElementsByClassName("skills")[0].style.color = "rgb(69, 250, 23)";
// document.getElementsByClassName("skills")[0].childNodes[3].childNodes[7].style.display = "none";
// document.getElementsByClassName("skills")[0].childNodes[3].childNodes[3].style.backgroundColor = "rgb(168, 53, 159)";

let unordered_list = document.getElementsByTagName("ul");
// console.log(unordered_list);
unordered_list[0].style.backgroundColor = "rgb(10, 80, 80)";
unordered_list[0].style.display = "flex";
unordered_list[0].style.justifyContent = "space-evenly";

let listItems = document.getElementsByTagName("li");
for (let item of listItems){
    item.style.color = "rgb(243, 136, 65)";
    // item.style.backgroundColor = "rgb(11, 247, 255)";
    item.style.fontSize = "20px";
    item.style.fontFamily = "Comic Sans MS";
}

//Returns first element instance
let para = document.querySelector("p");
// console.log(para);
para.style.color = "rgb(195, 0, 255)";
para.style.fontSize = "12px";
para.style.fontFamily = "verdana";

//Returns all elements instances
let list = document.querySelectorAll("li");
// console.log(list);
for (let item of list){
    item.style.color = "rgb(117, 51, 7)";
    item.style.backgroundColor = "rgb(92, 231, 79)";
    item.style.fontSize = "17px";
    item.style.fontFamily = "trebuchet ms";
}

let project = document.querySelector("#clone-website");
// console.log(project);
project.style.display = "flex";
project.style.flexDirection = "column";
project.style.justifyContent = "center";
project.style.alignItems = "center";
project.style.listStyleType = "none";
project.style.paddingBottom = "20px";

let amazonClone = document.querySelector("#Amazon");
// console.log(amazonClone);
amazonClone.style.padding = "10px";
amazonClone.style.backgroundColor = "rgb(225, 226, 132)";
amazonClone.style.color = "rgb(21, 85, 8)";
amazonClone.style.padding = "10px";

let flipkartClone = document.querySelector("#Flipkart");
flipkartClone.innerText = "Instamart";

// console.dir(document.body.children[2]);
document.body.children[2].style.color = "rgb(12, 201, 185)";
// console.dir(document.body.firstChild.nextElementSibling);
document.body.firstChild.nextElementSibling.style.color = "rgb(94, 106, 221)";

let oldHead = document.getElementById("old-heading");
// console.log(oldHead);
oldHead.style.visibility = "hidden";

let infringe = document.querySelector(".infringe");
// console.log(infringe);