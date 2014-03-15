var ar = [0], len = 99999, start = 0;
// Create array of random values
for(i = 0; i < len; i++) {
	ar.push( Math.floor( Math.random() * 10000000 ) );
}

// Copy array (! Not a "ar3 = ar2 = ar"? because then ar === ar2)
var ar2 = ar.slice(0, ar.length),
ar3 = ar.slice(0, ar.length);

// First test SPLICE
start = (+new Date());

for(i = 0; i < len; i++) {
	ar.splice(0, 1);
}

console.log( (+new Date() - start) / 1000 );

// Second test DELETE
start = (+new Date());

for(i = 0; i < len; i++) {
	delete( ar2[i] );
}

console.log( (+new Date() - start) / 1000 );


// Third test undefined
start = (+new Date());

for(i = 0; i < len; i++) {
	ar3[i] = undefined;
}

console.log( (+new Date() - start) / 1000 );
