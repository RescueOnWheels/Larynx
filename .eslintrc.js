module.exports = {
  "env": {
    "mocha": true,
    "node": true,
  },
  "extends": "airbnb-base",
  "rules": {
    "multiline-comment-style": ["error", "starred-block"],
    "no-multiple-empty-lines": ["error", {
      "max": 1,
      "maxBOF": 0,
      "maxEOF": 1
    }],
    "no-param-reassign": "off",
    "spaced-comment": ["error", "always", {
      "block": {
        "balanced": true
      }
    }]
  }
};
