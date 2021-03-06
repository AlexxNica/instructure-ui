[npm]: https://img.shields.io/npm/v/@instructure/ui-codemods.svg
[npm-url]: https://npmjs.com/package/@instructure/ui-codemods

### @instructure/ui-codemods

InstructureUI codemods should make it easier to deal with API changes to `@instructure/ui-core`.

[![npm][npm]][npm-url]

### Installation

```sh
npm install @instructure/ui-codemods
```

### Updating Deprecated Props

This codemod helps you update your project by renaming `props` that have had names changed (e.g., `onReady` => `onOpen`). If you have a project that uses `@instructure/ui-core` this codemod is for you.

`jscodeshift -t node_modules/@instructure/ui-codemods/lib/updatePropNames.js <path> --config=node_modules/@instructure/ui-core/config/propNames.config.json`

### Updating Package Imports

This codemod helps you update your project by renaming `imports` that have changed (e.g., `instructure-ui` => `@instructure/ui-core`).

`jscodeshift -t node_modules/@instructure/ui-codemods/lib/updateImports.js <path> --config=node_modules/@instructure/ui-core/config/imports.config.json`
