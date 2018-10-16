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

  /**
   * Trigger the `stop` event whenever the controller is disconnected.
   */
  socket.on('controller disconnect', () => {
    if (!socket.cockpit) {
      return;
    }

    debug('And it\'s gone...');
    socket.stop();
  });

  return socket;
};
