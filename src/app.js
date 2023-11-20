require('dotenv').config()

const env = require('./constants/env')

module.exports = (async () => {
  try {
    await require('./bootstrap/jobs')()
    const server = await require('./bootstrap/http')()

    console.log(`app is running at: http://localhost:${env.APP.PORT}`)

    return server
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})()
