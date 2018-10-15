/**
 * Debug dependencies
 */
const debug = require('debug')('RRS:Larynx:Heartbeat');

/**
 * Delay the heartbeat for X number of miliseconds.
 */
const HEARTBEAT_DELAY = 10;

/**
 * Interval, in miliseconds, to check if the connection has been lost.
 */
const HEARTBEAT_INTERVAL = 100;

/**
 * Number of miliseconds to disconnect socket,
 * after if the last message received has passed this margin.
 */
const HEARTBEAT_MARGIN = 1000;

module.exports = (socket) => {
  /**
   * Timestamp of the last message received.
   */
  let lastMessage = 0;

  /**
   * Start the `heartbeat`-system.
   */
  socket.emit('heartbeat');

  /**
   * Listen to all events sent by the socket.
   */
  socket.on('*', () => {
    if (!socket.isCockpit) {
      return;
    }

    lastMessage = Date.now();
  });

  /**
   * Core functionality of the heartbeat.
   */
  socket.on('heartbeat', () => {
    setTimeout(() => {
      socket.emit('heartbeat');
    }, HEARTBEAT_DELAY);
  });

  setInterval(() => {
    if (lastMessage === 0) {
      return;
    }

    if (socket.hasStopped) {
      return;
    }

    if (lastMessage + HEARTBEAT_MARGIN > Date.now()) {
      return;
    }

    debug('Closing connection as the last message received was out of range.');
    socket.stop();
  }, HEARTBEAT_INTERVAL);

  return socket;
};
