const cssUrlEdit = require('css-url-edit')
const URLRewriteStream = require('cssurl').URLRewriteStream

function findURLs (stream, cb) {
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

function urlReplacer (replacer) {
  return new URLRewriteStream(replacer)
}

module.exports = {
  findURLs: findURLs,
  urlReplacer: urlReplacer
}
