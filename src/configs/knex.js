const env = require('../constants/env')

module.exports = require('knex')({
  client: 'mysql2',
  connection: {
    host: env.DB.HOST,
    user: env.DB.USER,
    password: env.DB.PASS,
    database: env.DB.NAME
  }
})
