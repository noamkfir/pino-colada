const pino = require('pino')
const pinoHttp = require('pino-http')
const prettifier = require('@boco/pino-pretty')
const http = require('http')
const chalk = require('chalk')

const {
  processDate,
  processLevel,
  processMessage,
  processMethod,
  processUrl,
  processResponseTime,
  processContentLength
} = require('./pino-pretty-processors')

function colorizer (input, color = 'cyan') {
  return chalk[color](input)
}

const processors = [
  processDate,
  processLevel,
  processMessage,
  processMethod,
  processUrl,
  processResponseTime,
  processContentLength,
  'eol'
]

const logger = pino({
  prettyPrint: {
    colorizer,
    processors,
  },
  prettifier
})

const httpLogger = pinoHttp({ logger })

var server = http.createServer(function (req, res) {
  httpLogger(req, res)

  if (req.url === '/') {
    res.end('hello world')
    return
  } else if (req.url === '/user' && req.method === 'POST') {
    res.end('new user ✨')
    return
  } else if (req.url === '/content' && req.method === 'PUT') {
    res.end('ou weee here is some updated info')
    return
  } else if (req.url === '/content' && req.method === 'PUT') {
  } else {
    res.statusCode = 404
    res.end()
  }
})
server.listen(8080)
