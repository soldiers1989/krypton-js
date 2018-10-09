---
id: installation
title: Installation
---

`krypton-js` lives in the NPM system under the organization `kazeblockchain`.

## Install

To install

```sh
npm install @kazeblockchain/krypton-js
```

For a specific commit or release, add the commit hash / tag / branch behind:

```sh
npm install @kazeblockchain/krypton-js#dev
```

## Import

krypton-js supports 2 kinds of imports.

A default import will import the semantic version of krypton. Use this if you are new or just want the whole package to use.

```js
import Krypton from '@kazeblockchain/krypton-js'

Krypton.create.claimTx(...args)
const query = Krypton.create.query()
```

Modules are exposed through named imports. This allows more fine grained control and access to individual modules.

```js
import {rpc, tx} from '@kazeblockchain/krypton-js'

Krypton.tx.createClaimTx(...args)
const query = new rpc.Query()
```

## Require

As krypton-js package uses ES6 module conventions, `require` will need to specify which module do they want exactly:

```js
var krypton-js = require('@kazeblockchain/krypton-js')

// Semantic Style by using default import
var Krypton = krypton-js.default
const query = Krypton.create.query()

// Named imports are available too
var wallet = krypton-js.wallet
var tx = krypton-js.tx

const account = new wallet.Account(privateKey)
```

## Web

krypton-js is also packaged for the web. You can add it through a script tag

```html
  <script src="./lib/browser.js"></script>
```

The library will be available as a global variable `Krypton`. Similar to `require` style, you will have the semantic style under `default` and the rest of the named modules exposed at the same level.
