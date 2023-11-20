// libs
const { Server } = require('socket.io')
const _ = require('lodash')

// config
const redis = require('@config/redis')

// constants
const env = require('@constants/env')

// config
const eventEmitter = require('@config/event-emitter')

class Socket {
  constructor () {
    this.client = null
  }

  get namespaces () {
    return new Set([
      'game',
      'transaction-request',
      'session',
      'registration',
      'logout'
    ])
  }

  async start () {
    this.client = new Server(env.SOCKET.PORT, {
      transports: ['websocket', 'polling'],
      rejectUnauthorized: false
    })

    this.namespaces.forEach(namespace => {
      const ns = `ns${_.capitalize(namespace)}`
      this[ns] = this.client.of(namespace)

      this[ns].on('connection', socket => {
        socket.on('join-room', room => {
          console.log(`A user joined a room in ${ns}: [${room}]`)
          socket.join(room)
        })

        socket.on('leave-room', room => {
          console.log(`A user left room in ${ns}: [${room}]`)
          socket.leave(room)
        })

        socket.on('clients:update', () => {
          eventEmitter.emit('clients:update')
        })

        socket.on('transaction-request', data => {
          socket.broadcast.emit('init-request', data)
        })

        socket.on('transaction-response', () => {
          socket.emit('transaction:complete')
          socket.broadcast.emit('init-response')
        })

        socket.on('bet:success', () => {
          socket.broadcast.emit('notify:bet-success')
        })

        socket.on('session', (clientId = null) => {
          socket.broadcast.emit('login', clientId)
        })

        socket.on('register-user', id => {
          socket.broadcast.emit('pendingUserCounts:update', id)
        })

        socket.on('logout-user', (clientId = null) => {
          socket.broadcast.emit('logoutUser:update', clientId)
        })

        socket.on('register-user', () => {
          socket.broadcast.emit('pendingUserCounts:update')
        })

        socket.on('register-response', () => {
          socket.emit('pendingUsers:response')
        })

        socket.on('force-logout', () => {
          socket.broadcast.emit('admin:forceLogout')
        })
      })
    })

    await this.listenToRedis()
  }

  async listenToRedis () {
    const sub = await redis.duplicate()

    sub.pSubscribe('socket:*', (message, channel) => {
      const channelArray = channel.split(':')

      if (channelArray.length < 3) {
        return
      }

      const namespace = channelArray[1]
      const event = channelArray[2]

      if (this.namespaces.has(namespace)) {
        this[`ns${_.capitalize(namespace)}`].emit(event, message)
      }
    })
  }
}

module.exports = new Socket()
