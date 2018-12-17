let headsetConnected = false;

module.exports = (socket, myEmitter) => {
  socket.on('connect', () => {
    if (!socket.isHeadset) {
      return;
    }

    headsetConnected = true;
  });

  socket.on('disconnect', () => {
    if (!socket.isHeadset) {
      return;
    }

    headsetConnected = false;
  });

  socket.on('headset position', (json) => {
    if (!socket.isHeadset && !(socket.isCockpit && !headsetConnected)) {
      return;
    }

    myEmitter.emit('camera move', json);
  });

  return socket;
};
