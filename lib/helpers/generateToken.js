/**
 * Generates and returns a token.
 *
 * @param n length of token
 * @returns {string} token
 */
function generateToken(n = 4) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'debug') {
    return 'ABBA';
  }
  if (typeof n !== 'number') {
    throw new Error('Expected \'n\' to be a number!');
  }

  const buttons = ['A', 'B', 'X', 'Y'];
  let token = '';
  for (let i = 0; i < n; i += 1) {
    token += buttons[Math.round(Math.random() * 3)];
  }

  return token;
}

module.exports = generateToken;
