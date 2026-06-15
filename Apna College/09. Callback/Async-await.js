function fetchData(dataId){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Data Set ${dataId}`);
            resolve(`async${dataId} resolved`);
        }, 500);
    });
}

//Async-await
async function getAllData(){
    console.log("Fetching Data 1");
    await fetchData(1);
    console.log("Fetching Data 2");
    await fetchData(2);
    console.log("Fetching Data 3");
    await fetchData(3);
    console.log("Fetching Data 4");
    await fetchData(4);
}
getAllData();