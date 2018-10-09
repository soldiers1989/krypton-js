/**
 * @file Core methods for manipulating keys
 * KEP2 <=> WIF <=> Private => Public => ScriptHash <=> Address
 * Keys are arranged in order of derivation.
 * Arrows determine the direction.
 *
 * KEP2 methods are found within KEP2 standard.
 * All methods take in Big-Endian strings and return Big-Endian strings.
 */
import WIF from 'wif'
import BN from 'bn.js'
import { ec as EC } from 'elliptic'
import base58 from 'bs58'
import { hexstring2ab, ab2hexstring, reverseHex, sha256, hash160, hash256 } from '../utils'
import { ADDR_VERSION } from '../consts'
import secureRandom from 'secure-random'

const curve = new EC('p256')

/**
 * @param {string} publickey - unencoded public key
 * @return {string} encoded public key
 */
export const getPublicKeyEncoded = (publicKey) => {
  let publicKeyArray = hexstring2ab(publicKey)
  if (publicKeyArray[64] % 2 === 1) {
    return '03' + ab2hexstring(publicKeyArray.slice(1, 33))
  } else {
    return '02' + ab2hexstring(publicKeyArray.slice(1, 33))
  }
}

/**
 * @param {string} publicKey - Encoded public key
 * @return {string} decoded public key
 */
export const getPublicKeyUnencoded = (publicKey) => {
  let keyPair = curve.keyFromPublic(publicKey, 'hex')
  return keyPair.getPublic().encode('hex')
}

/**
 * @param {string} wif
 * @return {string}
 */
export const getPrivateKeyFromWIF = (wif) => {
  return ab2hexstring(WIF.decode(wif, 128).privateKey)
}

/**
 * @param {string} privateKey
 * @return {string}
 */
export const getWIFFromPrivateKey = (privateKey) => {
  return WIF.encode(128, Buffer.from(privateKey, 'hex'), true)
}

/**
 * Calculates the public key from a given private key.
 * @param {string} privateKey
 * @param {boolean} encode - Returns the encoded form if true.
 * @return {string}
 */
export const getPublicKeyFromPrivateKey = (privateKey, encode = true) => {
  const curve = new EC('p256')
  const keypair = curve.keyFromPrivate(privateKey, 'hex')
  const unencodedPubKey = keypair.getPublic().encode('hex')
  if (encode) {
    let tail = parseInt(unencodedPubKey.substr(64 * 2, 2), 16)
    if (tail % 2 === 1) {
      return '03' + unencodedPubKey.substr(2, 64)
    } else {
      return '02' + unencodedPubKey.substr(2, 64)
    }
  } else return unencodedPubKey
}

/**
 * VerificationScript serves a very niche purpose.
 * It is attached as part of the signature when signing a transaction.
 * Thus, the name 'scriptHash' instead of 'keyHash' is because we are hashing the verificationScript and not the PublicKey.
 * @param {string} publicKey
 * @return {string}
 */
export const getVerificationScriptFromPublicKey = (publicKey) => {
  return '21' + publicKey + 'ac'
}

/**
 * @param {string} publicKey
 * @return {string}
 */
export const getScriptHashFromPublicKey = (publicKey) => {
  // if unencoded
  if (publicKey.substring(0, 2) === '04') {
    publicKey = getPublicKeyEncoded(publicKey)
  }
  const verificationScript = getVerificationScriptFromPublicKey(publicKey)
  return reverseHex(hash160(verificationScript))
}

/**
 * @param {string} scriptHash
 * @return {string}
 */
export const getAddressFromScriptHash = (scriptHash) => {
  scriptHash = reverseHex(scriptHash)
  const shaChecksum = hash256(ADDR_VERSION + scriptHash).substr(0, 8)
  return base58.encode(Buffer.from(ADDR_VERSION + scriptHash + shaChecksum, 'hex'))
}

/**
 * @param {string} address
 * @return {string}
 */
export const getScriptHashFromAddress = (address) => {
  let hash = ab2hexstring(base58.decode(address))
  return reverseHex(hash.substr(2, 40))
}

/**
 * Generates a signature of the transaction based on given private key.
 * @param {string} hex - Serialized unsigned transaction. or hexstring.
 * @param {string} privateKey - Private Key.
 * @return {string} Signature. Does not include tx.
 */
export const generateSignature = (hex, privateKey) => {
  const msgHash = sha256(hex)
  const msgHashHex = Buffer.from(msgHash, 'hex')

  let elliptic = new EC('p256')
  const sig = elliptic.sign(msgHashHex, privateKey, null)
  const signature = Buffer.concat([
    sig.r.toArrayLike(Buffer, 'be', 32),
    sig.s.toArrayLike(Buffer, 'be', 32)
  ])

  return signature.toString('hex')
}

/**
 * Verifies a hexstring is signed by public key.
 * @param {string} hex - Original message in HEX.
 * @param {string} signature - HEX signature.
 * @param {string} publicKey - public key.
 * @return {bool} Validity of signature.
 */
export const verifySignature = (hex, signature, publicKey) => {
  const sig = getSignatureFromHex(signature)

  const messageHash = sha256(hex)
  return curve.verify(messageHash, sig, publicKey, 'hex')
}

/**
 * Converts signatureHex to a signature object with r & s.
 * @param {string} signatureHex
 */
const getSignatureFromHex = signatureHex => {
  const signatureBuffer = Buffer.from(signatureHex, 'hex')
  const r = new BN(signatureBuffer.slice(0, 32).toString('hex'), 16, 'be')
  const s = new BN(signatureBuffer.slice(32).toString('hex'), 16, 'be')
  return {
    r: r,
    s: s
  }
}

/**
 * Generates a random private key
 * @returns {string}
 */
export const generatePrivateKey = () => {
  return ab2hexstring(secureRandom(32))
}

/**
 * Generates a arrayBuffer filled with random bits.
 * @param {number} length - Length of buffer.
 * @returns {ArrayBuffer}
 */
export const generateRandomArray = (length) => {
  return secureRandom(length)
}
