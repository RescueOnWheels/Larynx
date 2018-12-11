/* Packages */
const chai = require('chai');

/* Test target */
const screen = require('./../../../lib/helpers/screen');

chai.should();

module.exports = () => {
  describe('test cases', () => {
    it('should clean both row1 and row2', () => {
      // Arrange
      screen.println('                ', 1);
      screen.println('                ', 2);

      // Act
      screen.clear();

      // Assert
      screen.lcd.display[0].should.equal('                ');
      screen.lcd.display[1].should.equal('                ');
    });
    it('should clear the line set in clearln', () => {
      // Arrange
      screen.clear();
      screen.println('ABCDEFGHIJKLMNOP', 1);
      screen.println('PONMLKJIHGFEDCBA', 2);

      // Act
      screen.clearln(1);

      // Assert
      screen.lcd.display[0].should.equal('                ');
      screen.lcd.display[1].should.equal('PONMLKJIHGFEDCBA');
    });
  });
};
