/**
 * BDD / TDD assertion library.
 */
const chai = require('chai');

/**
 * Function to test.
 */
const generateToken = require('./../lib/helpers/generateToken');

chai.should();

describe('generateToken', () => {
  // Arrange
  let token;

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
  });
});
