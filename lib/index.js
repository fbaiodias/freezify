const async = require('async')
const parse = require('./parsers')
const _ = require('lodash')
const PassThrough = require('stream').PassThrough
const path = require('path')

function freezify (entry, options, cb) {
  const allFiles = {}

  const getAbsoluteName = (dirName, fileName) =>
    path
      .resolve(options.origin.path, dirName, fileName)
      .replace(options.origin.path, '')
      .replace('/', '')

  const getFinalName = (fileName) =>
    fileName.replace(/\//g, '-')

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

    parse[type].findURLs(parseStream, (err, filesFound) => {
      if (err) {
        console.log(err)
        return
      }

      const absoluteFiles = {}
      Object.keys(filesFound)
        .forEach((fileName) => {
          absoluteFiles[getAbsoluteName(path.dirname(name), fileName)] = filesFound[fileName]
        })

      const newFileNames = _.difference(_.keys(absoluteFiles), _.keys(allFiles))

      async.eachSeries(newFileNames, (name, cb) => {
        getFile(name, absoluteFiles[name].type, cb)
      }, cb)
    })
  }

  function saveFiles (files, cb) {
    console.log('files', files.map(f => f.name))

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
        getFinalName(getAbsoluteName(path.dirname(file.path), url)))

      file.content.pipe(replacer)
      replacer.pipe(ws)
      ws.on('end', nextFile)
    }, cb)
  }

  getFile(entry, 'html', (err) => {
    if (err) {
      console.log(err)
      return
    }

    const files = Object.keys(allFiles)
      .map((path) => ({
        name: getFinalName(path),
        type: allFiles[path].type,
        path: path,
        content: allFiles[path].content
      }))

    saveFiles(files, cb)
  })
}

module.exports = freezify
