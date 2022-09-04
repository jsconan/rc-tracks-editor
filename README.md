# RC Tracks Editor

An editor to build RC tracks using the tiles from [jsconan/rc-tracks](https://github.com/jsconan/rc-tracks/tree/main/scale-64)

<!-- vscode-markdown-toc -->

-   [Quick start](#Quickstart)
-   [Running the application](#Runningtheapplication)
-   [Requirements](#Requirements)
-   [Tooling](#Tooling)
    -   [Transpilation](#Transpilation)
    -   [Testing](#Testing)
    -   [Linting](#Linting)
    -   [Formatting](#Formatting)
    -   [Spelling](#Spelling)
-   [Development](#Development)
    -   [Running the application with live reload](#Runningtheapplicationwithlivereload)
    -   [Building the code](#Buildingthecode)
    -   [Testing](#Testing-1)
    -   [Testing during development](#Testingduringdevelopment)
    -   [Checking test coverage](#Checkingtestcoverage)
    -   [Checking code style](#Checkingcodestyle)
    -   [Enforcing code style](#Enforcingcodestyle)
    -   [Checking spelling](#Checkingspelling)
-   [License](#License)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='Quickstart'></a>Quick start

Checkout the branch, then install the application

```sh
git clone git@github.com:jsconan/rc-tracks-editor.git
cd rc-tracks-editor
npm i
```

## <a name='Runningtheapplication'></a>Running the application

The application can be opened from the displayed URL.

```sh
npm run preview
```

## <a name='Requirements'></a>Requirements

The library requires Node.js 14 and above.

## <a name='Tooling'></a>Tooling

The project toolchain relies on several third-party tools.

### <a name='Transpilation'></a>Transpilation

The code is written using ES modules, which are not well supported by the testing framework. For this reason, the code needs to be converted to commonJS modules before to be tested. This conversion is processed thanks to [Babel](https://babeljs.io/).

The applied configuration can be retrieved at [babel.config.cjs](babel.config.cjs).

This conversion is made when calling the command `npm run test`.

### <a name='Testing'></a>Testing

Unit testing is performed using [Jest](https://jestjs.io/).

The applied configuration can be retrieved at [jest.config.cjs](jest.config.cjs).

The tests are processed by calling the command `npm test`.

### <a name='Linting'></a>Linting

The code style is verified thanks to [ESLint](https://eslint.org/). It takes care of the JavaScript flavour, and can also verify the annotated documentation follows the rules.

The applied configuration can be retrieved at [`.eslintrc.cjs`](.eslintrc.cjs).

The verification can be triggered by calling the command `npm run lint`.

The tool can also be integrated to the IDE, applying the verification while writing the code.

### <a name='Formatting'></a>Formatting

The code style is enforced thanks to [Prettier](https://prettier.io/). The convention are described in the [Coding conventions](#Codingconventions) section.

The applied configuration can be retrieved at [`.prettierrc`](.prettierrc).

The formatting can be triggered by calling the command `npm run format`.

The tool can also be integrated to the IDE, applying the formatting while writing the code.

### <a name='Spelling'></a>Spelling

The work spelling is verified thanks to [CSpell](https://cspell.org/).

The applied configuration can be retrieved at [`.cspell.json`](.cspell.json).

The verification can be triggered by calling the command `npm run spell`.

The tool can also be integrated to the IDE, applying the verification while writing the code.

## <a name='Development'></a>Development

### <a name='Runningtheapplicationwithlivereload'></a>Running the application with live reload

While developing the application can be run with live reload.
After each change, the page will be updated.

```sh
npm run dev
```

### <a name='Buildingthecode'></a>Building the code

A distributable can be generated into the `dist` folder:

```sh
npm run build
```

### <a name='Testing-1'></a>Testing

Run the tests suite:

```sh
npm test
```

The explicit command can also be used:

```sh
npm run test
```

By default, it will perform the whole tests suite. The name of a module or a path can be supplied as a scope to limit the tests suite. Like so:

```sh
npm test track
```

### <a name='Testingduringdevelopment'></a>Testing during development

The tests runner can be kept alive while developing so that it can run again after a change.

```sh
npm run test:watch
```

After a change that impacts the output, the snapshots may need to be updated.

> Be sure the output is correct and it meets the expectations before updating any snapshot.

```sh
npm run test:update
```

### <a name='Checkingtestcoverage'></a>Checking test coverage

The test coverage can be measured both in command-line or in rich text format.

This will produce a text based output:

```sh
npm run test:cov
```

By default, it will perform the whole tests suite.
The name of a module or a path can be supplied as a scope to limit the tests suite.
Like so:

```sh
npm run test:cov track
```

This will open a HTML page showing a rich view of the coverage:

```sh
npm run coverage:html
```

### <a name='Checkingcodestyle'></a>Checking code style

The code style rules are enforced thanks to ESLint and Prettier.
Files can be checked:

```sh
npm run lint
```

### <a name='Enforcingcodestyle'></a>Enforcing code style

The code style rules are enforced thanks to ESLint and Prettier.
Files can be formatted:

```sh
npm run format
```

### <a name='Checkingspelling'></a>Checking spelling

The spelling can be verified by CSpell:

```sh
npm run spell
```

## <a name='License'></a>License

Copyright (c) 2022 Jean-Sébastien CONAN
Distributed under the GPL-3.0 License (See LICENSE file or copy at [https://opensource.org/licenses/GPL-3.0](https://opensource.org/licenses/GPL-3.0)).
