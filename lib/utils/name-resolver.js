const path = require('path')
const isUrl = require('is-url')
const url = require('url')

const resolveURL = (currentURL, fileName) => {
  const parsedURL = url.parse(currentURL)
  const currentDir = path.dirname(url.parse(currentURL).pathname)

  const finalPathName = path
    .resolve(currentDir, fileName)

  parsedURL.pathname = finalPathName

  return url.format(parsedURL)
}

const resolveFS = (basePath, currentPath, fileName) => {
  const prefix = basePath.slice(0, basePath.length - 1)
  const currentDir = path.dirname(currentPath.replace(prefix, ''))

  const relativePath = path
    .resolve(currentDir, fileName)

  return prefix + relativePath
}

const resolve = (originPath, filePath, fileName) => {
  if (isUrl(fileName)) {
    return fileName
  }

  if (isUrl(originPath)) {
    return resolveURL(filePath, fileName)
  }

  return resolveFS(originPath, filePath, fileName)
}

module.exports = {
  resolveURL,
  resolveFS,
  resolve
}
