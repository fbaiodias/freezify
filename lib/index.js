const async = require('async')
const parse = require('./parsers')
const _ = require('lodash')
const PassThrough = require('stream').PassThrough
const { resolve } = require('./utils/name-resolver')

function freezify (entry, options, cb) {
  const allFiles = {}
  const basePath = options.origin.path

  const getFinalName = (fileName) =>
    fileName
      .replace(basePath, '')
      .replace(/\//g, '-')

  function getFile (name, type, cb) {
    const rs = options.origin.store.createReadStream({
      key: name.replace(basePath, '')
    })

    rs.on('error', cb)

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

    parseFile(name, type, parseStream, cb)
  }

  function parseFile (name, type, stream, cb) {
    parse[type].findURLs(stream, (err, filesFound) => {
      if (err) {
        return cb(err)
      }

      const absoluteFiles = {}
      Object.keys(filesFound)
        .forEach((fileName) => {
          const absolutePath = resolve(basePath, name, fileName)
          absoluteFiles[absolutePath] = filesFound[fileName]
        })

      const newFileNames = _.difference(_.keys(absoluteFiles), _.keys(allFiles))

      async.eachSeries(newFileNames, (name, cb) => {
        getFile(name, absoluteFiles[name].type, cb)
      }, cb)
    })
  }

  function saveFiles (files, cb) {
    async.eachSeries(files, (file, nextFile) => {
      const ws = options.destination.store.createWriteStream({
        key: file.name
      })

      if (!file.type || !parse[file.type]) {
        file.content.pipe(ws)
        ws.on('end', nextFile)
        return
      }

      const replacer = parse[file.type].urlReplacer((url) =>
        getFinalName(file.path))

      file.content.pipe(replacer)
      replacer.pipe(ws)
      ws.on('end', nextFile)
    }, cb)
  }

  const absoluteEntryPath = resolve(basePath, basePath, entry)
  getFile(absoluteEntryPath, 'html', (err) => {
    if (err) {
      return console.log(err)
    }

    const files = Object.keys(allFiles)
      .map((path) => ({
        name: getFinalName(path),
        type: allFiles[path].type,
        path: path,
        content: allFiles[path].content
      }))

    console.log(files.map((f) => `${f.path} => ${f.name}`).join('\n'))

    saveFiles(files, cb)
  })
}

module.exports = freezify
