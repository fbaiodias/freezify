const trumpet = require('trumpet')

module.exports = function parseHtml (stream, cb) {
  const tr = trumpet()

  const filesFound = {}

  tr.selectAll('link', (elem) => {
    elem.getAttribute('href', (href) => {
      if (!filesFound[href]) {
        filesFound[href] = { type: 'css' }
      }
    })
  })

  tr.selectAll('a', (elem) => {
    elem.getAttribute('href', (href) => {
      if (!filesFound[href]) {
        filesFound[href] = { type: 'html' }
      }
    })
  })

  tr.selectAll('script', (elem) => {
    elem.getAttribute('src', (href) => {
      if (!filesFound[href]) {
        filesFound[href] = { type: 'js' }
      }
    })
  })

  tr.selectAll('img', (elem) => {
    elem.getAttribute('src', (href) => {
      if (!filesFound[href]) {
        filesFound[href] = { type: 'img' }
      }
    })
  })

  tr.on('end', () => {
    cb(null, filesFound)
  })

  stream.pipe(tr)
}
