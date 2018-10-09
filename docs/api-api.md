---
id: api-api
title: API
---

The API module is exposed as:

```js
import Krypton from '@kazeblockchain/krypton-js'
Krypton.get.balance('TestNet', address)
Krypton.get.tokenBalance(contractScriptHash)

import { api } from '@kazeblockchain/krypton-js'
api.kryptonDB.getBalance('TestNet', address)
api.cmc.getPrice()
api.sendAsset(config)
```

The `api` module contains all 3rd party API that is useful together with Krypton. The main highlight is the KryptonDB API which provides the necessary information to construct a ClaimTransaction or ContractTransaction. A normal KAZE node does not provide us with a convenient way of retrieving the balance or claimable transactions through RPC.

However, do note that these APIs rely on hosted nodes by 3rd party and thus use them at your own risk.

This module is structured slightly different from the rest of the modules. While the rest of the modules are flat in terms of hierachy, this module is composed of largely many other submodules. Only the core methods are found at the top level of the module.

## Core

These are core methods that help to tie up the different 3rd party APIs in order to simplify transaction creation and sending.

`core` methods are exposed at the top level of `api`. The 3 high level methods are:

1. `claimStream`
2. `sendAsset`
3. `doInvoke`

```js
import Krypton from '@kazeblockchain/krypton-js'
const config = {
  net: 'TestNet'
  address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
  privateKey: '7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344'
}
Krypton.api.claimStream(config)
.then((conf) => {
  console.log(conf.response)
})

import {api} from '@kazeblockchain/krypton-js'
api.claimStream(config)
.then((conf) => {
  console.log(conf.response)
})
```

These methods are the core functionality that `krypton-js` will maintain. There is in built API selection that will choose the more reliable API between kryptonDB and kazescan based on past transactions.

The methods revolve around passing an configuration object containing all information down the chain. Each method digests the necessary information within the configuration object to perform its task and pass down the configuration object with new information added to it.

```js
import {api} from '@kazeblockchain/krypton-js'
// This chain is basically api.claimStream
api.getClaimsFrom(config, api.kryptonDB)
.then((c) => api.createTx(c, 'claim'))
.then((c) => api.signTx(c))
.then((c) => api.sendTx(c))
```

## KryptonDB

The `kryptonDB` API is exposed as:

```js
import Krypton from '@kazeblockchain/krypton-js'
Krypton.get.balance('TestNet', address)
Krypton.do.claimAllStream('TestNet', privateKey)

import {api} from '@kazeblockchain/krypton-js'
api.kryptonDB.getBalance('TestNet', address)
api.kryptonDB.doClaimAllStream('TestNet', privateKey)
```

The KryptonDB API describes the API set exposed by [krypton-wallet-db](https://github.com/kazeblockchain/krypton-wallet-db) as well as other convenient methods. The node is hosted by kazeblockchain.

The API returns useful information that is not built into standard KAZE nodes such as claimable transactions or spendable coins. These information are used to construct transactions.

For example, the `getBalance` method returns a list of spendable assets of a specific address. This is then used to construct a ContractTransaction.

## Kazescan

The `kazescan` API serves as a backup in case KryptonDB fails. It is not exposed in semantic exports. Instead, use named exports:

```js
import {api} from '@kazeblockchain/krypton-js'
api.kazescan.getBalance('TestNet', address)
api.kazescan.getClaims('MainNet', address)
```

The methods found here are similar to KryptonDB. Methods will return similar data structures to what is expected from KryptonDB.

## CoinMarketCap

A straightforward call to CoinMarketCap API to retrieve the latest price information. This is exposed as `cmc` within `api`.

```js
import Krypton from '@kazeblockchain/krypton-js'
Krypton.get.price('KAZE', 'EUR')
Krypton.get.price('STREAM') // defaults to USD
Krypton.get.prices(['KAZE', 'STREAM'], 'EUR')
Krypton.get.prices(['KAZE', 'STREAM']) // defaults to USD

import { api } from '@kazeblockchain/krypton-js'
api.cmc.getPrice('KAZE', 'SGD')
api.cmc.getPrices(['KAZE', 'STREAM'], 'SGD')
```

## KEP5

The KEP5 Standard describes a set of methods to implement as a token in a smart contract. This is the KAZE equivalent of the ERC-20 token standard in Ethereum.

This set of methods rely on the KAZE node having version >= 2.3.3. The method uses `DEFAULT_RPC` found in constants as the default node.

```js
import Krypton from '@kazeblockchain/krypton-js'
const rpxScriptHash = Krypton.CONST.CONTRACTS.TEST_RPX
const nxtScriptHash = Krypton.CONST.CONTRACTS.TEST_NXT
Krypton.get.tokenInfo('http://node1.kaze.solutions:44886', rpxScriptHash)
Krypton.get.tokenBalance('http://node1.kaze.solutions:44886', rpxScriptHash, address)

import { api } from '@kazeblockchain/krypton-js'
api.kep5.getTokenInfo('http://node.kaze.solutions:44886', rpxScriptHash)
api.kep5.getTokenBalance('http://node1.kaze.solutions:44886', rpxScriptHash)
api.kep5.getTokenBalances(
  'http://node1.kaze.solutions:44886',
  [rpxScriptHash, nxtScriptHash],
  address
)
// This is a combination of both info and balance within a single call
api.kep5.getToken('http://node1.kaze.solutions:44886', rpxScriptHash, address)
```
