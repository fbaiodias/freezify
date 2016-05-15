const freezify = require('..')
const fs = require('fs-blob-store')
const http = require('http-blob-store')
const path = require('path')

const ORIGIN_PATH = 'http://localhost:8000/'
const DEST_PATH = path.join(__dirname, '/dest')

const options = {
  origin: {
    store: http(ORIGIN_PATH),
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
