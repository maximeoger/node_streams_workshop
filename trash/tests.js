const fs = require('node:fs/promises');
const { Buffer }  = require('node:buffer');
const { SIZE } = require('../write-big/constants');


// 2.3 s
// 156 Mb of memory
(async function (){
	console.time('writeMany');
	const filehandle = await fsPromises.open('test.txt', 'w');
	let buff = Buffer
	buff.alloc(SIZE)
	let str = '';
	for(let i = 0; i < SIZE; i++) {
		str += ` ${i} `;
	}
	let content = buff.from(str, 'utf8');

	filehandle.write(content, 0);
	filehandle.close();
	console.timeEnd('writeMany');
})()


// Mauvaise idée
// 20.881 seconds
// 4.47 Mb of memory
(function (){
	console.time('writeMany');
	fs.open('test.txt', 'w', (err, fd) => {
		for(let i = 0; i < SIZE; i++) {
			fs.writeSync(fd,` ${i} `)
		}
		console.timeEnd('writeMany');
	});
})() 

