/**
 * RC Tracks Editor
 * Copyright (c) 2022 Jean-Sébastien CONAN
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = {
    root: true,
    extends: ['eslint:recommended', 'prettier'],
    plugins: ['es', 'jest', 'svelte3'],
    overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest'
    },
    env: {
        browser: true,
        es2017: true,
        node: true,
        'jest/globals': true
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
