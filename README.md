# RC Tracks Editor

An editor to build a RC track using the tiles from [jsconan/rc-tracks](https://github.com/jsconan/rc-tracks/tree/main/scale-64)

## Quick start

Checkout the branch, then install the application

```sh
git clone git@github.com:jsconan/rc-tracks-editor.git
rc-tracks-editor
npm i
```

## Running the application

Then application can open from the displayed URL.

```sh
npm run preview
```

## Requirements

The library requires Node.js 14 and above.

## Development

### Running the application with live reload

While developing the application can be run with live reload.
After each change, the page will be updated.

```sh
npm run dev
```

### Building the code

A distributable can be generated into the `dist` folder:

```sh
npm run build
```

### Checking code style

The code style rules are enforced thanks to ESLint and Prettier.
Files can be checked:

```sh
npm run lint
```

### Enforcing code style

The code style rules are enforced thanks to ESLint and Prettier.
Files can be formatted:

```sh
npm run format
```

### Checking spelling

The spelling can be verified by CSpell:

```sh
npm run spell
```

## License

Copyright (c) 2022 Jean-Sébastien CONAN
Distributed under the GPL-3.0 License (See LICENSE file or copy at [https://opensource.org/licenses/GPL-3.0](https://opensource.org/licenses/GPL-3.0)).
