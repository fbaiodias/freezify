const test = require('ava')
const {
  resolveURL,
  resolveFS,
  resolve
} = require('./name-resolver')

test('URL: /index.html => css/style.css', (t) => {
  const currentPath = 'http://example.com/index.html'
  const fileName = 'css/style.css'
  const expectedResult = 'http://example.com/css/style.css'

  const result = resolveURL(currentPath, fileName)
  t.is(result, expectedResult)
})

test('URL: /css/style.css => /assets/font.woff', (t) => {
  const currentPath = 'http://example.com/css/style.css'
  const fileName = '/assets/font.woff'
  const expectedResult = 'http://example.com/assets/font.woff'

  const result = resolveURL(currentPath, fileName)
  t.is(result, expectedResult)
})

test('URL: /subfolder/index.html => cat.jpg', (t) => {
  const currentPath = 'http://example.com/subfolder/index.html'
  const fileName = 'cat.jpg'
  const expectedResult = 'http://example.com/subfolder/cat.jpg'

  const result = resolveURL(currentPath, fileName)
  t.is(result, expectedResult)
})

test('FS: /index.html => css/style.css', (t) => {
  const originPath = '/some/dir/'
  const currentPath = '/some/dir/index.html'
  const fileName = 'css/style.css'
  const expectedResult = '/some/dir/css/style.css'

  const result = resolveFS(originPath, currentPath, fileName)
  t.is(result, expectedResult)
})

test('FS: /css/style.css => /assets/font.woff', (t) => {
  const originPath = '/some/dir/'
  const currentPath = '/some/dir/css/style.css'
  const fileName = '/assets/font.woff'
  const expectedResult = '/some/dir/assets/font.woff'

  const result = resolveFS(originPath, currentPath, fileName)
  t.is(result, expectedResult)
})

test('FS: /subfolder/index.html => cat.jpg', (t) => {
  const originPath = '/some/dir/'
  const currentPath = '/some/dir/subfolder/index.html'
  const fileName = 'cat.jpg'
  const expectedResult = '/some/dir/subfolder/cat.jpg'

  const result = resolveFS(originPath, currentPath, fileName)
  t.is(result, expectedResult)
})

test('/index.html => css/style.css', (t) => {
  const originPath = 'http://example.com/'
  const currentPath = 'http://example.com/index.html'
  const fileName = 'css/style.css'
  const expectedResult = 'http://example.com/css/style.css'

  const result = resolve(originPath, currentPath, fileName)
  t.is(result, expectedResult)
})

test('/css/style.css => /assets/font.woff', (t) => {
  const originPath = 'http://example.com/'
  const currentPath = 'http://example.com/css/style.css'
  const fileName = '/assets/font.woff'
  const expectedResult = 'http://example.com/assets/font.woff'

  const result = resolve(originPath, currentPath, fileName)
  t.is(result, expectedResult)
})

test('/subfolder/index.html => cat.jpg', (t) => {
  const originPath = 'http://example.com/'
  const currentPath = 'http://example.com/subfolder/index.html'
  const fileName = 'cat.jpg'
  const expectedResult = 'http://example.com/subfolder/cat.jpg'

  const result = resolve(originPath, currentPath, fileName)
  t.is(result, expectedResult)
})

test('/index.html => css/style.css', (t) => {
  const originPath = '/some/dir/'
  const currentPath = '/some/dir/index.html'
  const fileName = 'css/style.css'
  const expectedResult = '/some/dir/css/style.css'

  const result = resolve(originPath, currentPath, fileName)
  t.is(result, expectedResult)
})

test('/css/style.css => /assets/font.woff', (t) => {
  const originPath = '/some/dir/'
  const currentPath = '/some/dir/css/style.css'
  const fileName = '/assets/font.woff'
  const expectedResult = '/some/dir/assets/font.woff'

  const result = resolve(originPath, currentPath, fileName)
  t.is(result, expectedResult)
})

test('/subfolder/index.html => cat.jpg', (t) => {
  const originPath = '/some/dir/'
  const currentPath = '/some/dir/subfolder/index.html'
  const fileName = 'cat.jpg'
  const expectedResult = '/some/dir/subfolder/cat.jpg'

  const result = resolve(originPath, currentPath, fileName)
  t.is(result, expectedResult)
})

test('http://external.com => http://external.com', (t) => {
  const originPath = '/some/dir/'
  const currentPath = '/some/dir/subfolder/index.html'
  const fileName = 'http://external.com'
  const expectedResult = 'http://external.com'

  const result = resolve(originPath, currentPath, fileName)
  t.is(result, expectedResult)
})
