const getPromise1 = () => {
    return new Promise ((resolve, reject) => {
        console.log("Promise here");
        resolve("Network Connected Successfully");
    });
}
let promise1 = getPromise1();
promise1.then((res) => {
    console.log("Promise fulfilled");
    console.log(res);
});

setTimeout(() => {
    const getPromise2 = () => {
        return new Promise ((resolve, reject) => {
            console.log("Promise here");
            reject("Network Connection Failed");
        });
    }
    let promise2 = getPromise2();
    promise2.catch((err) => {
        console.log("Promise rejected");
        console.log(err);
    });
}, 2000);