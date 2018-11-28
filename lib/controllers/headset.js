let headsetConnected = true;

module.exports = (socket, myEmitter) => {
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
