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
