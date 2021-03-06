const config = require('../../config')
const bunyan = require('bunyan')
const bunyanLogstash = require('bunyan-logstash-tcp')
const PrettyStream = require('bunyan-prettystream')

const logsPath = config.LOGGING_PATH || 'logs/asynchronous-worker.log'
const logsLevel = config.LOGGING_LEVEL
const logstashHost = config.LOGSTASH_HOST
const logstashPort = config.LOGSTASH_PORT

// Stream to handle pretty printing of Bunyan logs to stdout.
var prettyStream = new PrettyStream()
prettyStream.pipe(process.stdout)

// Create a base logger for the application.
var log = bunyan.createLogger({
  name: 'asynchronous-worker',
  streams: [],
  serializers: {
    'error': errorSerializer
  }
})

// Add stream to push logs to Logstash for aggregation, reattempt connections indefinitely.
if (logstashHost && logstashPort) {
  var logstashStream = bunyanLogstash.createStream({
    host: logstashHost,
    port: logstashPort,
    max_connect_retries: 10,
    retry_interval: 1000 * 60
  }).on('error', console.log)

  log.addStream({
    type: 'raw',
    level: logsLevel,
    stream: logstashStream
  })
}

// Add console Stream.
log.addStream({
  level: 'DEBUG',
  stream: prettyStream
})

// Add file stream.
log.addStream({
  type: 'rotating-file',
  level: logsLevel,
  path: logsPath,
  period: '1d',
  count: 7
})

function errorSerializer (error) {
  return {
    message: error.message,
    name: error.name,
    stack: error.stack
  }
}

module.exports = log
