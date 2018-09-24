module.exports = {
    "env": {
        "mocha": true,
        "node": true,
    },
    "extends": "airbnb-base",
    "rules": {
        "no-console": ["error", {
            "allow": ["debug", "error", "info", "warn"]
        }],
        "no-multiple-empty-lines": ["error", {
            "max": 1,
            "maxBOF": 0,
            "maxEOF": 1
        }],
    }
};