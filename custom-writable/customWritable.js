const { Writable } = require('node:stream')
const fs = require('node:fs')

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark })

    this.fileName = fileName
    this.fd = null
    this.chunks = []
    this.chunkSize = 0
  }

  // This method will not be executed untill the Writable class has been initialized
  // while the constructor has not been called, all the calling to the others methods will be off
  _construct(callback) {
     fs.open(this.fileName, "w", (err, fd) => {
      if(err) {
        // if there is a callback with an argument, this means that we have an error and should not proceed
        callback(err)
       } else {
        this.fd = fd
        // no arguments means it was successfull
        callback()
       }
     })
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk)
    this.chunkSize += chunk.length

    if(this.chunkSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if(err) {
          return callback(err)
        }
        this.chunks = []
        this.chunkSize = 0
        ++this.writesCount
        callback()
      })
    } else {
      callback()
    }
  }

  // this method will be called before the stream is about to be closed
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if(err) return callback(err)
      this.chunks = []
      callback()
    })
  }

  _destroy(error, callback) {
    if(this.fd) {
      fs.close(this.fd, (err) => {
        callback(err | error)
      })
    } else {
      callback()
    }
  }
}

const stream = new FileWriteStream({ highWaterMark: 1800, fileName: 'file.txt' })
stream.write(Buffer.from('Coucou'))
stream.end(Buffer.from('Last write'))

stream.on('finish', () => {
  console.log('stream was finished')
})