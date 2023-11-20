const knex = require('../../configs/knex')

module.exports = {
  async list (request) {
    const list = await knex('users').where(request)

    return list
  },

  async store (request) {
    const [id] = await knex('users').insert(request)

    return id
  },

  async modify (request) {
    const [id] = await knex('users').update(request)

    return id
  }
}
