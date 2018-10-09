---
id: overview
title: Overview
---

`krypton-js` 是一个与KAZE区块链接口的 Javascript 库，提供快速简单的方法发送RPC调用，创建交易和简单的合约调用。

## 特征

- 内置的 RPC 查询
- 交易创建，序列化和反序列化
- 钱包密钥操作
- 智能合约脚本生成器
- 第三方 API 支持

## 用法

`krypton-js` 可以用两种方式使用：

### 语义（全部导入）

`krypton-js` 的默认导入是一个 Javascript 对象，其功能按照动词-名词约定以语义方式排列。如果一个方法超过了2个级别，名字的其余部分是在名词级别用驼峰命名法。

```js
import Krypton from '@kazeblockchain/krypton-js'
Krypton.create.privateKey()
Krypton.serialize.tx(transactionObj)
Krypton.get.publicKeyFromPrivateKey(privateKey)
```

这种风格是建议初学者或任何只是希望使用Krypton没有麻烦的人。

### Named

命名导入（精确导入）是传统的JS导入。`krypton-js` 中的模块是：

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

这种风格提供更多的控制和灵活性。请务必参阅每个模块导出的源代码。
