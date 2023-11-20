const jwt = require('jsonwebtoken')

const env = require('../constants/env')

module.exports = {
  sign (data) {
    return jwt.sign(
      data,
      env.JWT.SECRET_KEY,
      { expiresIn: env.JWT.EXPIRES_IN }
    )
  },

  verify (token) {
    return jwt.verify(
      token,
      env.JWT.SECRET_KEY
    )
  }
}
