const vowelFinder = (str) => {
    let count = 0;
    for (let i=0; i<str.length; i++){
        if (str[i] === 'A' || str[i] === 'E' || str[i] === 'I' || str[i] === 'O' || str[i] === 'U' || str[i] === 'a' || str[i] === 'e' || str[i] === 'i' || str[i] === 'o' || str[i] === 'u') count++;
    }
    return count;
}

const vowelFinderAscii = (str) => {
    let count = 0;
    for (let i=0; i<str.length; i++){
        let code = str.charCodeAt(i);
        if (code === 65 || code === 69 || code === 73 || code === 79 || code === 85 ||
            code === 97 || code === 101 || code === 105 || code === 111 || code === 117) count++;
    }
    return count;
}

let str = "This is a sample sentence";
console.log(vowelFinder(str));
console.log(vowelFinderAscii(str));