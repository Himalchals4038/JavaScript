// const URL = "https://api.imgflip.com/get_memes";

// const fetchMemes = async () => {
//     try{
//         const response = await fetch(URL);
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         const data = await response.json();
//         return data.data.memes;
//     }
//     catch (error){
//         console.error("Failed to fetch memes:", error);
//     }
// };
// const displayMemes = async () => {
//     const container = document.getElementById('meme-container');
//     const memes = await fetchMemes();
//     container.innerHTML = ''; // Clear the "Loading..." text
//     if (memes && memes.length > 0) {
//         memes.forEach(meme => {
//             const memeHTML = `
//                 <div class="meme-card">
//                     <img src="${meme.url}" alt="${meme.name}">
//                     <h3>${meme.name}</h3>
//                 </div>
//             `;
//             container.insertAdjacentHTML('beforeend', memeHTML);
//         });
//     }
// };
// displayMemes();
// export default fetchMemes;

const URL = "https://catfact.ninja/facts";
const getFacts = async () => {
    console.log("Fetching data...")
    let response = await fetch(URL);
    console.log(response);
    console.log(response.status);
}

// const getFacts = () => {
//     promise.then((response) => {
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         return response.json();
//     })
//     .then((data) => {
//         console.log(data);
//     })
//     .catch((error) => {
//         console.error("Failed to fetch memes:", error);
//     });
// }
// getFacts();
// export default getFacts;