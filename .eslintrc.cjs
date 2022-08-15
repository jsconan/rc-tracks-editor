//
// Copyright (c) 2021 Jean-Sébastien CONAN
// Distributed under the MIT License (See LICENSE file or copy at http://opensource.org/licenses/MIT).
//

module.exports = {
    root: true,
    extends: ['eslint:recommended', 'prettier'],
    plugins: ['es'],
    overrides: [],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020
    },
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    rules: {
        'consistent-this': ['error', 'self'],
        eqeqeq: ['error'],
        indent: ['warn', 4, { SwitchCase: 1, MemberExpression: 'off' }],
        'linebreak-style': ['error', 'unix'],
        'no-alert': ['warn'],
        'no-caller': ['error'],
        'no-console': ['warn'],
        'no-debugger': ['warn'],
        'no-eval': ['error'],
        'no-extend-native': ['error'],
        'no-extra-bind': ['error'],
        'no-implicit-globals': ['error'],
        'no-implied-eval': ['error'],
        'no-lone-blocks': ['error'],
        'no-new-func': ['error'],
        'no-script-url': ['error'],
        'no-self-compare': ['error'],
        'no-shadow': ['error', { hoist: 'functions' }],
        'no-throw-literal': ['error'],
        'no-trailing-spaces': ['error'],
        'no-undefined': ['error'],
        'no-use-before-define': ['error', { functions: false }],
        semi: ['error', 'always'],
        'vars-on-top': ['error']
    }
};
