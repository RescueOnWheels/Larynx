/* Auxilio */
const {
  Debug,
} = require('./../Auxilio');

/* Debug */
const debug = Debug('RRS:Larynx:Headset');

let headsetConnected = false;

module.exports = (socket, myEmitter) => {
  socket.on('headset', () => {
    debug('Headset connected.');
    headsetConnected = true;
  });

  socket.on('disconnect', () => {
    if (!socket.isHeadset) {
      return;
    }

    debug('Headset disconnected.');
    headsetConnected = false;
  });

  socket.on('headset position', (json) => {
    if (!socket.isHeadset && !(socket.isCockpit && !headsetConnected)) {
      return;
    }

    debug('Moving camera to %o', json);
    myEmitter.emit('camera move', json);
  });

  return socket;
};
