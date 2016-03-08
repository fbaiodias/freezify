const async = require('async')
const parse = require('./parsers')
const _ = require('lodash')
const PassThrough = require('stream').PassThrough

function freezify (entry, options, cb) {
  const allFiles = {}

  function getFile (name, type, cb) {
    const rs = options.origin.store.createReadStream({
      key: name
    })

    rs.on('error', (err) => {
      console.log(err)
    })

    const storeStream = PassThrough()
    rs.pipe(storeStream)

    allFiles[name] = {
      type: type,
      content: storeStream
    }

    if (!parse[type]) {
      return cb()
    }

    const parseStream = PassThrough()
    rs.pipe(parseStream)

    parse[type](parseStream, (err, filesFound) => {
      if (err) {
        console.log(err)
        return
      }

      const newFileNames = _.difference(_.keys(filesFound), _.keys(allFiles))
      async.eachSeries(newFileNames, (name, cb) => {
        getFile(name, filesFound[name].type, cb)
      }, cb)
    })
  }

  const getFileName = (path) => path.replace('/', '-')

  function saveFiles (files, cb) {
    async.eachSeries(files, (file, cb) => {
      const ws = options.destination.store.createWriteStream({
        key: file.name
      })
      file.content.pipe(ws)
      ws.on('end', cb)
    }, cb)
  }

  getFile(entry, 'html', (err) => {
    if (err) {
      console.log(err)
      return
    }

    const files = Object.keys(allFiles)
      .map((path) => ({
        name: getFileName(path),
        path: path,
        content: allFiles[path].content
      }))

    saveFiles(files, cb)
  })
}

module.exports = freezify
