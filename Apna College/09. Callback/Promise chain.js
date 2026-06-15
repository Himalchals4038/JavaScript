// function fetchData(dataId, getNextData){
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log(`Data Set ${dataId}`);
//             resolve(`async${dataId} resolved`);
//             if(getNextData) getNextData();
//         }, 500);
//     })
// }
// let p1 = fetchData(1), p2 = fetchData(2), p3 = fetchData(3), p4 = fetchData(4);
// console.log("Fetching Data 1");
// p1.then((res) => {
//     console.log(res);
//     console.log("Fetching Data 2");
//     return p2;
// }).then((res) => {
//     console.log(res);
//     console.log("Fetching Data 3");
//     return p3;
// }).then((res) => {
//     console.log(res);
//     console.log("Fetching Data 4");
//     return p4;
// }).then((res) => {
//     console.log(res);
// })

function fetchData(dataId){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Data Set ${dataId}`);
            resolve(`async${dataId} resolved`);
        }, 500);
    });
}

// Promise Chain
console.log("Fetching Data 1");
fetchData(1)
    .then((res) => {
        console.log(res);
        console.log("Fetching Data 2");
        return fetchData(2);
    })
    .then((res) => {
        console.log(res);
        console.log("Fetching Data 3");
        return fetchData(3);
    })
    .then((res) => {
        console.log(res); 
        console.log("Fetching Data 4");
        return fetchData(4);
    })
    .then((res) => {
        console.log(res);
    });