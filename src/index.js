import Client from './client'

let client
let privateChannel

const channels = []

const connect = options => {
  client = new Client(options)
  privateChannel = client.private(`App.user.${options.user}`)
  return client
}

const disconnect = () => {
  if (client) {
    if (privateChannel) {
      privateChannel.unsubscribe()
      privateChannel = null
    }

    for (let chanel of channels) {
      client.leave(chanel)
    }

    client.disconnect()
    client = null
  }
}

const join = name => {
  if (channels.includes(name)) {
    throw 'already joined'
  }

  const chanel = client.join(name)
  channels.push(name)
  return chanel
}

const leave = name => {
  if (!channels.includes(name)) throw 'not joined joined'

  client.leave(name)
  for (let i = 0; i < channels.length; i++) {
    if (channels[i] === name) {
      channels.splice(i, 1)
    }
  }
  return channels.length
}

export default {
  connect: connect,
  disconnect: disconnect,
  privateChannel: () => privateChannel,
  join: join,
  leave: leave,
}
