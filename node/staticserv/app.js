const http = require('http')
const fs = require('fs')
const url = require('url')
const mime = require('mime')
const app = http.createServer();

app.on('request', (req, res) => {
  let pathname = url.parse(req.url).pathname
  if (pathname === '/favicon.ico') return
  let webpath = __dirname + '/static' + pathname
  let type = mime.getType(webpath)
  fs.readFile(webpath, (err, data) => {
    if (err) throw err
    res.writeHead(200, { 'content-type': type });
    res.end(data)
  })
})

app.listen(3000)