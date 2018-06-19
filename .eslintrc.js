module.exports = {
    env: {
        es6: true,
        node : true,
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {},
    },
    // https://github.com/google/eslint-config-google
    extends: 'eslint-config-google',
    rules: {
        'max-len': 0,
        'require-jsdoc': 0,
    },
}
