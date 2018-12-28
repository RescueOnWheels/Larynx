/* Packages */
const chai = require('chai');
const io = require('socket.io-client');

/* Test target */
const Larynx = require('./../../');

chai.should();

module.exports = () => {
  let socket = null;
  beforeEach(() => {
    socket = io('http://127.0.0.1:3000', { reconnection: false });
  });

  afterEach(() => {
    socket.disconnect();
  });

  after(() => {
    Larynx.stop();
  });

  it('should send the `authenticate` event after a socket connecting', (done) => {
    socket.on('authenticate', () => {
      done();
    });

    socket.connect();
  });

  it('should send the `authenticated` event after successful authentication.', (done) => {
    socket.on('authenticate', (cb) => {
      cb('ABBA');
    });

    socket.on('authenticated', () => {
      done();
    });

    socket.connect();
  });

  it('should send the `disconnected` event after failed authentication.', (done) => {
    socket.on('authenticate', (cb) => {
      cb('FAIL');
    });

    socket.on('disconnect', (reason) => {
      reason.should.be.equal('io server disconnect');
      done();
    });

    socket.connect();
  });

  it('should send the `disconnected` event after more than 1000ms of no response.', (done) => {
    socket.once('heartbeat', () => {
      // ignore
    });

    socket.on('authenticate', (cb) => {
      cb('ABBA');
    });

    socket.on('disconnect', () => {
      done();
    });

    socket.connect();
  });

  it('should send the `disconnected` event after more than 1000ms of no response.', (done) => {
    let i = 5;
    socket.once('heartbeat', () => {
      if (i <= 0) return;
      i -= 5;

      socket.emit('alive');
    });

    socket.on('authenticate', (cb) => {
      cb('ABBA');
    });

    socket.on('disconnect', () => {
      done();
    });

    socket.connect();
  });

  it('should send accept headset movement if there is only one connection.', (done) => {
    let i = 3;
    socket.once('heartbeat', () => {
      if (i <= 0) return;
      i -= 1;

      socket.emit('headset position', { horizontal: 0, vertical: 0 });
    });

    socket.on('authenticate', (cb) => {
      cb('ABBA');
    });

    socket.on('disconnect', () => {
      done();
    });

    socket.connect();
  });

  it('should send accept movement on successful authentication.', (done) => {
    let i = 3;
    socket.once('heartbeat', () => {
      if (i <= 0) return;
      i -= 1;

      socket.emit('move', 'left');
    });

    socket.on('authenticate', (cb) => {
      cb('ABBA');
    });

    socket.on('disconnect', () => {
      done();
    });

    socket.connect();
  });

  it('should not stop movement on controller failure if we are not authenticated.', (done) => {
    let i = 3;
    socket.once('heartbeat', () => {
      if (i <= 0) return;
      i -= 1;

      socket.emit('controller disconnect');
    });

    socket.on('authenticate', (cb) => {
      cb('ABBA');
    });

    socket.on('disconnect', () => {
      done();
    });

    socket.connect();
  });

  it('should not accept movement on failed authentication.', (done) => {
    socket.on('connect', () => {
      socket.emit('move', 'left');
      done();
    });

    socket.connect();
  });

  it('should not stop movement on controller failure if we are not authenticated.', (done) => {
    socket.on('connect', () => {
      socket.emit('controller disconnected');
      done();
    });

    socket.connect();
  });

  it('should accept `headset` as event', (done) => {
    socket.on('connect', () => {
      socket.emit('headset');
      done();
    });

    socket.connect();
  });
};
