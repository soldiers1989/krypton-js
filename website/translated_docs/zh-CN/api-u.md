---
id: api-u
title: 工具
---

工具模块暴露为：

```js
import Krypton from '@kazeblockchain/krypton-js'
Krypton.u.reverseHex(hexstring)

import { u } from '@kazeblockchain/krypton-js'
u.reverseHex(hexstring)
```

该工具模块包含：

- 格式操作方法
- 散列法
- 工具类

## 类

### StringStream

`StringStream` 是一个简单的流对象，允许我们逐字节读取一个十六进制字符串。这不是一个实际的流，但假装为流接口以实现更好的操作。它存储整个字符串和一个指针，以跟踪字符串上的当前位置。

它用于序列化和反序列化事务对象。用于智能合约的 `ScriptBuilder` 类从 `StringStream` 继承。

```js
import Krypton from '@kazeblockchain/krypton-js'
const ss = new Krypton.u.StringStream('abcdefgh')
ss.read(1) // 'ab'
ss.read(2) // 'cdef'
ss.isEmpty() // false
ss.read(1) // 'gh'
ss.isEmpty() // true
ss.str // 'abcdefgh'
```

### Fixed8

Fixed8是一个基于 `bignumber.js` 的类，用于存储和精确计算值。 它被扩展为具有用于在十进制和十六进制表示之间转换的辅助方法。

```js
import Krypton from '@kazeblockchain/krypton-js'
const a = new Krypton.u.Fixed8(1)
a.toHex()        // '0000000005f5e100'
a.toReverseHex() // '00e1f50500000000'

const b = Krypton.u.Fixed8.fromHex('0000000005f5e100') // 1

import {u} from '@kazeblockchain/krypton-js'
const c = new u.Fixed8('2')
const d = u.Fixed8.fromReverseHex('00e1f50500000000')
```

## 方法

### 格式

虽然Krypton中的大多数方法都会接受字符串并输出字符串，但底层逻辑需要进行大量的格式转换。

```js
import Krypton from '@kazeblockchain/krypton-js'
Krypton.u.reverseHex(hexstring)
Krypton.u.num2fixed8(1)
Krypton.u.ab2str(arrayBuffer)

// Conversions to hex
Krypton.u.str2hexstring('normalString') // 6e6f726d616c537472696e67
Krypton.u.int2hex(234) // EA
Krypton.u.ab2hexstring(arrayBuffer)

// Conversion from hex
Krypton.u.hexstring2str('6e6f726d616c537472696e67') // normalString
Krypton.u.hex2int('EA') // 234
Krypton.u.hexstring2ab(hexString)
```

最常见的格式是十六进制字符串。这是一个字符串，每2个字符代表一个字节数组中的一个字节。`krypton-js` 故意使用十六进制字符串，因为字符串很容易打印和操作。

### 散列法

这些方法是围绕在 CryptoJS 函数的方便包装。他们接受字符串并返回字符串。

```js
import Krypton from '@kazeblockchain/krypton-js'
// Performs a single SHA
Krypton.u.sha256(item)
// Performs a SHA followed by a SHA
Krypton.u.hash256(item)
// Performs a SHA followed by a RIPEMD160
Krypton.u.hash160(item)
```

