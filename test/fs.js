const freezify = require('..')
const fs = require('fs-blob-store')

const ORIGIN_PATH = __dirname + '/example'
const DEST_PATH = __dirname + '/dest'

const options = {
  origin: {
    store: fs(ORIGIN_PATH),
    path: ORIGIN_PATH
  },
  destination: {
    store: fs(DEST_PATH),
    path: DEST_PATH
  }
}

freezify('index.html', options, function (err) {
  if (err) {
    throw err
  }

  console.log('all done')
})
