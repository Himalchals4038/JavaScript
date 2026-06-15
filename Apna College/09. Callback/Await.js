// function fetchData(dataId){
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log(`Data Set ${dataId}`);
//             resolve(`async${dataId} resolved`);
//         }, 500);
//     });
// }
function api(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("API Data Fetched");
            resolve(200);
        }, 2000);
    });
}
async function getWeatherData(){
    let res = await api();
    console.log(res);
    console.log(res);
}