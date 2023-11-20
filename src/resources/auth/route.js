// controllers
const authController = require('./controller')

// middlewares
const authentication = require('../../middleware/authentication')

module.exports = ({ router }) => router
  .prefix('/auth')

  .post(
    '/list',
    ctx => (ctx.status = 503),
    authController.list
  )

  .post(
    '/',
    authController.store
  )

  .patch(
    '/',
    ctx => (ctx.status = 503),
    authController.patch
  )

  .post(
    '/login',
    authController.login
  )

  .get(
    '/',
    authentication,
    authController.getAuth
  )
