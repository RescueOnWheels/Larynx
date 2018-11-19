/* Packages */
const chai = require('chai');

/* Test target */
const generateToken = require('../../../lib/helpers/generateToken');

chai.should();

describe('generateToken', () => {
  // Arrange
  let token;

  beforeEach(() => {
    process.env.NODE_ENV = undefined;
  });

  describe('Input', () => {
    it('should return an error when \'n\' is not a number', () => {
      // Act
      const errorFunction = function () { // eslint-disable-line func-names
        token = generateToken('is this a number?');
      };

      // Assert
      errorFunction.should.throw(Error).with.property('message', 'Expected \'n\' to be a number!');
    });
  });

  describe('Output', () => {
    it('should return a string', () => {
      // Act
      token = generateToken();

      // Assert
      token.should.be.a('string');
    });

    it('should return a string, that only contains A, B, X and/or Y', () => {
      // Act
      token = generateToken(1024);

      const letters = token.split('');
      letters.forEach((letter) => {
        // Assert
        letter.should.be.oneOf(['A', 'B', 'X', 'Y']);
      });
    });

    it('should return a token with a length of 4, if there is no input for \'n\'', () => {
      // Act
      token = generateToken();

      // Assert
      token.should.have.lengthOf(4);
    });

    it('should return a token with a length of 1024, if \'n\' equals 1024', () => {
      // Act
      token = generateToken(1024);

      // Assert
      token.should.have.lengthOf(1024);
    });

    it('should return \'ABBA\' if ENV is development', () => {
      // Arrange
      process.env.NODE_ENV = 'development';

      // Act
      token = generateToken();

      // Assert
      token.should.equal('ABBA');
    });

    it('should return \'ABBA\' if ENV is debug', () => {
      // Arrange
      process.env.NODE_ENV = 'debug';

      // Act
      token = generateToken();

      // Assert
      token.should.equal('ABBA');
    });
  });
});
