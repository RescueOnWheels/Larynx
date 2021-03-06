/* Packages */
const EventEmitter = require('events');
const io = require('socket.io')();
const middleware = require('socketio-wildcard')();
const Epicenter = require('socket.io-client')('http://192.168.0.1:8080');

/* Auxilio */
const {
  Debug,
} = require('./Auxilio');

/* Debug */
const debug = Debug('RRS:Larynx');

/* Socket.IO */
io.use(middleware);

Epicenter.on('identify', (cb) => {
  cb('rover');
});

/* Controllers */
const {
  Authentication,
  Cockpit,
  Headset,
} = require('./controllers');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

io.on('connection', (socket) => {
  debug('Socket connected');

  /* Default values */
  socket.isCockpit = false;
  socket.isHeadset = false;

  /**
   * Listen to all events sent by the socket.
   */
  socket.on('*', (event) => {
    if (event.data[0] === 'heartbeat') {
      return;
    }
    /* We are only interested in the Cockpit. */
    if (socket.isCockpit) {
      debug('Cockpit: %o', ...event.data);
    }
  });

  socket.stop = () => {
    debug('STOP IT; STOP IT NOW!');

    /* Make sure we really are disconnected */
    socket.disconnect();

    /* Inform the listener(s) that we have lost connection with the Cockpit. */
    if (socket.isCockpit) {
      myEmitter.emit('disconnect');
    }
  };

  /* Controllers */
  Authentication(socket);
  Cockpit(socket, myEmitter);
  Headset(socket, myEmitter);

  socket.on('disconnect', (reason) => {
    debug('Socket disconnected, %o', reason);

    /* Inform the listener(s) that we have lost connection with the Cockpit. */
    if (socket.isCockpit) {
      socket.stop();
    }

    /* Inform the listener(s) that we have lost connection with the Headset. */
    if (socket.isHeadset) {
      // TBD
    }

    if (reason === 'client namespace disconnect') {
      socket.disconnect(true);
    }
  });
});

io.listen(3000);

function stop() {
  io.close();
}

module.exports = myEmitter;
module.exports.stop = stop;
