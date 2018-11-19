module.exports = (socket, myEmitter) => {
  socket.on('headset position', (position) => {
    /*
     * TBD:
     * if (!socket.isVR) {
     * return;
     * }
     */

    const json = position;
    myEmitter.emit('camera move', json);
  });

  return socket;
};
