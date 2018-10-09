---
id: api-u
title: Utility
---

The utility module is exposed as:

```js
import Krypton from '@kazeblockchain/krypton-js'
Krypton.u.reverseHex(hexstring)

import { u } from '@kazeblockchain/krypton-js'
u.reverseHex(hexstring)
```

The utility module contains:

- Format manipulation methods
- Hashing methods
- Utility classes

## Classes

### StringStream

StringStream is a simple stream object that allows us to read a hexstring byte by byte. It is not an actual stream but fakes the stream interface for better manipulation. It stores the whole string and a pointer to keep track of the current position on the string.

It is used in serializing and deserializing a transaction object. The ScriptBuilder class for smart contracts inherits from StringStream.

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

Fixed8 is a class based off bignumber.js for storage and accurate calculations of values. It is extended to have helper methods for converting between decimal and hex representation.

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

## Methods

### Format

While most of the methods in Krypton takes in strings and outputs strings, the underlying logic requires a lot of format conversions.

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

The most common format is hex string. This is a string where every 2 characters represents a byte in an bytearray. `krypton-js` intentionally works with hex strings because strings are easy to print and manipulate.

A special format used in KAZE is the fixed8 number format. It is a fixed point float with precision of 8 decimal places. It is usually received as a hexstring from `getrawtransaction`. `krypton-js` has functions to convert it to and from a JS number type.

### Hashing

These methods are convenient wrappers around the CryptoJS functions. They take in strings and return strings.

```js
import Krypton from '@kazeblockchain/krypton-js'
// Performs a single SHA
Krypton.u.sha256(item)
// Performs a SHA followed by a SHA
Krypton.u.hash256(item)
// Performs a SHA followed by a RIPEMD160
Krypton.u.hash160(item)
```

