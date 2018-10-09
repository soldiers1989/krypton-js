---
id: api-settings
title: Settings
---

```js
import Krypton, {settings} from '@kazeblockchain/krypton-js'

// Semantic access
const newNet = new Krypton.rpc.Network({name:'NewNet'})
Krypton.add.network(newNet)

// Direct access
Krypton.settings.httpsOnly = true
```

## httpsOnly

`boolean`

Affects the results of `getRPCEndpoint` from kryptonDB and kazescan. If set to `true`, `getRPCEndpoint` will only return https nodes. If there are no available nodes, it will cause the method to throw an error instead.

## networks

`{[network:string]: Network}`

This contains all the networks avaiable for use in `krypton-js`. The default networks included are `MainNet`, `TestNet` and `VertoNet`.

There are 2 helper functions that aids in adding or removing networks

```js
const customMainNet = new Network('MainNet')
// This overrides the existing MainNet with your custom configuration
settings.addNetwork(customMainNet, true)

settings.removeNetwork('TestNet')
```

## timeout

`{[category: string]: number}`

This contains the timeouts set for the different network categories. There are currently 2 categories available: `ping` and `rpc`.

## defaultCalculationStrategy

`(assetBalance: AssetBalance, requiredAmt: Fixed8) => Coin[]`

The default strategy to use when calculating the inputs used. You can find the different strategies available at `tx.calculationStrategy`. The default setting is `balancedApproach` which naively tries to find a good mix of inputs.
