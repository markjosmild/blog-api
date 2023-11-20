const bcrypt = require('bcryptjs')

module.exports = {
  hash (password, rounds = 2) {
    const salt = bcrypt.genSaltSync(rounds, 2)

    return bcrypt.hashSync(password, salt)
  },

  verify ({ password, hash }) {
    return bcrypt.compare(password, hash)
  }
}
