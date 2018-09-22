module.exports = {
    "env": {
        "mocha": true,
        "node": true,
    },
    "extends": "airbnb-base",
    "rules": {
        "no-console": "off",
        "no-multiple-empty-lines": ["error", {
            "max": 1,
            "maxBOF": 0,
            "maxEOF": 1
        }],
    }
};