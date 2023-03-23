const fs = require("node:fs/promises");

(async () => {
	console.time('ReadBig')
	const fileHandleRead = await fs.open(__dirname + "/src-SMALL.txt", "r")
	const fileHandleWrite = await fs.open(__dirname + "/dest.txt", "w")

	const streamRead = fileHandleRead.createReadStream({ highWaterMark: 64 * 1024 })
	const streamWrite = fileHandleWrite.createWriteStream()

	let split = ""

	streamRead.on("data", (chunk) => {
    const num = chunk.toString('utf8').split('  ').map(n => n.trim())

		if(Number(num[0]) !== Number(num[1]) - 1) {
			if(split) num[0] = split.trim() + num[0].trim()
		}

		// Si le dernier caractère est coupé, ca veut dire que sa valeur est différente de l'(avant-dernier caractère + 1)
		if(
			Number(num[num.length - 2]) + 1 !==
			Number(num[num.length - 1])
		) {
			split = num.pop() // on le stock temporairement dans split pour le coller au premier caractère sdu chunk suivant
		}

		// ajouter les nombres pairs au buffer interne du stream
		num.forEach(n => {
			let _n = Number(n)
			if(_n % 2 === 0) {
				if(!streamWrite.write(' ' + _n + ' ')) {
					streamRead.pause()
				}
			}
		})
	})

	streamWrite.on("drain", () => {
    streamRead.resume()
  })

	streamRead.on('end', () => {
		console.timeEnd('ReadBig')
		console.log('Done reading')
	})
})()