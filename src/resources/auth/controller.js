// services
const authService = require('./service')

// utils
const bcrypt = require('../../utilities/bcrypt')
const jwt = require('../../utilities/jwt')

// libraries
const Joi = require('joi')

module.exports = {
  async list (ctx) {
    const request = ctx.request.body

    ctx.body = await authService.list(request)
  },

  async store (ctx) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    })

    try {
      const request = await schema.validateAsync(ctx.request.body)
      const [user] = await authService.list({ username: request.username })

      if (user) {
        throw new Error('username already use')
      }

      request.password = bcrypt.hash(request.password)
      const response = await authService.store(request)

      ctx.body = response
    } catch (error) {
      ctx.throw(400, error)
    }
  },

  async patch (ctx) {
    const schema = Joi.object({/* schema here */})

    try {
      const request = await schema.validateAsync(ctx.request.body)
      const response = await authService.modify(request)

      ctx.body = response
    } catch (error) {
      ctx.throw(400, error)
    }
  },

  async login (ctx) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    })

    try {
      const request = await schema.validateAsync(ctx.request.body)
      const [user] = await authService.list({ username: request.username })

      if (!user) {
        throw new Error('incorrect username/password')
      }

      const verify = await bcrypt.verify({
        password: request.password,
        hash: user.password
      })

      if (!verify) {
        throw new Error('incorrect username/password')
      }

      const token = jwt.sign(user)

      ctx.body = token
    } catch (error) {
      ctx.throw(400, error)
    }
  },

  async getAuth (ctx) {
    const { id } = ctx.state.auth

    try {
      const [user] = await authService.list({ id })

      ctx.body = user
    } catch (error) {
      ctx.throw(400, error)
    }
  }
}
