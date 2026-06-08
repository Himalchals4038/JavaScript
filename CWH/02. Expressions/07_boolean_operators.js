let p = 47, q = 86, r = 21, gr;
if (q>p && q>r) gr = q;
else if (p>q && p>r) gr = p;
else gr = r;
console.log("Greatest number is", gr);

console.log(p<q || r==q);
console.log(!(p>q) && r<q);
