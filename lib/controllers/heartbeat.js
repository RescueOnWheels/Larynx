/* Auxilio */
const {
  Debug,
} = require('./../Auxilio');

/* Debug */
const debug = Debug('RRS:Larynx:Heartbeat');

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
  let lastMessage = Date.now();

  /**
   * Start the `heartbeat`-system.
   */
  socket.emit('heartbeat');

  /**
   * Listen to all events sent by the socket.
   */
  socket.on('*', () => {
    /* We are only interessed in the Cockpit. */
    if (!socket.isCockpit) {
      return;
    }

    lastMessage = Date.now();
  });

  /**
   * Core functionality of the heartbeat.
   */
  socket.on('heartbeat', () => {
    /* Event data may be lost if the client is not ready to receive messages. */
    socket.volatile.emit('heartbeat');
  });

  socket.heartbeat = setInterval(() => {
    /* No need to check a disconnected client. */
    if (socket.disconnected) {
      return;
    }

    if ((lastMessage + HEARTBEAT_MARGIN) > Date.now()) {
      return;
    }

    debug('Closing connection as the last message received was out of range.');
    socket.stop();

    /* Re-connecting client will be a new socket, stop checking for heartbeats. */
    clearInterval(socket.heartbeat);
  }, HEARTBEAT_INTERVAL);

  return socket;
};
