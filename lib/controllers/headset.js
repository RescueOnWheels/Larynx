module.exports = (socket, myEmitter) => {
  socket.on('headset position', (json) => {
    // TODO: https://github.com/RescueOnWheels/Larynx/issues/26
    if (!socket.cockpit) {
      return;
    }

    myEmitter.emit('camera move', json);
  });

  return socket;
};
