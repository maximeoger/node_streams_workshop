const fs = require("node:fs/promises");

(async () => {
	const fileHandleRead = await fs.open(__dirname + "/src.txt", "r")
	const filehandleWrite = await fs.open(__dirname + "/dest.txt", "w")

	const streamRead = fileHandleRead.createReadStream({ highWaterMark: 64 * 1024 })
	const streamWrite = filehandleWrite.createWriteStream()

	streamRead.on("data", (chunk) => {
    const num = chunk.toString('utf8').split('  ').map(n => n.trim())
    console.log(num)
		if(!streamWrite.write(chunk)) { // ecrire jusqu'a remplir le buffer inter puis pause
			streamRead.pause() 
		}
	})

	streamWrite.on("drain", () => {
    streamRead.resume()
  })
})()