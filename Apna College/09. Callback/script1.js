function getData(dataId){
    setTimeout(() => {
        console.log("Data:", dataId);
    }, 500);
}
getData(1);
getData(2);
getData(3);

function newData(dataId, nextDataId){
    setTimeout(() => {
        console.log("New Data:", dataId);
        nextDataId();
    }, 700);
}

//Callback Hell
newData(1, () => {
    console.log("Getting Data...")
    newData(2, () => {
        console.log("Getting Data...")
        newData(3, () => {
            console.log("Getting Data...")
            newData(4, () => {});
        });
    });
});