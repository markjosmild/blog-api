const { glob } = require('glob')

const Koa = require('koa')
const koaRouter = require('koa-router')
const cors = require('@koa/cors')
const bodyparser = require('koa-bodyparser')

const env = require('../constants/env')

async function getRoutes () {
  const router = koaRouter()
  const routePathList = await glob('./src/resources/**/route.js', {
    cwd: process.cwd(),
    absolute: true
  })

  routePathList.forEach(routePath => {
    try {
      const route = require(routePath)({
        router: koaRouter()
      })

      router.use(route.routes())
    } catch (error) {
      console.log(error)
      console.log(`Something went wrong in ${routePath}`)
    }
  })

  return router
}

module.exports = async function () {
  const router = await getRoutes()

  const app = new Koa()

  app.use(cors())
  app.use(bodyparser())

  app.use(router.routes())

  app.listen(env.APP.PORT)

  return app
}
