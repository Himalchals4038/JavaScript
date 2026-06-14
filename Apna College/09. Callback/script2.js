function getData(dataId, nextDataId){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Data:", dataId);
            if (nextDataId) nextDataId();
        }, 200);
    });
}
getData(1, () => {
    console.log("Getting Data...")
    getData(2, () => {
        console.log("Getting Data...")
        getData(3, () => {
            console.log("Getting Data...")
            getData(4, () => {});
        });
    });
});

//Accepted Promise
function getData1(dataId, nextDataId1){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Data:", dataId);
            resolve("Success");
            if (nextDataId1) nextDataId1();
        }, 5000);
    });
}

//Rejected Promise
function getData2(dataId, nextDataId2){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // console.log("Data:", dataId);
            // resolve("Success");
            reject("Error");
            if (nextDataId2) nextDataId2();
        }, 5000);
    });
}