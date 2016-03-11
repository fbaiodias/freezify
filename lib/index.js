const async = require('async')
const parse = require('./parsers')
const _ = require('lodash')
const PassThrough = require('stream').PassThrough
const path = require('path')

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

      newFileNames.forEach((fileName) => {
        filesFound[fileName].path = path.resolve(options.origin.path, path.dirname(name), fileName).replace(options.origin.path, '')
      })

      async.eachSeries(newFileNames, (name, cb) => {
        getFile(filesFound[name].path, filesFound[name].type, cb)
      }, cb)
    })
  }

  const getFileName = (fileName) =>
    path
      .resolve(options.origin.path, fileName)
      .replace(options.origin.path, '')
      .replace('/', '')
      .replace(/\//g, '-')

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
