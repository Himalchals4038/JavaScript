// function async1(){
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("async1");
//             resolve("async1 resolved");
//         }, 1000);
//     });
// }
// console.log("Fetching Data 1");
// let p1 = fetchData(1);
// p1.then((res) => {
//     console.log(res);
// });
function fetchData(dataId){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Data Set ${dataId}`);
            resolve(`async${dataId} resolved`);
        }, 1000);
    });
}
console.log("Fetching Data 1");
let p1 = fetchData(1);
p1.then((res) => {
    console.log(res);
    console.log("Fetching Data 2");
    let p2 = fetchData(2);
    p2.then((res) => {
        console.log(res);
        console.log("Fetching Data 3");
        let p3 = fetchData(3);
        p3.then((res) => {
            console.log(res);
            console.log("Fetching Data 4");
            let p4 = fetchData(4);
            p4.then((res) => {
                console.log(res);
            });
        });
    });
});