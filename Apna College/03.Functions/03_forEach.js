let arr1 = [27, 43, 61, 80, 95, 21];

arr1.forEach((element) => {
    process.stdout.write(element + " ");
});
console.log();

arr2 = ["Pune", "Gandhinagar", "Surat", "Jaipur", "Burdwan", "Kochi"];
arr2.forEach((element, idx) => {
    process.stdout.write(element.toUpperCase() + " " + idx + " ");
});
console.log();