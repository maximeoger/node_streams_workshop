const { Transform } = require('node:stream')
const fs = require('node:fs/promises')

class Decrypt extends Transform {
  _transform(chunk, encoding, callback) {
    // <Buffer (34 - 1), (ff - 1), (4d - 1), etc.. >
    for(let i=0; i<chunk.length; i++) {
      // we cannot add 1 to 255 since this is the maximum hex value for one byte 
      if(chunk[i] !== 255) {
        chunk[i] = chunk[i] - 1
      }
    }
    this.push(chunk)
  }
}

(async () => {
  const readFileHandle = await fs.open('write.txt', 'r')
  const writeFileHandle = await fs.open('decrypted.txt', 'w')

  const readStream = readFileHandle.createReadStream()
  const writeStream = writeFileHandle.createWriteStream()

  const decrypt = new Decrypt()

  readStream.pipe(decrypt).pipe(writeStream)
})()