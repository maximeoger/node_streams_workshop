const fs = require('node:fs/promises')

(async () => {
  console.time('copy')

  const srcFile = await fs.open('text-gigantic.txt', 'r')
  const destFile = await fs.open('text-copy.txt', 'w')

  let bytesRead = -1

  while(bytesRead !== 0) {
    const readResults = await srcFile.read()
    bytesRead = readResults.bytesRead
    
    if(bytesRead !== 16384) {
      const indexOfNotFilled = readResults.buffer.indexOf(0)
      const newBuffer = Buffer.alloc(indexOfNotFilled)
      readResults.buffer.copy(newBuffer, 0, 0, indexOfNotFilled)
      destFile.write(newBuffer)
    } else {
      destFile.write(readResults.buffer)
    }

  }

})()
