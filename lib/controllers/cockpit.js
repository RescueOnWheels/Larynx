/* Debug */
const debug = require('debug')('RRS:Larynx:Cockpit');

module.exports = (socket, myEmitter) => {
  socket.on('move', (data) => {
    if (!socket.isCockpit) {
      return;
    }

    debug(data);
    myEmitter.emit('move', data);
  });

  return socket;
};
