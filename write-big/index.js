const fs = require('node:fs/promises');
const { Buffer }  = require('node:buffer');

const SIZE = 1e+9;

// Testé sur Macbook M1 Pro, 16Go
// Ram max utilisée : 55 Mo
// Taille de sortie du ficher test.txt : 10,9 Go
// Durée d'execution du programme : ~4min 26sec
(async () => {
	console.time('writeMany');
	const filehandle = await fs.open(__dirname + '/../read-big/src.txt', 'w')
	const stream = filehandle.createWriteStream();

  console.log(stream.writableHighWaterMark)

  // permet de continuer à écrire sur le stream sans surcharger la memoire de son buffer interne
	let i = 0;

	const writeMany = () => {
		while(i < SIZE) {
		  const buff = Buffer.from(` ${i} `, 'utf8')

      // derniere opération d'écriture sur le stream
      if(i === (SIZE - 1)) {
        return stream.end(buff)
      }

      if(!stream.write(buff)) break; // on casse la boucle si il n'y a plus de place dans le buffer interne du stream
      i++
	  }
	}

  writeMany()

  // reprendre la boucle une fois que le buffer interne du stream est vide
  stream.on('drain', () => {
    writeMany();
  });

  stream.on('finish', () => {
    console.timeEnd("writeMany")
    filehandle.close();
  })
})()