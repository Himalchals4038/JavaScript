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

let newBtn = document.createElement("button");
newBtn.innerText = "New Button";
console.log(newBtn);
console.dir(newBtn);