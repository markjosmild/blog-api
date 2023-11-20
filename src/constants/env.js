const env = process.env

module.exports = {
  APP: {
    PORT: env.APP_PORT
  },
  DB: {
    HOST: env.DB_HOST,
    USER: env.DB_USER,
    PASS: env.DB_PASS,
    NAME: env.DB_NAME
  },
  JWT: {
    SECRET_KEY: env.JWT_SECRET_KEY,
    EXPIRES_IN: env.JWT_EXPIRES_IN
  }
}
