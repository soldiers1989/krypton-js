---
id: overview
title: Overview
---

``krypton-js`` is a Javascript library to interface with KAZE blockchain, providing quick and easy methods to send RPC calls, create transactions and simple contract invocations.

## Features

- Built-in RPC queries
- Transaction creation, serialization and deserialization
- Wallet key manipulation
- Smart Contract script builder
- 3rd party API support

## Usage

Krypton can be used in 2 ways:

### Semantic

The default import for Krypton is a Javascript object where functions are arranged in a semantic manner following the convention of Verb-Noun. If a method goes beyond 2 levels, the rest of the name is camelCased at the noun level.

```js
import Krypton from '@kazeblockchain/krypton-js'
Krypton.create.privateKey()
Krypton.serialize.tx(transactionObj)
Krypton.get.publicKeyFromPrivateKey(privateKey)
```

This style is recommended for beginners or anyone who just wishes to use Krypton without hassle.

### Named

Named imports are the conventional JS imports. The modules in Krypton are:

- `api`
- `CONST`
- `rpc`
- `sc`
- `tx`
- `u`
- `wallet`

```js
import { api } from '@kazeblockchain/krypton-js'
```

This style offers more control and flexibility. Do refer to the source code for each module's exports.
