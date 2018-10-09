---
id: installation
title: Installation
---

`krypton-js` 项目被放在 NPM 中，在 `kazeblockchain` 组织下。

## 安装

安装方法：

```sh
npm install @kazeblockchain/krypton-js
```

对于特定的提交（commit）或发布（release），请在后面添加提交哈希/标签/分支：

```sh
npm install @kazeblockchain/krypton-js#dev
```

## 导入 krypton-js 使用 Import

`krypton-js` 支持两种 Import 方式。

默认导入将导入 `krypton-js` 的语义版本。如果你是新人或者只是想要使用整个包，请使用它。

```js
import Krypton from '@kazeblockchain/krypton-js'

Krypton.create.claimTx(...args)
const query = Krypton.create.query()
```

模块通过命名导入（named imports）来暴露。这允许更细粒度的控制和访问单个模块。

```js
import {rpc, tx} from '@kazeblockchain/krypton-js'

Krypton.tx.createClaimTx(...args)
const query = new rpc.Query()
```

## 导入krypton-js，使用Require

由于 `krypton-js` 包使用ES6模块约定，`require` 因此需要指定它们想要的模块：

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

## 导入krypton-js, 使用Script标签

`krypton-js` 也为 Web 打包。您可以通过脚本（Script）标签添加它：

```html
<script src="./lib/browser.js"></script>
```

该库将作为全局变量 `Krypton` 被提供。与 `require` 样式类似，您将具有 `default` 下的语义样式和在暴露在同一级别下其余的命名模块。
