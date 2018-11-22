module.exports = (socket, myEmitter) => {
  socket.on('headset position', (position) => {
    // TODO: https://github.com/RescueOnWheels/Larynx/issues/26
    if (!socket.cockpit) {
      return;
    }

    const json = position;
    myEmitter.emit('camera move', json);
  });

  return socket;
};
