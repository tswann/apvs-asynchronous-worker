const config = require('./config')

module.exports = {
  asyncworker: {
    client: 'mssql',
    connection: {
      host: config.DATABASE_SERVER,
      user: config.ASYNC_WORKER_USERNAME,
      password: config.ASYNC_WORKER_PASSWORD,
      database: config.DATABASE,
      options: {
        encrypt: true
      }
    },
    pool: {
      min: 2,
      max: 10
    }
    //, debug: true // uncomment to debug
  }
}
