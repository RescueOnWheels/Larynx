/* Debug */
const debug = require('debug')('RRS:Larynx');

/* Packages */

const EventEmitter = require('events');

/* Socket.IO */
const io = require('socket.io')();
const middleware = require('socketio-wildcard')();

io.use(middleware);

/* Controllers */
const authentication = require('./controllers/authentication');
const cockpit = require('./controllers/cockpit');

/* Start of program */

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

io.on('connection', (socket) => {
  debug('Socket connected');

  /**
   * Indicates if the Rover has been told to stop.
   */
  socket.hasStopped = false;

  socket.stop = () => {
    if (socket.hasStopped) {
      return;
    }

    debug('STOP IT; STOP IT NOW!');
    socket.hasStopped = true;

    /**
     * Just to be sure, disconnect the socket.
     */
    socket.disconnect(true);

    if (!socket.isCockpit) {
      return;
    }

    /**
     * Tell the Rover that we have lost connection to the Cockpit.
     */
    myEmitter.emit('disconnect');
  };

  /* Controllers */
  authentication(socket);
  cockpit(socket, myEmitter);

  socket.on('disconnect', (reason) => {
    debug('Socket disconnected, %o', reason);

    if (!socket.isCockpit) {
      return;
    }

    socket.stop();
  });
});

io.listen(3000);

module.exports = myEmitter;
