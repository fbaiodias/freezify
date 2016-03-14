const trumpet = require('trumpet')

function findURLs (stream, cb) {
  const tr = trumpet()

  const filesFound = {}

  const findFiles = (prop, type) => (elem) => {
    elem.getAttribute(prop, (url) => {
      if (!filesFound[url]) {
        filesFound[url] = { type: type }
      }
    })
  }

  tr.selectAll('link', findFiles('href', 'css'))
  tr.selectAll('a', findFiles('href', 'html'))
  tr.selectAll('script', findFiles('src', 'js'))
  tr.selectAll('img', findFiles('src', 'img'))

  tr.on('end', () => {
    cb(null, filesFound)
  })

  stream.pipe(tr)
}

function urlReplacer (replacer) {
  const tr = trumpet()

  const replaceUrl = (prop) => (elem) => {
    elem.getAttribute(prop, (url) => {
      elem.setAttribute(prop, replacer(url))
    })
  }

  tr.selectAll('link', replaceUrl('href'))
  tr.selectAll('a', replaceUrl('href'))
  tr.selectAll('script', replaceUrl('src'))
  tr.selectAll('img', replaceUrl('src'))

  return tr
}

module.exports = {
  findURLs: findURLs,
  urlReplacer: urlReplacer
}
