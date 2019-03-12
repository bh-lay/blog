module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-console": [
            "error",
            {
                allow: [
                    "warn",
                    "error",
                    "log"
                ]
            }
        ],
        'no-eq-null': 0,
        'no-multiple-empty-lines': 0,
        'object-property-newline': 0,
        'no-unused-vars': 0,
        'no-unused-expressions': 0,
        'no-useless-escape': 0,
        'no-useless-return': 0,
        'space-unary-ops': 0,
        'no-unreachable': 0
    }
};