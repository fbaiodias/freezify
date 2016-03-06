const cssUrlEdit = require('css-url-edit')

module.exports = function parseHtml (stream, cb) {
  const filesFound = {}

  stream.on('data', (data) => {
    const urls = cssUrlEdit(data.toString()).getURLs()
    urls.forEach((url) => {
      if (!filesFound[url]) {
        filesFound[url] = { type: null }
      }
    })
  })

  stream.on('end', () => {
    cb(null, filesFound)
  })
}
