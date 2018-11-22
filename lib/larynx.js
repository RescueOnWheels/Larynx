/* Packages */
const EventEmitter = require('events');
const io = require('socket.io')();
const middleware = require('socketio-wildcard')();

/* Auxilio */
const {
  Debug,
} = require('./Auxilio');

/* Debug */
const debug = Debug('RRS:Larynx');

/* Socket.IO */
io.use(middleware);

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
  });
});

io.listen(3000);

module.exports = myEmitter;
