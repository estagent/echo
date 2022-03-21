import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher
export default function (options = {}) {
  new Echo({
    broadcaster: 'pusher',
    key: options.key,
    wsHost: options.host,
    wsPort: options.host,
    wssPort: options.port,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    authorizer: options.authorizer,
  })
}
