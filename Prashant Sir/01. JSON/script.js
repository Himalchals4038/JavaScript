let product = {
    name: 'TShirt',
    price: 158,
    color: 'maroon',
    rating:{
        stars: 4.7,
        reviewCount: 245
    }
};
console.log(typeof product);
console.log(product);

let prodJson = JSON.stringify(product);
console.log(typeof prodJson);
console.log(prodJson);

let prodObj = JSON.parse(prodJson);
console.log(typeof prodObj);
console.log(prodObj);

console.log(prodObj.rating.stars);