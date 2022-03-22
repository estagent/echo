import Events from '@revgaming/events'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

let client
let privateChannel
let usersRoom

window.Pusher = Pusher

export default (instance, options = {}) => {
  window.addEventListener(Events.UserMounted, event => {
    window.Echo = client = new Echo({
      broadcaster: 'pusher',
      key: options.key,
      wsHost: options.host,
      wsPort: options.port,
      wssPort: options.port,
      forceTLS: false,
      encrypted: true,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      authorizer: (channel, opts) => {
        return {
          authorize: (socketId, callback) => {
            instance
              .post(opts.authEndpoint, {
                socket_id: socketId,
                channel_name: channel.name,
              })
              .then(response => {
                callback(false, response.data)  // response.data from axios.
              })
              .catch(error => {
                callback(true, error)
              })
          },
        }
      },
    })
    privateChannel = client.private(`App.user.${event.detail.user.id}`)
    usersRoom = client.join('users')
  })

  window.addEventListener(Events.UserUnmounted, () => {
    usersRoom.unsubscribe()
    usersRoom = null
    privateChannel.unsubscribe()
    privateChannel = null
    client.disconnect()
    client = null
  })

  return {
    listenForAuthenticated: callback => {
      privateChannel.notification(callback)
      privateChannel.listen('.NewMessage', callback)
      usersRoom.listen('.NewMessage', callback)
    },
  }
}
