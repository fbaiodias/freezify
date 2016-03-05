const async = require('async')
const parse = require('./parsers')
const _ = require('lodash')

function freezify (entry, options, cb) {
  const allFiles = {}

  function getFile (name, type, cb) {
    const rs = options.origin.store.createReadStream({
      key: name
    })

    rs.on('error', (err) => {
      console.log(err)
    })

    allFiles[name] = {
      type: type
    }

    if (!parse[type]) {
      return cb()
    }

    parse[type](rs, (err, filesFound) => {
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

  getFile(entry, 'html', (err) => {
    if (err) {
      console.log(err)
      return
    }

    console.log('found', allFiles)
  })
}

module.exports = freezify
